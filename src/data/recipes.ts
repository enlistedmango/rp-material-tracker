import { Recipe } from '../types';

const recipes: Recipe[] = [
  {
    id: '1',
    name: 'Scrap Metal',
    category: 'Crafting Components',
    requiredMaterials: [
      { materialName: 'Rusty Nails', quantity: 1 },
      { materialName: 'Springs', quantity: 1 },
    ],
  },

  {
    id: '2',
    name: 'Armor Plate',
    category: 'Armor',
    requiredMaterials: [
      { materialName: 'Piece of Kevlar', quantity: 1 },
      { materialName: 'Glue', quantity: 1 },
    ],
  },

  {
    id: '3',
    name: 'Pistol Slide',
    category: 'Weapon Components',
    requiredMaterials: [
      { materialName: 'Zinc Bar', quantity: 2 },
      { materialName: 'Rubber', quantity: 5 },
      { materialName: 'Scrap Metal', quantity: 2 },
    ],
  },
  {
    id: '4',
    name: 'Pistol Upper',
    category: 'Weapon Components',
    requiredMaterials: [
      { materialName: 'Pistol Slide', quantity: 1 },
      { materialName: 'Pistol Barrel', quantity: 1 },
    ],
  },
  {
    id: '5',
    name: 'Pistol Lower',
    category: 'Weapon Components',
    requiredMaterials: [
      { materialName: 'Pistol Grip', quantity: 1 },
      { materialName: 'Zinc Bar', quantity: 2 },
    ],
  },

  {
    id: '6',
    name: 'Pistol',
    category: 'Weapons',
    requiredMaterials: [
      { materialName: 'Pistol Upper', quantity: 1 },
      { materialName: 'Pistol Lower', quantity: 1 },
      { materialName: 'Blueprint for Pistol', quantity: 1 },
    ],
  },
];

export default recipes;