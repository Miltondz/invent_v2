import React, { useState } from 'react';
import { useInventory } from '../../context/InventoryContext';
import Modal from '../common/Modal';
import { InventoryItem } from '../../types';

interface SalesFormProps {
  isOpen: boolean;
  onClose: () => void;
  item: InventoryItem;
}

export default function SalesForm({ isOpen, onClose, item }: SalesFormProps) {
  const { recordSale } = useInventory();
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(item.price);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    recordSale({
      itemId: item.id,
      quantity,
      price,
      date: new Date().toISOString()
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Record Sale">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300">
            Quantity (max: {item.quantity})
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
            Price per unit ($)
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            min="0"
            step="0.01"
            className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white"
            required
          />
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
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Record Sale
          </button>
        </div>
      </form>
    </Modal>
  );
}