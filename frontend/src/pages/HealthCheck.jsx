import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function HealthCheck(){
  const [conditions, setConditions] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [result, setResult] = useState(null);

  // Fetch user health conditions from profile on mount
  useEffect(() => {
    api.me()
      .then(res => {
        const userHealth = (res.data.health_conditions || []).join(', ');
        setConditions(userHealth);
      })
      .catch(console.error);
  }, []);

  async function submit(e) {
    e.preventDefault();
    const payload = {
      health_conditions: conditions.split(',').map(s=>s.trim()).filter(Boolean),
      ingredients: ingredients.split(',').map(s=>s.trim()).filter(Boolean)
    };
    try {
      const res = await api.healthCheck(payload);
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert('Check failed');
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <h2 className="text-xl font-semibold">Health Check</h2>
        <form className="space-y-2" onSubmit={submit}>
          <input
            className="w-full p-2 border rounded"
            value={conditions}
            onChange={e=>setConditions(e.target.value)}
            placeholder="Conditions (comma)"
          />
          <input
            className="w-full p-2 border rounded"
            value={ingredients}
            onChange={e=>setIngredients(e.target.value)}
            placeholder="Ingredients (comma)"
          />
          <div className="flex gap-2"><button className="btn-primary">Check</button></div>
        </form>

        {result && result.findings && result.findings.length > 0 ? (
          <div className="mt-3">
            {result.findings.map((finding, idx) => (
              <div key={idx} className="mb-4 p-4 border rounded bg-gray-50">
                <h3 className="font-bold capitalize mb-1">{finding.condition}</h3>
                <p><strong>Avoid:</strong> {finding.avoid_hits.join(', ')}</p>
                <p><strong>Tip:</strong> {finding.tip}</p>
              </div>
            ))}
          </div>
        ) : result ? (
          <pre className="bg-gray-50 p-2 rounded mt-3">{JSON.stringify(result, null, 2)}</pre>
        ) : null}
      </div>
    </div>
  );
}
