import Recipe from '../models/Recipe.js';
import { embedText, recipeToEmbedText } from '../services/embeddingService.js';
import { getSubstitutes } from '../services/substitutionService.js';
// Ingredient substitution API
export function substituteIngredient(req, res, next) {
  try {
    const ingredient = req.params.ingredient;
    if (!ingredient) return res.status(400).json({ error: 'ingredient required' });
    const substitutes = getSubstitutes(ingredient);
    res.json({ ingredient, substitutes });
  } catch (e) { next(e); }
}

export async function createRecipe(req, res, next) {
  try {
    const body = req.body || {};
    if (!body.name) return res.status(400).json({ error: 'name is required' });
    const doc = new Recipe({
      name: body.name,
      ingredients: body.ingredients || [],
      instructions: body.instructions || '',
      nutritional_info: body.nutritional_info || {},
      cuisine: body.cuisine || '',
      tags: body.tags || []
    });
    doc.embedding = await embedText(recipeToEmbedText(doc));
    await doc.save();
    res.status(201).json(doc);
  } catch (e) { next(e); }
}

export async function getRecipe(req, res, next) {
  try {
    const r = await Recipe.findById(req.params.id);
    if (!r) return res.status(404).json({ error: 'not found' });
    res.json(r);
  } catch (e) { next(e); }
}

export async function listRecipes(req, res, next) {
  try {
    const items = await Recipe.find().sort({ createdAt: -1 }).limit(200);
    res.json(items);
  } catch (e) { next(e); }
}

export async function updateRecipe(req, res, next) {
  try {
    const update = req.body || {};
    const r = await Recipe.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!r) return res.status(404).json({ error: 'not found' });
    if (update.name || update.ingredients || update.cuisine || update.tags || update.nutritional_info) {
      r.embedding = await embedText(recipeToEmbedText(r));
      await r.save();
    }
    res.json(r);
  } catch (e) { next(e); }
}

export async function deleteRecipe(req, res, next) {
  try {
    const r = await Recipe.findByIdAndDelete(req.params.id);
    if (!r) return res.status(404).json({ error: 'not found' });
    res.json({ ok: true });
  } catch (e) { next(e); }
}
