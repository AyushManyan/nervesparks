import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function RecipeDetail(){
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [subs, setSubs] = useState({});

  useEffect(()=>{
    api.getRecipe(id).then(res => setRecipe(res.data)).catch(console.error);
  }, [id]);

  async function handleSubstitute(ingredient) {
    setSubs(s => ({...s, [ingredient]: 'Loading...'}));
    try {
      const res = await api.substituteIngredient(ingredient);
      setSubs(s => ({...s, [ingredient]: res.data.substitutes.length ? res.data.substitutes.join(', ') : 'No substitutes found'}));
    } catch {
      setSubs(s => ({...s, [ingredient]: 'Error'}));
    }
  }

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
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{recipe.name}</h1>
          <div className="text-base text-gray-500 mb-4 flex flex-wrap gap-2">
            <span className="bg-gray-100 px-2 py-1 rounded">{recipe.cuisine}</span>
            {recipe.tags?.map(tag => (
              <span key={tag} className="bg-blue-100 text-blue-700 px-2 py-1 rounded">{tag}</span>
            ))}
          </div>
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Ingredients</h2>
            <ul className="list-disc ml-6 space-y-2">
              {recipe.ingredients.map(ing => (
                <li key={ing} className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <span className="font-medium text-gray-700">{ing}</span>
                  <div className="flex gap-2 items-center">
                    <button
                      className="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-800 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                      onClick={()=>handleSubstitute(ing)}
                    >
                      Substitute?
                    </button>
                    {subs[ing] && (
                      <span className="text-xs px-2 py-1 rounded bg-gray-200 text-gray-600 ml-1">
                        {subs[ing]}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Instructions</h2>
            <p className="mt-1 whitespace-pre-line text-gray-700 leading-relaxed bg-gray-50 rounded p-3">{recipe.instructions}</p>
          </div>
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Nutrition</h2>
            <div className="flex gap-4 text-gray-700">
              <span>P: <span className="font-bold">{recipe.nutritional_info?.protein ?? '?'}</span> g</span>
              <span>Calories: <span className="font-bold">{recipe.nutritional_info?.calories ?? '?'}</span> kcal</span>
            </div>
          </div>
          <div className="flex gap-3 mt-8 justify-end">
            <button
              className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              onClick={()=>nav(`/recipes/edit/${id}`)}
            >
              Edit
            </button>
            <button
              className="px-4 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
}
