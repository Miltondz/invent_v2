import React, { useState } from 'react';
import { useInventory } from '../../context/InventoryContext';
import Modal from '../common/Modal';
import { InventoryItem } from '../../types';

interface WastageFormProps {
  isOpen: boolean;
  onClose: () => void;
  item: InventoryItem;
}

export default function WastageForm({ isOpen, onClose, item }: WastageFormProps) {
  const { recordWastage } = useInventory();
  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    recordWastage({
      itemId: item.id,
      quantity,
      reason,
      date: new Date().toISOString()
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Record Wastage">
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
            Reason
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white"
            rows={3}
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
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Record Wastage
          </button>
        </div>
      </form>
    </Modal>
  );
}