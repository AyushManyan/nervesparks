import React, { useEffect, useState } from 'react';
import api from '../services/api';
import RecipeCard from '../components/RecipeCard';
import { Link } from 'react-router-dom';

export default function Dashboard(){
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=> {
    api.listRecipes().then(res => {
      setRecipes(res.data);
    }).catch(console.error).finally(()=>setLoading(false));
  }, []);

  async function handleDelete(id) {
    if (!window.confirm('Delete this recipe?')) return;
    try {
      await api.deleteRecipe(id);
      setRecipes(recipes => recipes.filter(r => r._id !== id));
    } catch {
      alert('Delete failed');
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Recipes</h1>
        <div className="flex gap-2">
          <Link to="/recipes/create" className="btn-primary">Add Recipe</Link>
          <Link to="/recommend" className="btn-ghost">Get Recommendations</Link>
        </div>
      </div>

      {loading ? <div>Loading...</div> : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map(r => <RecipeCard key={r._id} recipe={r} onDelete={handleDelete} />)}
        </div>
      )}
    </div>
  );
}
