import React, { useState } from 'react';
import api from '../services/api';

export default function Recommend(){
  const [preferences, setPreferences] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    console.log("user" ,user.id);
    
    try {
      const res = await api.recommend({ userId: user?.id, preferences });
      console.log("recommendation response", res.data);
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert('Recommendation failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-[70vh] bg-white px-2 sm:px-4 md:px-8">
      <div className="w-full max-w-xl bg-green-50 rounded-xl shadow-lg p-4 sm:p-8 border border-green-200">
        <h2 className="text-xl sm:text-2xl font-bold text-green-700 mb-6 text-center">Get Smart Recommendations</h2>
        <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3 mb-6 w-full">
          <input
            value={preferences}
            onChange={e => setPreferences(e.target.value)}
            placeholder="Type your food preferences (e.g., low-calorie)"
            className="flex-1 p-3 border-2 border-green-300 rounded-lg focus:outline-none focus:border-green-500 bg-white w-full"
          />
          <button className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg transition w-full sm:w-auto">Search</button>
        </form>

        <div className="mt-4">
          {loading && <div className="text-green-700 font-medium">Loading recommendations...</div>}
          {result && (
            <div className="bg-white rounded-lg p-4 border border-green-100 mt-2">
              <h3 className="font-semibold text-green-700 mb-2">Meals Ideas</h3>
              {result.answer && (
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Summary</h4>
                  <div className="bg-gray-100 p-3 rounded whitespace-pre-line" dangerouslySetInnerHTML={{ __html: result.answer.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*/g, '') }} />
                </div>
              )}
              {result.retrieved && Array.isArray(result.retrieved) && result.retrieved.length > 0 && (
                <div className="space-y-4">
                  {result.retrieved.map((recipe) => (
                    <div key={recipe._id} className="border p-4 rounded bg-green-50">
                      <h4 className="font-bold text-lg sm:text-xl mb-2">{recipe.name}</h4>
                      <p className="text-sm sm:text-base"><span className="font-semibold">Ingredients:</span> {Array.isArray(recipe.ingredients) ? recipe.ingredients.join(', ') : ''}</p>
                      <p className="text-sm sm:text-base"><span className="font-semibold">Instructions:</span> {recipe.instructions}</p>
                      {recipe.nutritional_info && (
                        <p className="text-sm sm:text-base"><span className="font-semibold">Nutrition:</span> Calories: {recipe.nutritional_info.calories} kcal, Protein: {recipe.nutritional_info.protein}g{recipe.nutritional_info.carbs !== undefined ? `, Carbs: ${recipe.nutritional_info.carbs}g` : ''}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {!result.answer && (!result.retrieved || result.retrieved.length === 0) && (
                <div className="text-gray-500">No recommendations found.</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
