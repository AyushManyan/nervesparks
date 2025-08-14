import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { getUser, setUser } from '../utils/auth';

export default function Profile() {
  const [user, setLocalUser] = useState(getUser());
  const [prefs, setPrefs] = useState({
    disliked: [],
    health_conditions: [],
    goals: {}
  });

  // Raw input states for diet & allergies
  const [dietInput, setDietInput] = useState("");
  const [allergiesInput, setAllergiesInput] = useState("");

  useEffect(() => {
    api.me()
      .then(res => {
        const data = res.data;
        setLocalUser(data);
        setPrefs({
          disliked: data.disliked || [],
          health_conditions: data.health_conditions || [],
          goals: data.goals || {}
        });
        setDietInput((data.diet || []).join(', '));
        setAllergiesInput((data.allergies || []).join(', '));
      })
      .catch(console.error);
  }, []);

  async function save() {
    try {
      const processedPrefs = {
        ...prefs,
        diet: dietInput.split(',').map(s => s.trim()).filter(Boolean),
        allergies: allergiesInput.split(',').map(s => s.trim()).filter(Boolean)
      };
      const res = await api.updatePreferences(processedPrefs);
      alert('Saved');
      setUser(res.data);
    } catch (e) {
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
          <input
            type="text"
            value={dietInput}
            onChange={e => setDietInput(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mt-3">
          <label className="block text-sm font-semibold">Nutritional Goals</label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div>
              <label className="block text-xs">Calories (kcal/day)</label>
              <input
                type="number"
                min="0"
                value={prefs.goals.calories || ''}
                onChange={e => setPrefs(p => ({
                  ...p,
                  goals: { ...p.goals, calories: Number(e.target.value) }
                }))}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-xs">Protein (g/day)</label>
              <input
                type="number"
                min="0"
                value={prefs.goals.protein || ''}
                onChange={e => setPrefs(p => ({
                  ...p,
                  goals: { ...p.goals, protein: Number(e.target.value) }
                }))}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-xs">Carbs (g/day)</label>
              <input
                type="number"
                min="0"
                value={prefs.goals.carbs || ''}
                onChange={e => setPrefs(p => ({
                  ...p,
                  goals: { ...p.goals, carbs: Number(e.target.value) }
                }))}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-xs">Fat (g/day)</label>
              <input
                type="number"
                min="0"
                value={prefs.goals.fat || ''}
                onChange={e => setPrefs(p => ({
                  ...p,
                  goals: { ...p.goals, fat: Number(e.target.value) }
                }))}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </div>

        <div className="mt-3">
          <label className="block text-sm">Allergies (comma separated)</label>
          <input
            type="text"
            value={allergiesInput}
            onChange={e => setAllergiesInput(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mt-3 flex gap-2">
          <button onClick={save} className="btn-primary">Save</button>
        </div>
      </div>
    </div>
  );
}
