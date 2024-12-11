import React, { useState } from 'react';
import { useInventory } from '../../context/InventoryContext';
import { Edit2, Trash2, Building2, Plus } from 'lucide-react';
import { Warehouse } from '../../types';
import WarehouseForm from './WarehouseForm';

export default function WarehouseList() {
  const { warehouses, inventory, deleteWarehouse } = useInventory();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [warehouseToEdit, setWarehouseToEdit] = useState<Warehouse | undefined>();

  const handleEdit = (warehouse: Warehouse) => {
    setWarehouseToEdit(warehouse);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setWarehouseToEdit(undefined);
  };

  const getWarehouseStats = (warehouseId: string) => {
    const warehouseItems = inventory.filter(item => item.warehouseId === warehouseId);
    const totalItems = warehouseItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalValue = warehouseItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const uniqueItems = warehouseItems.length;
    return { totalItems, totalValue, uniqueItems };
  };

  return (
    <div className="bg-black rounded-lg shadow-lg p-6 mt-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Building2 className="h-6 w-6 text-violet-500 mr-2" />
          <h2 className="text-xl font-semibold text-white">Warehouses</h2>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Warehouse
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {warehouses.map((warehouse) => {
          const stats = getWarehouseStats(warehouse.id);
          return (
            <div key={warehouse.id} className="bg-gray-900 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-white">{warehouse.name}</h3>
                  <p className="text-gray-400">{warehouse.location}</p>
                  <div className="mt-4 space-y-2">
                    <p className="text-sm text-gray-300">
                      Total Items: <span className="text-white font-medium">{stats.totalItems}</span>
                    </p>
                    <p className="text-sm text-gray-300">
                      Unique Items: <span className="text-white font-medium">{stats.uniqueItems}</span>
                    </p>
                    <p className="text-sm text-gray-300">
                      Total Value: <span className="text-green-500 font-medium">${stats.totalValue.toFixed(2)}</span>
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    className="text-blue-500 hover:text-blue-400"
                    onClick={() => handleEdit(warehouse)}
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button 
                    className="text-red-500 hover:text-red-400"
                    onClick={() => deleteWarehouse(warehouse.id)}
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <WarehouseForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        warehouseToEdit={warehouseToEdit}
      />
    </div>
  );
}