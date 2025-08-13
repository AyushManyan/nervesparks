import mongoose from 'mongoose';

const NutritionalInfoSchema = new mongoose.Schema({
  calories: Number,
  protein: Number,
  carbs: Number,
  fat: Number,
}, { _id: false });

const RecipeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ingredients: [{ type: String }],
  instructions: { type: String },
  nutritional_info: { type: NutritionalInfoSchema, required: true },
  cuisine: String,
  tags: [String],
  embedding: { type: [Number], default: [] },
}, { timestamps: true });

export default mongoose.model('Recipe', RecipeSchema);
