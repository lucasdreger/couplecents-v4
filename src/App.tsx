
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import FixedExpenses from './pages/FixedExpenses';
import Income from './pages/Income';
import Investments from './pages/Investments';
import Reserves from './pages/Reserves';
import Administration from './pages/Administration';
import NotFound from './pages/NotFound';

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="expenses" element={<Expenses />} />
        <Route path="fixed-expenses" element={<FixedExpenses />} />
        <Route path="income" element={<Income />} />
        <Route path="investments" element={<Investments />} />
        <Route path="reserves" element={<Reserves />} />
        <Route path="administration" element={<Administration />} />
      </Route>
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
