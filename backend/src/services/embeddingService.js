import { pipeline, env } from '@xenova/transformers';

env.cacheDir = './cache';


const defaultModel = 'sentence-transformers/all-MiniLM-L6-v2';

let embedderPromise;

export function getEmbedder() {
  if (!embedderPromise) {
    const modelId = process.env.EMBED_MODEL || defaultModel;
    // Explicitly configure the pipeline to avoid quantized models
    embedderPromise = pipeline('feature-extraction', modelId, { quantized: false });
  }
  return embedderPromise;
}

export async function embedText(text) {
  const extractor = await getEmbedder();
  const out = await extractor(text, { pooling: 'mean', normalize: true });
  // Convert tensor to plain array
  return Array.from(out.data); // if `out` is a single tensor
  // OR: return out.tolist()[0]; // if it returns a list of lists
}

export function recipeToEmbedText(r) {
  return `Name: ${r.name}
Ingredients: ${(r.ingredients || []).join(', ')}
Cuisine: ${r.cuisine || ''}
Tags: ${(r.tags || []).join(', ')}
Nutrition: calories ${r?.nutritional_info?.calories || ''}, protein ${r?.nutritional_info?.protein || ''}, carbs ${r?.nutritional_info?.carbs || ''}, fat ${r?.nutritional_info?.fat || ''}`;
}
