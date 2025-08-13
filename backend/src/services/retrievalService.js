import Recipe from '../models/Recipe.js';
import { embedText } from './embeddingService.js';
import { cosineSim } from '../utils/math.js';

export async function retrieveRecipesByQuery(query, k = 5) {
  const qEmb = await embedText(query);
  const all = await Recipe.find({}, { name:1, ingredients:1, nutritional_info:1, cuisine:1, tags:1, embedding:1, instructions:1 });
  const scored = all.map(r => ({ r, score: (r.embedding?.length) ? cosineSim(qEmb, r.embedding) : -1 }));
  scored.sort((a,b) => b.score - a.score);
  return scored.slice(0, k).map(s => ({ ...s.r.toObject(), _score: s.score }));
}

export function filterByUserConstraints(recipes, user) {
  const deny = new Set([...(user.allergies||[]), ...(user.disliked||[])].map(s => s.toLowerCase()));
  return recipes.filter(r => {
    const ing = (r.ingredients||[]).map(x => (x||'').toLowerCase());
    if (ing.some(x => [...deny].some(d => x.includes(d)))) return false;

    const diet = new Set((user.diet||[]).map(s => s.toLowerCase()));
    if (diet.has('vegetarian')) {
      const nonVeg = ['chicken','mutton','beef','pork','fish','egg','shrimp','prawn','lamb','bacon','ham','turkey'];
      if ((r.ingredients||[]).some(x => nonVeg.some(n => (x||'').toLowerCase().includes(n)))) return false;
    }
    if (diet.has('vegan')) {
      const animal = ['milk','cheese','paneer','ghee','butter','yogurt','curd','egg','honey'];
      if ((r.ingredients||[]).some(x => animal.some(n => (x||'').toLowerCase().includes(n)))) return false;
    }
    if (diet.has('gluten-free')) {
      const gluten = ['wheat','barley','rye','maida','atta','semolina','suji','seitan'];
      if ((r.ingredients||[]).some(x => gluten.some(n => (x||'').toLowerCase().includes(n)))) return false;
    }
    return true;
  });
}

export function reRankByGoals(list, user, queryText) {
  const goals = user.goals || {};
  if (!goals || (!goals.calories && !goals.protein)) return list;
  return list
    .map(r => {
      const n = r.nutritional_info || {};
      const proteinScore = goals.protein ? 1 - Math.min(1, Math.abs((n.protein||0) - goals.protein)/Math.max(1, goals.protein)) : 0;
      const calorieScore = goals.calories ? 1 - Math.min(1, Math.abs((n.calories||0) - goals.calories)/Math.max(1, goals.calories)) : 0;
      const textBonus = /high protein|muscle|protein/i.test(queryText) ? ((n.protein||0)/Math.max(1, goals.protein||50)) : 0;
      const base = r._score ?? 0;
      return { r, s: base + 0.3*proteinScore + 0.2*calorieScore + 0.2*textBonus };
    })
    .sort((a,b) => b.s - a.s)
    .map(x => x.r);
}
