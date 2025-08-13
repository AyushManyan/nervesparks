import mongoose from 'mongoose';

const IntakeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, default: () => new Date().toISOString().slice(0,10) },
  recipeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: true },
  serving: { type: Number, default: 1 },
  calories: Number,
  protein: Number,
  carbs: Number,
  fat: Number,
}, { timestamps: true });

export default mongoose.model('Intake', IntakeSchema);
