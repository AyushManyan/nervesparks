import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function CreateRecipe(){
  const [name, setName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [tags, setTags] = useState('');

  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    try {
      const payload = {
        name,
        ingredients: ingredients.split(',').map(s => s.trim()).filter(Boolean),
        instructions,
        cuisine,
        nutritional_info: {
          calories: Number(calories) || 0,
          protein: Number(protein) || 0,
          carbs: Number(carbs) || 0,
          fat: Number(fat) || 0
        },
        tags: tags.split(',').map(s => s.trim()).filter(Boolean)
      };
      const res = await api.createRecipe(payload);
      nav('/dashboard');
    } catch(e) {
      console.error(e);
      alert('Create failed');
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Create Recipe</h2>
        <form onSubmit={submit} className="space-y-3">
          <input className="w-full p-2 border rounded" value={name} onChange={e=>setName(e.target.value)} placeholder="Recipe name" />
          <input className="w-full p-2 border rounded" value={ingredients} onChange={e=>setIngredients(e.target.value)} placeholder="Ingredients (comma separated)" />
          <input className="w-full p-2 border rounded" value={tags} onChange={e=>setTags(e.target.value)} placeholder="Tags (comma separated)" />
          <input className="w-full p-2 border rounded" value={cuisine} onChange={e=>setCuisine(e.target.value)} placeholder="Cuisine" />
          <textarea className="w-full p-2 border rounded" value={instructions} onChange={e=>setInstructions(e.target.value)} placeholder="Instructions" rows={5} />
          <div className="grid grid-cols-2 gap-2">
            <input className="p-2 border rounded" value={calories} onChange={e=>setCalories(e.target.value)} placeholder="Calories" />
            <input className="p-2 border rounded" value={protein} onChange={e=>setProtein(e.target.value)} placeholder="Protein (g)" />
            <input className="p-2 border rounded" value={carbs} onChange={e=>setCarbs(e.target.value)} placeholder="Carbs (g)" />
            <input className="p-2 border rounded" value={fat} onChange={e=>setFat(e.target.value)} placeholder="Fat (g)" />
          </div>
          <div className="flex gap-2">
            <button className="btn-primary">Create</button>
            <button type="button" className="btn-ghost" onClick={()=>window.history.back()}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
