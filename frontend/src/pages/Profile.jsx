import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { getUser, setUser } from '../utils/auth';

export default function Profile() {
  const [user, setLocalUser] = useState(getUser());
  const [prefs, setPrefs] = useState({
    goals: {}
  });

  const [dietInput, setDietInput] = useState("");
  const [allergiesInput, setAllergiesInput] = useState("");
  const [healthConditionsInput, setHealthConditionsInput] = useState("");
  const [dislikedInput, setDislikedInput] = useState("");

  useEffect(() => {
    api.me()
      .then(res => {
        const data = res.data;
        setLocalUser(data);
        setPrefs({
          goals: data.goals || {}
        });
        setDietInput((data.diet || []).join(', '));
        setAllergiesInput((data.allergies || []).join(', '));
        setHealthConditionsInput((data.health_conditions || []).join(', '));
        setDislikedInput((data.disliked || []).join(', '));
      })
      .catch(console.error);
  }, []);

  async function save() {
    try {
      const processedPrefs = {
        ...prefs,
        diet: dietInput.split(',').map(s => s.trim()).filter(Boolean),
        allergies: allergiesInput.split(',').map(s => s.trim()).filter(Boolean),
        health_conditions: healthConditionsInput.split(',').map(s => s.trim()).filter(Boolean),
        disliked: dislikedInput.split(',').map(s => s.trim()).filter(Boolean)
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
    <div className="max-w-2xl mx-auto w-full px-2 sm:px-4 md:px-8">
      <div className="card">
        <h2 className="text-xl font-semibold mb-2">Profile</h2>
        <div><strong>Name:</strong> {user?.name}</div>
        <div><strong>Email:</strong> {user?.email}</div>

        {/* Diet */}
        <div className="mt-3">
          <label className="block text-sm">Diet (comma separated)</label>
          <input
            type="text"
            value={dietInput}
            onChange={e => setDietInput(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Health Conditions */}
        <div className="mt-3">
          <label className="block text-sm">Health Conditions (comma separated)</label>
          <input
            type="text"
            value={healthConditionsInput}
            onChange={e => setHealthConditionsInput(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Disliked Foods */}
        <div className="mt-3">
          <label className="block text-sm">Disliked Foods (comma separated)</label>
          <input
            type="text"
            value={dislikedInput}
            onChange={e => setDislikedInput(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Nutritional Goals */}
        <div className="mt-3">
          <label className="block text-sm font-semibold">Nutritional Goals</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
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

        {/* Allergies */}
        <div className="mt-3">
          <label className="block text-sm">Allergies (comma separated)</label>
          <input
            type="text"
            value={allergiesInput}
            onChange={e => setAllergiesInput(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mt-3 flex flex-col sm:flex-row gap-2 w-full">
          <button onClick={save} className="btn-primary w-full sm:w-auto">Save</button>
        </div>
      </div>
    </div>
  );
}
