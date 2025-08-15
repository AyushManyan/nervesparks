import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function RecipeCard({ recipe, onDelete }) {
  const nav = useNavigate();
  return (
    <div className="card">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="w-full">
          <h3 className="text-lg font-semibold">{recipe.name}</h3>
          <div className="text-sm text-gray-600 mt-1">{recipe.cuisine} • {recipe.tags?.join(', ')}</div>
          <div className="text-sm text-gray-700 mt-2">{recipe.nutritional_info?.calories ?? '?'} kcal • P {recipe.nutritional_info?.protein ?? '?'}g</div>
        </div>
        <div className="flex flex-row sm:flex-col items-center sm:items-end gap-1 w-full sm:w-auto">
          <Link to={`/recipes/${recipe._id}`} className="text-brand-600 hover:underline w-full sm:w-auto text-center">View</Link>
          <button className="btn-ghost text-xs w-full sm:w-auto" onClick={()=>nav(`/recipes/edit/${recipe._id}`)}>Edit</button>
          <button className="btn-danger text-xs w-full sm:w-auto" onClick={()=>onDelete && onDelete(recipe._id)}>Delete</button>
        </div>
      </div>
    </div>
  );
}
