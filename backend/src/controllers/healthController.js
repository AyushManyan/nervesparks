
const RULES = {
  diabetes: {
    avoid: ['sugar', 'jaggery', 'honey', 'syrup', 'sweetened'],
    tip: 'Prefer high-fiber, low added sugar recipes; aim for balanced carbs.'
  },
  hypertension: {
    avoid: ['salt', 'soy sauce', 'pickle', 'processed meat', 'stock cube'],
    tip: 'Lower sodium; prefer fresh herbs and spices.'
  },
  ckd: {
    avoid: ['high potassium foods', 'banana', 'potato', 'tomato'],
    tip: 'Monitor potassium/phosphorus depending on stage; consult clinician.'
  }
};

export async function healthCheck(req, res, next) {
  try {
    const { health_conditions = [], ingredients = [] } = req.body || {};
    const ings = ingredients.map(i => (i||'').toLowerCase());

    const findings = [];
    for (const cond of health_conditions) {
      const rule = RULES[cond?.toLowerCase()];
      if (!rule) continue;
      const hits = ings.filter(x => rule.avoid.some(a => x.includes(a)));
      findings.push({ condition: cond, avoid_hits: hits, tip: rule.tip });
    }
    res.json({ findings });
  } catch (e) { next(e); }
}
