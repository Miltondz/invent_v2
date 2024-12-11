export const users = [
  {
    id: '1',
    username: 'admin',
    password: '123456', // In a real app, this would be hashed
    role: 'admin'
  }
];

export const inventory = [
  {
    id: '1',
    name: 'Hand Sanitizer',
    category: 'Health',
    quantity: 100,
    price: 5.99,
    expiryDate: '2025-12-31',
    warehouseId: '1',
    threshold: 20,
    createdAt: '2024-03-15',
    updatedAt: '2024-03-15'
  }
];

export const warehouses = [
  {
    id: '1',
    name: 'Main Warehouse',
    location: 'New York'
  },
  {
    id: '2',
    name: 'Secondary Storage',
    location: 'Los Angeles'
  }
];

export const wastageRecords = [];
export const salesRecords = [];