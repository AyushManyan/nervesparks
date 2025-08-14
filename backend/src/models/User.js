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
  password: { type: String, required: true }, // hashed
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

  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const dailyGoals = {
    calories: this.goals.calories / daysInMonth,
    protein: this.goals.protein / daysInMonth,
    carbs: this.goals.carbs / daysInMonth,
    fat: this.goals.fat / daysInMonth,
  };

  const progress = {
    calories: (totals.calories / dailyGoals.calories) * 100,
    protein: (totals.protein / dailyGoals.protein) * 100,
    carbs: (totals.carbs / dailyGoals.carbs) * 100,
    fat: (totals.fat / dailyGoals.fat) * 100,
  };

  return progress;
};

export default mongoose.model('User', UserSchema);
