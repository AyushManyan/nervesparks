import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUser, removeToken } from '../utils/auth';

export default function Nav(){
  const user = getUser();
  const nav = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

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

        <button
          className="md:hidden flex items-center px-2 py-1 border rounded text-brand-700 border-brand-500 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <nav className="hidden md:flex items-center gap-3">
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

      <nav
        className={`md:hidden bg-brand-50 border-t border-gray-100 px-4 pt-2 pb-4 ${menuOpen ? 'block' : 'hidden'}`}
      >
        {user ? (
          <div className="flex flex-col gap-2">
            <Link to="/dashboard" className="text-sm text-gray-700 hover:text-brand-700" onClick={() => setMenuOpen(false)}>Recipes</Link>
            <Link to="/intake" className="text-sm text-gray-700 hover:text-brand-700" onClick={() => setMenuOpen(false)}>Intake</Link>
            <Link to="/recommend" className="text-sm text-gray-700 hover:text-brand-700" onClick={() => setMenuOpen(false)}>Recommend</Link>
            <Link to="/health-check" className="text-sm text-gray-700 hover:text-brand-700" onClick={() => setMenuOpen(false)}>Health Check</Link>
            <Link to="/daily-progress" className="text-sm text-gray-700 hover:text-brand-700" onClick={() => setMenuOpen(false)}>Progress</Link>
            <Link to="/profile" className="text-sm text-gray-700 hover:text-brand-700" onClick={() => setMenuOpen(false)}>{user.name}</Link>
            <button onClick={() => { logout(); setMenuOpen(false); }} className="btn-ghost text-left">Logout</button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <Link to="/login" className="btn-primary" onClick={() => setMenuOpen(false)}>Login</Link>
          </div>
        )}
      </nav>
    </header>
  );
}
