import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import Menubar from './components/layout/Menubar';
import InventoryList from './components/inventory/InventoryList';
import ReportsPage from './components/reports/ReportsPage';
import { InventoryProvider } from './context/InventoryContext';

function AppContent() {
  const { user } = useAuth();

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Menubar />
      <InventoryProvider>
        <div className="pt-4">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/inventory" element={<InventoryList />} />
            <Route path="/reports" element={<ReportsPage />} />
          </Routes>
        </div>
      </InventoryProvider>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;