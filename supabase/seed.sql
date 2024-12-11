-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tables
CREATE TABLE IF NOT EXISTS warehouses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE TABLE IF NOT EXISTS inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  price DECIMAL(10,2) NOT NULL,
  expiry_date DATE,
  warehouse_id UUID REFERENCES warehouses(id),
  threshold INTEGER NOT NULL DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE TABLE IF NOT EXISTS wastage_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_id UUID REFERENCES inventory(id),
  quantity INTEGER NOT NULL,
  reason TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE TABLE IF NOT EXISTS sales_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_id UUID REFERENCES inventory(id),
  quantity INTEGER NOT NULL,
  price_per_unit DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create materialized views for better performance
CREATE MATERIALIZED VIEW inventory_stats AS
SELECT 
  COALESCE(SUM(quantity), 0) as total_items,
  COUNT(DISTINCT id) as unique_items,
  COALESCE(SUM(quantity * price), 0) as total_value
FROM inventory;

CREATE MATERIALIZED VIEW wastage_stats AS
SELECT 
  COALESCE(SUM(quantity), 0) as wasted_items_count,
  COUNT(DISTINCT id) as wastage_records_count
FROM wastage_records;

CREATE MATERIALIZED VIEW sales_stats AS
SELECT 
  COALESCE(SUM(quantity), 0) as sold_items_count,
  COALESCE(SUM(total_price), 0) as total_sales_amount,
  COUNT(DISTINCT id) as sales_records_count
FROM sales_records;

CREATE MATERIALIZED VIEW monthly_sales_stats AS
SELECT 
  COALESCE(SUM(quantity), 0) as monthly_items_sold,
  COALESCE(SUM(total_price), 0) as monthly_revenue
FROM sales_records
WHERE date >= date_trunc('month', CURRENT_DATE);

-- Create refresh function for materialized views
CREATE OR REPLACE FUNCTION refresh_dashboard_stats()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY inventory_stats;
  REFRESH MATERIALIZED VIEW CONCURRENTLY wastage_stats;
  REFRESH MATERIALIZED VIEW CONCURRENTLY sales_stats;
  REFRESH MATERIALIZED VIEW CONCURRENTLY monthly_sales_stats;
END;
$$ LANGUAGE plpgsql;

-- Create function to get dashboard summary
CREATE OR REPLACE FUNCTION get_dashboard_summary()
RETURNS TABLE (
  total_inventory_items BIGINT,
  total_wasted_items BIGINT,
  total_sold_items BIGINT,
  monthly_sales_revenue DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    i.total_items,
    w.wasted_items_count,
    s.sold_items_count,
    m.monthly_revenue
  FROM 
    inventory_stats i,
    wastage_stats w,
    sales_stats s,
    monthly_sales_stats m;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to refresh stats after data changes
CREATE OR REPLACE FUNCTION refresh_stats_trigger()
RETURNS trigger AS $$
BEGIN
  PERFORM refresh_dashboard_stats();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER refresh_inventory_stats
AFTER INSERT OR UPDATE OR DELETE ON inventory
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_stats_trigger();

CREATE TRIGGER refresh_wastage_stats
AFTER INSERT OR UPDATE OR DELETE ON wastage_records
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_stats_trigger();

CREATE TRIGGER refresh_sales_stats
AFTER INSERT OR UPDATE OR DELETE ON sales_records
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_stats_trigger();

-- Initial data refresh
SELECT refresh_dashboard_stats();