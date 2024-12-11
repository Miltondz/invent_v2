import React, { useState } from 'react';
import { useInventory } from '../../context/InventoryContext';
import { InventoryItem } from '../../types';
import Modal from '../common/Modal';

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: InventoryItem;
}

export default function TransferModal({ isOpen, onClose, item }: TransferModalProps) {
  const { warehouses, transferItem } = useInventory();
  const [quantity, setQuantity] = useState(1);
  const [targetWarehouseId, setTargetWarehouseId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    transferItem(item.id, targetWarehouseId, quantity);
    onClose();
  };

  const availableWarehouses = warehouses.filter(w => w.id !== item.warehouseId);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Transfer Item">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300">
            Quantity to Transfer (max: {item.quantity})
          </label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            min="1"
            max={item.quantity}
            className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">
            Target Warehouse
          </label>
          <select
            value={targetWarehouseId}
            onChange={(e) => setTargetWarehouseId(e.target.value)}
            className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white"
            required
          >
            <option value="">Select Warehouse</option>
            {availableWarehouses.map(warehouse => (
              <option key={warehouse.id} value={warehouse.id}>
                {warehouse.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-700 rounded-md text-gray-300 hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Transfer
          </button>
        </div>
      </form>
    </Modal>
  );
}