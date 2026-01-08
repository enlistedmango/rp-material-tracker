import { Material, Recipe } from '../types';

const MATERIALS_KEY = 'rp-materials';
const RECIPES_KEY = 'rp-recipes';

export function saveMaterials(materials: Material[]): void {
    localStorage.setItem(MATERIALS_KEY, JSON.stringify(materials));
}

export function getMaterials(): Material[] {
    const stored = localStorage.getItem(MATERIALS_KEY);
    return stored ? JSON.parse(stored) : [];
}

export function saveRecipes(recipes: Recipe[]): void {
    localStorage.setItem(RECIPES_KEY, JSON.stringify(recipes));
}

export function getRecipes(): Recipe[] {
    const stored = localStorage.getItem(RECIPES_KEY);
    return stored ? JSON.parse(stored) : [];
}