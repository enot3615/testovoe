import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import TasksListPage from './pages/TasksListPage';
import ProtectedRoute from './components/ProtectRoute';

export const Router = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registration" element={<RegistrationPage />} />
    
      <Route path="/"
        element={
          <ProtectedRoute>
            <TasksListPage />
          </ProtectedRoute>
        }
      />
      <Route path="/tasks"
        element={
          <ProtectedRoute>
            <TasksListPage />
          </ProtectedRoute>
        }
      />
      
      <Route path="*" element={<div className="min-h-screen flex items-center justify-center"><p className="text-center text-6xl font-bold">404</p></div>} /> 
    </Routes>
  );
};