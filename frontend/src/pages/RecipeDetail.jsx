import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function RecipeDetail(){
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);

  useEffect(()=>{
    api.getRecipe(id).then(res => setRecipe(res.data)).catch(console.error);
  }, [id]);

  const nav = useNavigate();
  async function handleDelete() {
    if (!window.confirm('Delete this recipe?')) return;
    try {
      await api.deleteRecipe(id);
      nav('/dashboard');
    } catch {
      alert('Delete failed');
    }
  }

  if (!recipe) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <h1 className="text-2xl font-bold">{recipe.name}</h1>
        <div className="text-sm text-gray-600">{recipe.cuisine} • {recipe.tags?.join(', ')}</div>
        <div className="mt-3"><strong>Ingredients:</strong> {recipe.ingredients.join(', ')}</div>
        <div className="mt-3"><strong>Instructions:</strong><p className="mt-1 whitespace-pre-line">{recipe.instructions}</p></div>
        <div className="mt-3">
          <strong>Nutrition:</strong>
          <div>P: {recipe.nutritional_info?.protein ?? '?'} g • Calories: {recipe.nutritional_info?.calories ?? '?'} kcal</div>
        </div>
        <div className="flex gap-2 mt-4">
          <button className="btn-ghost" onClick={()=>nav(`/recipes/edit/${id}`)}>Edit</button>
          <button className="btn-danger" onClick={handleDelete}>Delete</button>
        </div>
      </div>
    </div>
  );
}
