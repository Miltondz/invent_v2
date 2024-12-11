import React, { useState, useEffect } from 'react';
import { useInventory } from '../../context/InventoryContext';
import { InventoryItem } from '../../types';
import Modal from '../common/Modal';

interface InventoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  itemToEdit?: InventoryItem;
}

export default function InventoryForm({ isOpen, onClose, itemToEdit }: InventoryFormProps) {
  const { addItem, updateItem, warehouses } = useInventory();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: 0,
    price: 0,
    expiryDate: '',
    warehouseId: '',
    threshold: 0,
  });

  useEffect(() => {
    if (itemToEdit) {
      setFormData({
        name: itemToEdit.name,
        category: itemToEdit.category,
        quantity: itemToEdit.quantity,
        price: itemToEdit.price,
        expiryDate: itemToEdit.expiryDate,
        warehouseId: itemToEdit.warehouseId,
        threshold: itemToEdit.threshold,
      });
    }
  }, [itemToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (itemToEdit) {
      updateItem(itemToEdit.id, formData);
    } else {
      addItem(formData);
    }
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'price' || name === 'threshold' 
        ? parseFloat(value) 
        : value
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={itemToEdit ? 'Edit Item' : 'Add New Item'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">Category</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">Quantity</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white"
            required
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white"
            required
            min="0"
            step="0.01"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">Expiry Date</label>
          <input
            type="date"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">Warehouse</label>
          <select
            name="warehouseId"
            value={formData.warehouseId}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white"
            required
          >
            <option value="">Select Warehouse</option>
            {warehouses.map(warehouse => (
              <option key={warehouse.id} value={warehouse.id}>
                {warehouse.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">Threshold</label>
          <input
            type="number"
            name="threshold"
            value={formData.threshold}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white"
            required
            min="0"
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
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {itemToEdit ? 'Update' : 'Add'} Item
          </button>
        </div>
      </form>
    </Modal>
  );
}