import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUser, removeToken } from '../utils/auth';

export default function Nav(){
  const user = getUser();
  const nav = useNavigate();

  function logout() {
    removeToken();
    nav('/login');
  }

  return (
    <header className="bg-brand-50 border-b border-gray-100">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link to="/" className="header-brand flex items-center gap-2">
          <span className="w-8 h-8 rounded-md bg-brand-500 flex items-center justify-center text-white">R</span>
          RecipeRAG
        </Link>

        <nav className="flex items-center gap-3">
          {user ? (
            <>
              <Link to="/dashboard" className="text-sm text-gray-700 hover:text-brand-700">Recipes</Link>
              <Link to="/intake" className="text-sm text-gray-700 hover:text-brand-700">Intake</Link>
              <Link to="/recommend" className="text-sm text-gray-700 hover:text-brand-700">Recommend</Link>
              <Link to="/health-check" className="text-sm text-gray-700 hover:text-brand-700">Health Check</Link>
              <Link to="/daily-progress" className="text-sm text-gray-700 hover:text-brand-700">Progress</Link>
              <Link to="/profile" className="text-sm text-gray-700 hover:text-brand-700">{user.name}</Link>
              <button onClick={logout} className="btn-ghost">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-primary">Login</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
