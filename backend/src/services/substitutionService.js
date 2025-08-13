const MAP = {
  milk: ['almond milk','soy milk','oat milk','coconut milk'],
  egg: ['flax egg','chia egg','silken tofu'],
  butter: ['olive oil','coconut oil','vegan butter'],
  peanut: ['almond','cashew','sunflower seed'],
  wheat: ['rice flour','almond flour','oat flour','buckwheat'],
  yogurt: ['coconut yogurt','soy yogurt']
};

export function getSubstitutes(ingredient) {
  const key = (ingredient||'').toLowerCase().trim();
  return MAP[key] || [];
}
