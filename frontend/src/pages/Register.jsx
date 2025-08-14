import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Register(){
  const [name,setName]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [err,setErr]=useState('');
  const nav = useNavigate();

  async function submit(e){
    e.preventDefault();
    try {
      const res = await api.register({ name, email, password });
      const { token, user } = res.data;
      // Save token and user for immediate authenticated use
      if (token && user) {
        const { setToken, setUser } = await import('../utils/auth');
        setToken(token);
        setUser(user);
        nav('/dashboard');
      } else {
        nav('/login');
      }
    } catch(error) {
      setErr(error?.response?.data?.error || 'Registration failed');
    }
  }

  return (
    <div className="max-w-md mx-auto mt-8">
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Register</h2>
        {err && <div className="text-red-600 mb-2">{err}</div>}
        <form onSubmit={submit} className="space-y-3">
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Full name" className="w-full p-2 border rounded" />
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full p-2 border rounded" />
          <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" className="w-full p-2 border rounded" />
          <button className="btn-primary w-full">Create account</button>
        </form>
      </div>
    </div>
  );
}
