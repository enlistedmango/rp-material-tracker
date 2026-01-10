export interface Material {
    id: string;
    name: string;
    quantity: number;
    rarity?: 'common' | 'uncommon' | 'rare';
    value?: number;
    buyer?: string;
}

export interface Recipe {
    id: string;
    name: string;
    category?: string;
    rarity?: 'common' | 'uncommon' | 'rare';
    requiredMaterials: {
        materialName: string;
        quantity: number;
    }[];
}