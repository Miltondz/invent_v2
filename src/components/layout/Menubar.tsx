import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, BarChart3, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Menubar() {
  const { logout, user } = useAuth();

  const menuItems = [
    { path: '/', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard' },
    { path: '/inventory', icon: <Package className="w-5 h-5" />, label: 'Inventory' },
    { path: '/reports', icon: <BarChart3 className="w-5 h-5" />, label: 'Reports' },
  ];

  return (
    <nav className="bg-black border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <LayoutDashboard className="h-8 w-8 text-blue-500" />
              <span className="ml-2 text-xl font-semibold text-white">Inventory Management</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {menuItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `inline-flex items-center px-1 pt-1 text-sm font-medium ${
                      isActive
                        ? 'text-blue-500 border-b-2 border-blue-500'
                        : 'text-gray-300 hover:text-white'
                    }`
                  }
                >
                  {item.icon}
                  <span className="ml-2">{item.label}</span>
                </NavLink>
              ))}
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-gray-300 mr-4">{user?.username}</span>
            <button
              onClick={logout}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-gray-300 hover:text-white"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}