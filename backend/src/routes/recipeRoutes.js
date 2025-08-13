import { Router } from 'express';
import auth from '../middlewares/auth.js';
import { createRecipe, getRecipe, listRecipes, updateRecipe, deleteRecipe } from '../controllers/recipeController.js';

const router = Router();

// Public reads
router.get('/', listRecipes);
router.get('/:id', getRecipe);

// Protected writes
router.post('/', auth, createRecipe);
router.put('/:id', auth, updateRecipe);
router.delete('/:id', auth, deleteRecipe);

export default router;
