import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { getUser, setUser } from '../utils/auth';

export default function Profile(){
  const [user,setLocalUser] = useState(getUser());
  const [prefs,setPrefs] = useState({ diet: [], allergies: [], disliked: [], health_conditions: [], goals: {} });

  useEffect(()=> {
    api.me().then(res => {
      setLocalUser(res.data);
      setPrefs({ diet: res.data.diet||[], allergies: res.data.allergies||[], disliked: res.data.disliked||[], health_conditions: res.data.health_conditions||[], goals: res.data.goals||{} });
    }).catch(console.error);
  }, []);

  function handleArrayChange(field, str) {
    setPrefs(p => ({ ...p, [field]: str.split(',').map(s=>s.trim()).filter(Boolean) }));
  }

  async function save() {
    try {
      const res = await api.updatePreferences(prefs);
      alert('Saved');
      setUser(res.data);
    } catch(e) {
      console.error(e);
      alert('Save failed');
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <h2 className="text-xl font-semibold mb-2">Profile</h2>
        <div><strong>Name:</strong> {user?.name}</div>
        <div><strong>Email:</strong> {user?.email}</div>

        <div className="mt-3">
          <label className="block text-sm">Diet (comma separated)</label>
          <input value={(prefs.diet||[]).join(', ')} onChange={e=>handleArrayChange('diet', e.target.value)} className="w-full p-2 border rounded" />
        </div>

        <div className="mt-3">
          <label className="block text-sm">Allergies (comma separated)</label>
          <input value={(prefs.allergies||[]).join(', ')} onChange={e=>handleArrayChange('allergies', e.target.value)} className="w-full p-2 border rounded" />
        </div>

        <div className="mt-3">
          <label className="block text-sm">Goals (Calories, Protein)</label>
          <div className="grid grid-cols-2 gap-2">
            <input value={prefs.goals?.calories || ''} onChange={e=>setPrefs(p=>({...p, goals:{...p.goals, calories: Number(e.target.value)||0}}))} placeholder="calories" className="p-2 border rounded" />
            <input value={prefs.goals?.protein || ''} onChange={e=>setPrefs(p=>({...p, goals:{...p.goals, protein: Number(e.target.value)||0}}))} placeholder="protein" className="p-2 border rounded" />
          </div>
        </div>

        <div className="mt-3 flex gap-2">
          <button onClick={save} className="btn-primary">Save</button>
        </div>
      </div>
    </div>
  );
}
