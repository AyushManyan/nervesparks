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

    // Fetch the user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Get the current month
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

    // Fetch intakes for the current month
    const intakes = await Intake.find({
      userId,
      date: { $gte: startOfMonth.toISOString(), $lte: endOfMonth.toISOString() },
    });

    // Calculate progress
    const progress = user.calculateMonthlyProgress(intakes);

    // Return progress
    res.json(progress);
  } catch (e) {
    next(e);
  }
}
