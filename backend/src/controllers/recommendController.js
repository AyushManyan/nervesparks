import User from '../models/User.js';
import { getGemini } from '../config/gemini.js';
import { retrieveRecipesByQuery, filterByUserConstraints, reRankByGoals } from '../services/retrievalService.js';

function buildDefaultQueryFromUser(user) {
  const diet = (user.diet || []).join(' ');
  const cond = (user.health_conditions || []).join(' ');
  const goal = user.goals?.protein ? 'high protein' : '';
  const q = `${diet} ${cond} ${goal} dinner ideas`.trim();
  return q || 'healthy dinner ideas';
}

function descNutri(r) {
  const n = r.nutritional_info || {};
  return `${n.calories || '?'} kcal, P ${n.protein || '?'}g, C ${n.carbs || '?'}g, F ${n.fat || '?'}g`;
}

export async function recommendations(req, res, next) {
  try {
    const { userId, q = '', k = 5 } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId is required' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'user not found' });

    const queryText = q || buildDefaultQueryFromUser(user);
    let candidates = await retrieveRecipesByQuery(queryText, Number(k) || 5);
    candidates = filterByUserConstraints(candidates, user);
    const ranked = reRankByGoals(candidates, user, queryText);

    const context = ranked.map((r, i) =>
      `#${i + 1} ${r.name}
Ingredients: ${r.ingredients.join(', ')}
Nutrition: ${descNutri(r)}
Cuisine: ${r.cuisine || ''}
Tags: ${(r.tags || []).join(', ')}
Instructions: ${r.instructions?.slice(0, 400)}...`).join('\n\n');

    if (!process.env.GEMINI_API_KEY) {
      return res.json({ info: 'GEMINI_API_KEY not set. Returning retrieved recipes only.', retrieved: ranked });
    }

    const model = getGemini();
    const prompt = `You are a helpful diet assistant. User profile:
Diet: ${(user.diet || []).join(', ')}
Allergies: ${(user.allergies || []).join(', ')}
Disliked: ${(user.disliked || []).join(', ')}
Health conditions: ${(user.health_conditions || []).join(', ')}
Goals: ${JSON.stringify(user.goals || {})}

User query: "${queryText}"
From the following recipes (numbered), suggest 3 options that best match the user's needs. For each, explain briefly why it fits (diet, allergies, macros), and show estimated calories/protein. Only use the provided recipes.

RECIPES:
${context}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    res.json({ query: queryText, retrieved: ranked, answer: text });
  } catch (e) { next(e); }
}
