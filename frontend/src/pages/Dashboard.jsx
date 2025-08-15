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
    <div className="px-2 sm:px-4 md:px-8 lg:px-16 xl:px-32 max-w-screen-xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <h1 className="text-2xl font-bold">Recipes</h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Link to="/recipes/create" className="btn-primary w-full sm:w-auto">Add Recipe</Link>
          <Link to="/recommend" className="btn-ghost w-full sm:w-auto">Get Recommendations</Link>
        </div>
      </div>

      {loading ? <div>Loading...</div> : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map(r => <RecipeCard key={r._id} recipe={r} onDelete={handleDelete} />)}
        </div>
      )}
    </div>
  );
}
