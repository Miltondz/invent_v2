import React, { useState, useEffect } from 'react';
import { useInventory } from '../../context/InventoryContext';
import { Warehouse } from '../../types';
import Modal from '../common/Modal';

interface WarehouseFormProps {
  isOpen: boolean;
  onClose: () => void;
  warehouseToEdit?: Warehouse;
}

export default function WarehouseForm({ isOpen, onClose, warehouseToEdit }: WarehouseFormProps) {
  const { addWarehouse, updateWarehouse } = useInventory();
  const [formData, setFormData] = useState({
    name: '',
    location: '',
  });

  useEffect(() => {
    if (warehouseToEdit) {
      setFormData({
        name: warehouseToEdit.name,
        location: warehouseToEdit.location,
      });
    }
  }, [warehouseToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (warehouseToEdit) {
      updateWarehouse(warehouseToEdit.id, formData);
    } else {
      addWarehouse(formData);
    }
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={warehouseToEdit ? 'Edit Warehouse' : 'Add New Warehouse'}
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
          <label className="block text-sm font-medium text-gray-300">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
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
            className="px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700"
          >
            {warehouseToEdit ? 'Update' : 'Add'} Warehouse
          </button>
        </div>
      </form>
    </Modal>
  );
}