import React, { useState } from 'react';
import api from '../services/api';
import { setToken, setUser } from '../utils/auth';
import { useNavigate, Link } from 'react-router-dom';

export default function Login(){
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [err,setErr]=useState('');
  const nav = useNavigate();

  async function submit(e){
    e.preventDefault();
    try{
      const res = await api.login({ email, password });
      const { token, user } = res.data;
      setToken(token);
      setUser(user);
      nav('/dashboard');
    } catch(err){
      console.error(err);
      setErr(err?.response?.data?.error || 'Login failed');
    }
  }

  return (
    <div className="max-w-md mx-auto mt-8">
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Login</h2>
        {err && <div className="text-red-600 mb-2">{err}</div>}
        <form onSubmit={submit} className="space-y-3">
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full p-2 border rounded" />
          <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" className="w-full p-2 border rounded" />
          <button className="btn-primary w-full">Login</button>
        </form>
        <div className="mt-3 text-sm">No account? <Link to="/register" className="text-brand-600">Register</Link></div>
      </div>
    </div>
  );
}
