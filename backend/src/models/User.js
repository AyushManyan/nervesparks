import mongoose from 'mongoose';

const GoalsSchema = new mongoose.Schema({
  calories: Number,
  protein: Number,
  carbs: Number,
  fat: Number,
}, { _id: false });

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, sparse: true, required: true },
  password: { type: String, required: true },
  diet: [String],                 // e.g., ["vegetarian", "vegan", "gluten-free"]
  allergies: [String],
  disliked: [String],
  health_conditions: [String],    // e.g., ["diabetes","hypertension","ckd"]
  goals: GoalsSchema,
}, { timestamps: true });

UserSchema.methods.calculateMonthlyProgress = function (intakes) {
  const totals = intakes.reduce((acc, intake) => {
    acc.calories += intake.calories;
    acc.protein += intake.protein;
    acc.carbs += intake.carbs;
    acc.fat += intake.fat;
    return acc;
  }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

  const progress = {
    calories: (totals.calories / this.goals.calories) * 100,
    protein: (totals.protein / this.goals.protein) * 100,
    carbs: (totals.carbs / this.goals.carbs) * 100,
    fat: (totals.fat / this.goals.fat) * 100,
  };

  return progress;
};

UserSchema.methods.calculateDailyProgress = function (intakes) {
  const totals = intakes.reduce((acc, intake) => {
    acc.calories += intake.calories;
    acc.protein += intake.protein;
    acc.carbs += intake.carbs;
    acc.fat += intake.fat;
    return acc;
  }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

  // Use user's current goals directly for daily progress
  const dailyGoals = {
    calories: this.goals?.calories || 0,
    protein: this.goals?.protein || 0,
    carbs: this.goals?.carbs || 0,
    fat: this.goals?.fat || 0,
  };

  const progress = {
    calories: dailyGoals.calories > 0 ? (totals.calories / dailyGoals.calories) * 100 : 0,
    protein: dailyGoals.protein > 0 ? (totals.protein / dailyGoals.protein) * 100 : 0,
    carbs: dailyGoals.carbs > 0 ? (totals.carbs / dailyGoals.carbs) * 100 : 0,
    fat: dailyGoals.fat > 0 ? (totals.fat / dailyGoals.fat) * 100 : 0,
  };

  return progress;
};

export default mongoose.model('User', UserSchema);
