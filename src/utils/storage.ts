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

export interface ExportData {
    materials: Material[];
    recipes: Recipe[];
    exportDate: string;
    version: string;
}

export function exportData(): ExportData {
    return {
        materials: getMaterials(),
        recipes: getRecipes(),
        exportDate: new Date().toISOString(),
        version: '1.0.0'
    };
}

export function downloadBackup(): void {
    const data = exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `material-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

export function importData(data: ExportData): { success: boolean; error?: string } {
    try {
        if (!data.materials || !data.recipes || !Array.isArray(data.materials) || !Array.isArray(data.recipes)) {
            return { success: false, error: 'Invalid backup file format' };
        }

        for (const material of data.materials) {
            if (!material.id || !material.name || typeof material.quantity !== 'number') {
                return { success: false, error: 'Invalid material data in backup' };
            }
        }

        for (const recipe of data.recipes) {
            if (!recipe.id || !recipe.name || !Array.isArray(recipe.requiredMaterials)) {
                return { success: false, error: 'Invalid recipe data in backup' };
            }
        }

        saveMaterials(data.materials);
        saveRecipes(data.recipes);

        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to import backup file' };
    }
}