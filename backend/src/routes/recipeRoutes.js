import { Router } from 'express';
import auth from '../middlewares/auth.js';
import { createRecipe, getRecipe, listRecipes, updateRecipe, deleteRecipe, substituteIngredient } from '../controllers/recipeController.js';
// Ingredient substitution (public)

const router = Router();

router.get('/substitute/:ingredient', substituteIngredient);
// Public reads
router.get('/', listRecipes);
router.get('/:id', getRecipe);

// Protected writes
router.post('/', auth, createRecipe);
router.put('/:id', auth, updateRecipe);
router.delete('/:id', auth, deleteRecipe);

export default router;
