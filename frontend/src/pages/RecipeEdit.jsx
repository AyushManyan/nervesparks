import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function RecipeEdit() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: '',
    ingredients: '',
    instructions: '',
    cuisine: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    tags: ''
  });
  const nav = useNavigate();

  useEffect(() => {
    api.getRecipe(id).then(res => {
      const r = res.data;
      setForm({
        name: r.name || '',
        ingredients: r.ingredients?.join(', ') || '',
        instructions: r.instructions || '',
        cuisine: r.cuisine || '',
        calories: r.nutritional_info?.calories || '',
        protein: r.nutritional_info?.protein || '',
        carbs: r.nutritional_info?.carbs || '',
        fat: r.nutritional_info?.fat || '',
        tags: r.tags?.join(', ') || ''
      });
    }).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const payload = {
        name: form.name,
        ingredients: form.ingredients.split(',').map(s => s.trim()).filter(Boolean),
        instructions: form.instructions,
        cuisine: form.cuisine,
        nutritional_info: {
          calories: Number(form.calories) || 0,
          protein: Number(form.protein) || 0,
          carbs: Number(form.carbs) || 0,
          fat: Number(form.fat) || 0
        },
        tags: form.tags.split(',').map(s => s.trim()).filter(Boolean)
      };
      await api.updateRecipe(id, payload);
      nav(`/recipes/${id}`);
    } catch {
      alert('Update failed');
    }
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto w-full px-2 sm:px-4 md:px-8">
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Edit Recipe</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input className="w-full p-2 border rounded" name="name" value={form.name} onChange={handleChange} placeholder="Recipe name" />
          <input className="w-full p-2 border rounded" name="ingredients" value={form.ingredients} onChange={handleChange} placeholder="Ingredients (comma separated)" />
          <input className="w-full p-2 border rounded" name="tags" value={form.tags} onChange={handleChange} placeholder="Tags (comma separated)" />
          <input className="w-full p-2 border rounded" name="cuisine" value={form.cuisine} onChange={handleChange} placeholder="Cuisine" />
          <textarea className="w-full p-2 border rounded" name="instructions" value={form.instructions} onChange={handleChange} placeholder="Instructions" rows={5} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input className="p-2 border rounded" name="calories" value={form.calories} onChange={handleChange} placeholder="Calories" />
            <input className="p-2 border rounded" name="protein" value={form.protein} onChange={handleChange} placeholder="Protein (g)" />
            <input className="p-2 border rounded" name="carbs" value={form.carbs} onChange={handleChange} placeholder="Carbs (g)" />
            <input className="p-2 border rounded" name="fat" value={form.fat} onChange={handleChange} placeholder="Fat (g)" />
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <button className="btn-primary w-full sm:w-auto">Update</button>
            <button type="button" className="btn-ghost w-full sm:w-auto" onClick={() => nav(-1)}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
