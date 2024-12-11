import React, { createContext, useContext, useState, useEffect } from 'react';
import { InventoryItem, Warehouse, WastageRecord, SaleRecord } from '../types';
import { inventoryService } from '../services/inventoryService';

interface InventoryContextType {
  inventory: InventoryItem[];
  warehouses: Warehouse[];
  loading: boolean;
  error: string | null;
  addItem: (item: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateItem: (id: string, item: Partial<InventoryItem>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  addWarehouse: (warehouse: Omit<Warehouse, 'id'>) => Promise<void>;
  updateWarehouse: (id: string, warehouse: Partial<Warehouse>) => Promise<void>;
  deleteWarehouse: (id: string) => Promise<void>;
  transferItem: (itemId: string, targetWarehouseId: string, quantity: number) => Promise<void>;
  recordWastage: (wastage: Omit<WastageRecord, 'id'>) => Promise<void>;
  recordSale: (sale: Omit<SaleRecord, 'id'>) => Promise<void>;
  getLowStockItems: () => InventoryItem[];
  refreshData: () => Promise<void>;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [inventoryData, warehousesData] = await Promise.all([
        inventoryService.getInventory(),
        inventoryService.getWarehouses(),
      ]);
      setInventory(inventoryData);
      setWarehouses(warehousesData);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch data');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const addItem = async (item: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setError(null);
      const newItem = await inventoryService.addItem(item);
      setInventory([...inventory, newItem]);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to add item');
      throw error;
    }
  };

  const updateItem = async (id: string, updates: Partial<InventoryItem>) => {
    try {
      setError(null);
      const updatedItem = await inventoryService.updateItem(id, updates);
      setInventory(inventory.map(item => item.id === id ? updatedItem : item));
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update item');
      throw error;
    }
  };

  const deleteItem = async (id: string) => {
    try {
      setError(null);
      await inventoryService.deleteItem(id);
      setInventory(inventory.filter(item => item.id !== id));
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete item');
      throw error;
    }
  };

  const addWarehouse = async (warehouse: Omit<Warehouse, 'id'>) => {
    try {
      setError(null);
      const newWarehouse = await inventoryService.addWarehouse(warehouse);
      setWarehouses([...warehouses, newWarehouse]);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to add warehouse');
      throw error;
    }
  };

  const updateWarehouse = async (id: string, updates: Partial<Warehouse>) => {
    try {
      setError(null);
      const updatedWarehouse = await inventoryService.updateWarehouse(id, updates);
      setWarehouses(warehouses.map(w => w.id === id ? updatedWarehouse : w));
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update warehouse');
      throw error;
    }
  };

  const deleteWarehouse = async (id: string) => {
    try {
      setError(null);
      await inventoryService.deleteWarehouse(id);
      setWarehouses(warehouses.filter(w => w.id !== id));
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete warehouse');
      throw error;
    }
  };

  const transferItem = async (itemId: string, targetWarehouseId: string, quantity: number) => {
    try {
      setError(null);
      const sourceItem = inventory.find(item => item.id === itemId);
      if (!sourceItem || sourceItem.quantity < quantity) {
        throw new Error('Invalid transfer: Insufficient quantity');
      }

      const existingTargetItem = inventory.find(
        item => item.name === sourceItem.name && item.warehouseId === targetWarehouseId
      );

      if (existingTargetItem) {
        await updateItem(existingTargetItem.id, {
          quantity: existingTargetItem.quantity + quantity
        });
      } else {
        await addItem({
          ...sourceItem,
          quantity,
          warehouseId: targetWarehouseId,
        });
      }

      await updateItem(itemId, {
        quantity: sourceItem.quantity - quantity
      });

      await refreshData();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to transfer item');
      throw error;
    }
  };

  const recordWastage = async (wastage: Omit<WastageRecord, 'id'>) => {
    try {
      setError(null);
      const item = inventory.find(i => i.id === wastage.itemId);
      if (!item || item.quantity < wastage.quantity) {
        throw new Error('Invalid wastage: Insufficient quantity');
      }

      await Promise.all([
        inventoryService.addWastageRecord(wastage),
        updateItem(wastage.itemId, {
          quantity: item.quantity - wastage.quantity
        })
      ]);

      await refreshData();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to record wastage');
      throw error;
    }
  };

  const recordSale = async (sale: Omit<SaleRecord, 'id'>) => {
    try {
      setError(null);
      const item = inventory.find(i => i.id === sale.itemId);
      if (!item || item.quantity < sale.quantity) {
        throw new Error('Invalid sale: Insufficient quantity');
      }

      await Promise.all([
        inventoryService.addSaleRecord(sale),
        updateItem(sale.itemId, {
          quantity: item.quantity - sale.quantity
        })
      ]);

      await refreshData();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to record sale');
      throw error;
    }
  };

  const getLowStockItems = () => {
    return inventory.filter(item => item.quantity <= item.threshold);
  };

  return (
    <InventoryContext.Provider value={{
      inventory,
      warehouses,
      loading,
      error,
      addItem,
      updateItem,
      deleteItem,
      addWarehouse,
      updateWarehouse,
      deleteWarehouse,
      transferItem,
      recordWastage,
      recordSale,
      getLowStockItems,
      refreshData,
    }}>
      {children}
    </InventoryContext.Provider>
  );
}

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};