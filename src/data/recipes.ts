import { Recipe } from '../types';

const recipes: Recipe[] = [
  {
    id: '1',
    name: 'Scrap Metal',
    category: 'Crafting Components',
    rarity: 'common',
    requiredMaterials: [
      { materialName: 'Rusty Nails', quantity: 2 },
      { materialName: 'Springs', quantity: 1 },
    ],
  },
  {
    id: '2',
    name: 'Armor Plate',
    category: 'Armor',
    rarity: 'uncommon',
    requiredMaterials: [
      { materialName: 'Piece of Kevlar', quantity: 1 },
      { materialName: 'Scrap Metal', quantity: 2 },
    ],
  },
];

export default recipes;