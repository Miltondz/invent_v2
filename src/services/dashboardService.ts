import { supabase } from '../lib/supabase';

export interface DashboardSummary {
  totalInventoryItems: number;
  totalWastedItems: number;
  totalSoldItems: number;
  monthlySalesRevenue: number;
}

export const dashboardService = {
  async getDashboardSummary(): Promise<DashboardSummary> {
    try {
      const { data, error } = await supabase.rpc('get_dashboard_summary');
      
      if (error) throw error;
      
      return {
        totalInventoryItems: Number(data[0]?.total_inventory_items) || 0,
        totalWastedItems: Number(data[0]?.total_wasted_items) || 0,
        totalSoldItems: Number(data[0]?.total_sold_items) || 0,
        monthlySalesRevenue: Number(data[0]?.monthly_sales_revenue) || 0
      };
    } catch (error) {
      console.error('Error fetching dashboard summary:', error);
      return {
        totalInventoryItems: 0,
        totalWastedItems: 0,
        totalSoldItems: 0,
        monthlySalesRevenue: 0
      };
    }
  }
};