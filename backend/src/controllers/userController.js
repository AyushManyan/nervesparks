import Intake from '../models/Intake.js';
import User from '../models/User.js';

export async function me(req, res, next) {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ error: 'user not found' });
    res.json(user);
  } catch (e) { next(e); }
}

export async function updatePreferences(req, res, next) {
  try {
    const update = {
      ...(req.body.diet ? { diet: req.body.diet } : {}),
      ...(req.body.allergies ? { allergies: req.body.allergies } : {}),
      ...(req.body.disliked ? { disliked: req.body.disliked } : {}),
      ...(req.body.health_conditions ? { health_conditions: req.body.health_conditions } : {}),
      ...(req.body.goals ? { goals: req.body.goals } : {}),
    };
    const u = await User.findByIdAndUpdate(req.user.id, update, { new: true }).select('-password');
    if (!u) return res.status(404).json({ error: 'user not found' });
    res.json(u);
  } catch (e) { next(e); }
}

export async function getMonthlyProgress(req, res, next) {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

    // Fetch intakes for the current month
    const intakes = await Intake.find({
      userId,
      date: { $gte: startOfMonth.toISOString(), $lte: endOfMonth.toISOString() },
    });


    const progress = user.calculateMonthlyProgress(intakes);
    res.json(progress);
  } catch (e) {
    next(e);
  }
}

export async function getDailyProgress(req, res, next) {
  try {
    console.log('Fetching daily progress for user:', req.user.id);
    const { userId } = req.params;
    console.log(userId);

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().slice(0, 10);

    // Fetch intakes for today
    const intakes = await Intake.find({
      userId,
      date: today
    });

 
    const progress = user.calculateDailyProgress(intakes);

    res.json(progress);
  } catch (e) {
    next(e);
  }
}
