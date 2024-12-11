export interface User {
  id: string;
  username: string;
  role: 'admin' | 'user';
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  expiryDate: string;
  warehouseId: string;
  threshold: number;
  createdAt: string;
  updatedAt: string;
}

export interface Warehouse {
  id: string;
  name: string;
  location: string;
}

export interface WastageRecord {
  id: string;
  itemId: string;
  quantity: number;
  reason: string;
  date: string;
}

export interface SaleRecord {
  id: string;
  itemId: string;
  quantity: number;
  price: number;
  date: string;
}