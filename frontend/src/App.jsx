import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Nav from './components/Nav';
import RecipeEdit from './pages/RecipeEdit';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateRecipe from './pages/CreateRecipe';
import RecipeDetail from './pages/RecipeDetail';
import Recommend from './pages/Recommend';
import DailyProgress from './pages/DailyProgress';
import Profile from './pages/Profile';
import Intake from './pages/Intake';
import HealthCheck from './pages/HealthCheck';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <div className="min-h-screen">
      <Nav />
      <main className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard/>} />
            <Route path="/recipes/create" element={<CreateRecipe/>} />
            <Route path="/recipes/:id" element={<RecipeDetail/>} />
            <Route path="/recipes/edit/:id" element={<RecipeEdit />} />
            <Route path="/recommend" element={<Recommend/>} />
            <Route path="/profile" element={<Profile/>} />
            <Route path="/intake" element={<Intake/>} />
            <Route path="/daily-progress" element={<DailyProgress />} />
          </Route>

          <Route path="/health-check" element={<HealthCheck/>} />
        </Routes>
      </main>
    </div>
  );
}
