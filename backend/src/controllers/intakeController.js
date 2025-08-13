import Intake from '../models/Intake.js';
import Recipe from '../models/Recipe.js';
import User from '../models/User.js';

export async function logIntake(req, res, next) {
  try {
    const { userId, recipeId, serving = 1, date } = req.body || {};
    if (!userId || !recipeId) return res.status(400).json({ error: 'userId and recipeId required' });

    const r = await Recipe.findById(recipeId);
    if (!r) return res.status(404).json({ error: 'recipe not found' });
    const n = r.nutritional_info || {};

    const entry = new Intake({
      userId, recipeId, serving,
      date: date || new Date().toISOString().slice(0,10),
      calories: (n.calories||0) * serving,
      protein: (n.protein||0) * serving,
      carbs: (n.carbs||0) * serving,
      fat: (n.fat||0) * serving,
    });
    await entry.save();
    res.status(201).json(entry);
  } catch (e) { next(e); }
}

export async function dailyProgress(req, res, next) {
  try {
    const { userId, date = new Date().toISOString().slice(0,10) } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId is required' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'user not found' });

    const items = await Intake.find({ userId, date });
    const totals = items.reduce((acc, x) => ({
      calories: acc.calories + (x.calories||0),
      protein: acc.protein + (x.protein||0),
      carbs: acc.carbs + (x.carbs||0),
      fat: acc.fat + (x.fat||0),
    }), { calories:0, protein:0, carbs:0, fat:0 });

    res.json({ date, totals, goals: user.goals || null });
  } catch (e) { next(e); }
}
