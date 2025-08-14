import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function Intake() {
  const [recipes, setRecipes] = useState([]);
  const [recipeId, setRecipeId] = useState('');
  const [serving, setServing] = useState(1);
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    api.listRecipes().then(res => setRecipes(res.data)).catch(console.error);
    fetchProgress();
  }, []);

  async function log() {
    try {
      if (!recipeId) {
        alert('Please select a recipe.');
        return;
      }
      await api.logIntake({ recipeId, serving });
      alert('Intake successfully');
      fetchProgress();
    } catch (e) {
      console.error(e);
      alert(e?.response?.data?.error || 'Log failed');
    }
  }

  async function fetchProgress(date) {
    const d = date || new Date().toISOString().slice(0, 10);
    const res = await api.progress(d);
    setProgress(res.data);
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <h2 className="text-xl font-semibold">Intake</h2>
        <div className="mt-3">
          <select
            value={recipeId}
            onChange={e => setRecipeId(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Select recipe</option>
            {recipes.map(r => (
              <option key={r._id} value={r._id}>{r.name}</option>
            ))}
          </select>
        </div>
        <div className="mt-3 flex gap-2">
          <input
            value={serving}
            onChange={e => setServing(Number(e.target.value))}
            type="number"
            className="p-2 border rounded w-24"
          />
          <button onClick={log} className="btn-primary">Add Take</button>
        </div>

        <div className="mt-4">
          <h3 className="font-semibold">Today progress</h3>
            {progress ? (
              <table className="w-full bg-gray-50 rounded p-2 mt-2">
                <thead>
                  <tr>
                    <th className="text-left p-2">Nutrient</th>
                    <th className="text-left p-2">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(progress).map(([key, value]) => (
                    <tr key={key} className="border-t">
                      <td className="p-2 font-medium">{key}</td>
                      <td className="p-2">
                        {typeof value === 'object' && value !== null ? (
                          <table className="w-full bg-white rounded">
                            <tbody>
                              {Object.entries(value).map(([subKey, subValue]) => (
                                <tr key={subKey}>
                                  <td className="p-1 text-gray-600">{subKey}</td>
                                  <td className="p-1">{subValue}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          String(value)
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-gray-400">No progress data available.</div>
            )}
        </div>
      </div>
    </div>
  );
}
