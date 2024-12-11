import React from 'react';
import { useInventory } from '../../context/InventoryContext';
import { AlertTriangle } from 'lucide-react';

export default function LowStockNotifications() {
  const { getLowStockItems } = useInventory();
  const lowStockItems = getLowStockItems();

  if (lowStockItems.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-red-900 rounded-lg shadow-lg p-4 max-w-sm">
        <div className="flex items-center mb-2">
          <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
          <h3 className="text-lg font-medium text-white">Low Stock Alert</h3>
        </div>
        <div className="space-y-2">
          {lowStockItems.map(item => (
            <div key={item.id} className="text-sm text-gray-300">
              {item.name} - Only {item.quantity} left (Threshold: {item.threshold})
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}