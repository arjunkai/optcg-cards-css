const API = 'https://optcg-api.arjunbansal-ai.workers.dev/images';

export const SAMPLE_CARDS = [
  {
    section: 'Super Rare',
    effect: 'holo',
    cards: [
      { id: 'OP01-120', name: 'Shanks', image: `${API}/OP01-120` },
      { id: 'OP05-119', name: 'Monkey.D.Luffy', image: `${API}/OP05-119` },
      { id: 'OP03-122', name: 'Charlotte Katakuri', image: `${API}/OP03-122` },
    ],
  },
  {
    section: 'Leader',
    effect: 'holo',
    cards: [
      { id: 'EB01-001', name: 'Kouzuki Oden', image: `${API}/EB01-001` },
      { id: 'OP01-001', name: 'Roronoa Zoro', image: `${API}/OP01-001` },
    ],
  },
  {
    section: 'Secret Rare',
    effect: 'gold-textured',
    cards: [
      { id: 'OP02-121', name: 'Shanks', image: `${API}/OP02-121` },
      { id: 'OP01-121', name: 'Nami', image: `${API}/OP01-121` },
    ],
  },
  {
    section: 'Alternate Art',
    effect: 'textured-holo',
    cards: [
      { id: 'OP05-074_p1', name: 'Monkey.D.Luffy', image: `${API}/OP05-074_p1` },
      { id: 'OP02-120_p1', name: 'Portgas.D.Ace', image: `${API}/OP02-120_p1` },
    ],
  },
  {
    section: 'Manga Art',
    effect: 'textured-holo',
    cards: [
      { id: 'OP01-120_p2', name: 'Shanks', image: `${API}/OP01-120_p2` },
      { id: 'OP02-120_p2', name: 'Portgas.D.Ace', image: `${API}/OP02-120_p2` },
    ],
  },
  {
    section: 'Rare',
    effect: 'border-foil',
    cards: [
      { id: 'OP03-079', name: 'Vergo', image: `${API}/OP03-079` },
      { id: 'OP01-025', name: 'Nami', image: `${API}/OP01-025` },
    ],
  },
];

export function finishToEffect(finish) {
  const map = {
    holo: 'holo',
    textured: 'textured-holo',
    'textured-gold': 'gold-textured',
    foil: 'border-foil',
    gold: 'gold-foil',
    standard: 'none',
  };
  return map[finish] || 'none';
}
