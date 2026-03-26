import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';
import MainLayout from './layout/MainLayout';
import { Login } from './pages/Login';
import { 
  Dashboard, 
  Employees, 
  Attendance, 
  Leave, 
  Salary, 
  AiInsights, 
  Reports,
  Finance,
  Workforce,
  Shifts,
  Compliance
} from './pages';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) => {
  const { user } = useAppContext();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />; // Or some "unauthorized" page
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        
        {/* Role-based route for Employees */}
        <Route 
          path="employees" 
          element={
            <ProtectedRoute allowedRoles={['Admin', 'HR']}>
              <Employees />
            </ProtectedRoute>
          } 
        />
        
        <Route path="attendance" element={<Attendance />} />
        <Route path="leave" element={<Leave />} />
        <Route path="salary" element={<Salary />} />
        <Route path="ai-insights" element={<AiInsights />} />
        <Route path="reports" element={<Reports />} />
        
        {/* Smart Modules */}
        <Route path="finance" element={<Finance />} />
        <Route path="workforce" element={<Workforce />} />
        <Route path="shifts" element={<Shifts />} />
        <Route path="compliance" element={<Compliance />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
