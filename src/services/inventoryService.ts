import { supabase } from '../lib/supabase';
import { InventoryItem, Warehouse, WastageRecord, SaleRecord } from '../types';

export const inventoryService = {
  // Inventory Items
  async getInventory() {
    const { data, error } = await supabase
      .from('inventory')
      .select('*');
    if (error) throw error;
    return data as InventoryItem[];
  },

  async addItem(item: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>) {
    const { data, error } = await supabase
      .from('inventory')
      .insert([item])
      .select()
      .single();
    if (error) throw error;
    return data as InventoryItem;
  },

  async updateItem(id: string, updates: Partial<InventoryItem>) {
    const { data, error } = await supabase
      .from('inventory')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as InventoryItem;
  },

  async deleteItem(id: string) {
    const { error } = await supabase
      .from('inventory')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // Warehouses
  async getWarehouses() {
    const { data, error } = await supabase
      .from('warehouses')
      .select('*');
    if (error) throw error;
    return data as Warehouse[];
  },

  async addWarehouse(warehouse: Omit<Warehouse, 'id'>) {
    const { data, error } = await supabase
      .from('warehouses')
      .insert([warehouse])
      .select()
      .single();
    if (error) throw error;
    return data as Warehouse;
  },

  async updateWarehouse(id: string, updates: Partial<Warehouse>) {
    const { data, error } = await supabase
      .from('warehouses')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Warehouse;
  },

  async deleteWarehouse(id: string) {
    const { error } = await supabase
      .from('warehouses')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // Wastage Records
  async getWastageRecords() {
    const { data, error } = await supabase
      .from('wastage_records')
      .select('*');
    if (error) throw error;
    return data as WastageRecord[];
  },

  async addWastageRecord(record: Omit<WastageRecord, 'id'>) {
    const { data, error } = await supabase
      .from('wastage_records')
      .insert([record])
      .select()
      .single();
    if (error) throw error;
    return data as WastageRecord;
  },

  // Sales Records
  async getSalesRecords() {
    const { data, error } = await supabase
      .from('sales_records')
      .select('*');
    if (error) throw error;
    return data as SaleRecord[];
  },

  async addSaleRecord(record: Omit<SaleRecord, 'id'>) {
    const { data, error } = await supabase
      .from('sales_records')
      .insert([record])
      .select()
      .single();
    if (error) throw error;
    return data as SaleRecord;
  },
};