import React from 'react';
import { useInventory } from '../../context/InventoryContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

export default function ReportsPage() {
  const { inventory, warehouses } = useInventory();

  // Current Stock Report Data
  const stockByCategory = inventory.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.quantity;
    return acc;
  }, {} as Record<string, number>);

  const stockData = Object.entries(stockByCategory).map(([category, quantity]) => ({
    category,
    quantity
  }));

  // Low Stock Report Data
  const stockStatus = inventory.reduce(
    (acc, item) => {
      if (item.quantity <= item.threshold / 2) acc.critical++;
      else if (item.quantity <= item.threshold) acc.low++;
      else acc.sufficient++;
      return acc;
    },
    { critical: 0, low: 0, sufficient: 0 }
  );

  const stockStatusData = [
    { name: 'Critical', value: stockStatus.critical },
    { name: 'Low', value: stockStatus.low },
    { name: 'Sufficient', value: stockStatus.sufficient }
  ];

  // Stock Value Report Data
  const totalValue = inventory.reduce((sum, item) => sum + item.quantity * item.price, 0);

  const COLORS = ['#FF8042', '#FFBB28', '#00C49F'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-white mb-8">Reports Dashboard</h1>

      {/* Current Stock Report */}
      <div className="bg-black rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Current Stock Report</h2>
        <div className="h-80">
          <BarChart width={800} height={300} data={stockData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="quantity" fill="#8884d8" />
          </BarChart>
        </div>
      </div>

      {/* Low Stock Report */}
      <div className="bg-black rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Low Stock Report</h2>
        <div className="flex items-center justify-between">
          <div className="h-80">
            <PieChart width={400} height={300}>
              <Pie
                data={stockStatusData}
                cx={200}
                cy={150}
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {stockStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>
          <div className="flex-1 ml-8">
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-lg font-medium text-white mb-4">Low Stock Items</h3>
              <div className="space-y-4">
                {inventory
                  .filter(item => item.quantity <= item.threshold)
                  .map(item => (
                    <div key={item.id} className="flex justify-between items-center">
                      <span className="text-gray-300">{item.name}</span>
                      <span className={`${
                        item.quantity <= item.threshold / 2 ? 'text-red-500' : 'text-yellow-500'
                      }`}>
                        {item.quantity} / {item.threshold}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stock Value Report */}
      <div className="bg-black rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Stock Valuation Report</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-900 rounded-lg p-6 text-center">
            <h3 className="text-lg font-medium text-gray-300 mb-2">Total Stock Value</h3>
            <p className="text-3xl font-bold text-green-500">${totalValue.toFixed(2)}</p>
          </div>
          {warehouses.map(warehouse => {
            const warehouseValue = inventory
              .filter(item => item.warehouseId === warehouse.id)
              .reduce((sum, item) => sum + item.quantity * item.price, 0);
            
            return (
              <div key={warehouse.id} className="bg-gray-900 rounded-lg p-6 text-center">
                <h3 className="text-lg font-medium text-gray-300 mb-2">{warehouse.name}</h3>
                <p className="text-3xl font-bold text-blue-500">${warehouseValue.toFixed(2)}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}