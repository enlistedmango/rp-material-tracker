import React, { useState, useEffect } from 'react';
import MaterialList from './components/MaterialList';
import RecipeList from './components/RecipeList';
import MaterialForm from './components/MaterialForm';
import RecipeForm from './components/RecipeForm';
import CraftingCalculator from './components/CraftingCalculator';
import ImportExport from './components/ImportExport';
import { Material, Recipe } from './types';
import { getMaterials, saveMaterials, getRecipes, saveRecipes } from './utils/storage';
import recipesData from './data/recipes';
import './styles/main.css';

const App: React.FC = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);

  useEffect(() => {
    const storedMaterials = getMaterials();
    setMaterials(storedMaterials);

    const storedRecipes = getRecipes();
    if (storedRecipes.length === 0) {
      setRecipes(recipesData);
      saveRecipes(recipesData);
    } else {
      setRecipes(storedRecipes);
    }
  }, []);

  const addMaterial = (material: Material) => {
    const existingMaterial = materials.find(
      (m) => m.name.toLowerCase() === material.name.toLowerCase()
    );

    let updatedMaterials: Material[];
    if (existingMaterial) {
      updatedMaterials = materials.map((m) =>
        m.id === existingMaterial.id
          ? { ...m, quantity: m.quantity + material.quantity }
          : m
      );
    } else {
      updatedMaterials = [...materials, material];
    }

    setMaterials(updatedMaterials);
    saveMaterials(updatedMaterials);
  };

  const updateMaterial = (id: string, quantity: number) => {
    if (quantity < 0) return;

    const updatedMaterials = materials.map((m) =>
      m.id === id ? { ...m, quantity } : m
    );

    setMaterials(updatedMaterials);
    saveMaterials(updatedMaterials);
  };

  const deleteMaterial = (id: string) => {
    const updatedMaterials = materials.filter((m) => m.id !== id);
    setMaterials(updatedMaterials);
    saveMaterials(updatedMaterials);
  };

  const editMaterial = (material: Material) => {
    const updatedMaterials = materials.map((m) =>
      m.id === material.id ? material : m
    );
    setMaterials(updatedMaterials);
    saveMaterials(updatedMaterials);
    setEditingMaterial(null);
  };

  const addRecipe = (recipe: Recipe) => {
    let updatedMaterials = [...materials];
    let materialsChanged = false;

    recipe.requiredMaterials.forEach((reqMat) => {
      const exists = updatedMaterials.some((m) => m.name === reqMat.materialName);
      if (!exists) {
        updatedMaterials.push({
          id: Date.now().toString() + Math.random(),
          name: reqMat.materialName,
          quantity: 0,
        });
        materialsChanged = true;
      }
    });

    if (materialsChanged) {
      setMaterials(updatedMaterials);
      saveMaterials(updatedMaterials);
    }

    const updatedRecipes = [...recipes, recipe];
    setRecipes(updatedRecipes);
    saveRecipes(updatedRecipes);
  };

  const deleteRecipe = (id: string) => {
    const updatedRecipes = recipes.filter((r) => r.id !== id);
    setRecipes(updatedRecipes);
    saveRecipes(updatedRecipes);
  };

  const updateRecipe = (recipe: Recipe) => {
    let updatedMaterials = [...materials];
    let materialsChanged = false;

    recipe.requiredMaterials.forEach((reqMat) => {
      const exists = updatedMaterials.some((m) => m.name === reqMat.materialName);
      if (!exists) {
        updatedMaterials.push({
          id: Date.now().toString() + Math.random(),
          name: reqMat.materialName,
          quantity: 0,
        });
        materialsChanged = true;
      }
    });

    if (materialsChanged) {
      setMaterials(updatedMaterials);
      saveMaterials(updatedMaterials);
    }

    const updatedRecipes = recipes.map((r) => (r.id === recipe.id ? recipe : r));
    setRecipes(updatedRecipes);
    saveRecipes(updatedRecipes);
    setEditingRecipe(null);
  };

  const craftRecipe = (recipe: Recipe) => {
    let updatedMaterials = materials.map((material) => {
      const required = recipe.requiredMaterials.find(
        (req) => req.materialName.toLowerCase() === material.name.toLowerCase()
      );
      if (required) {
        return { ...material, quantity: material.quantity - required.quantity };
      }
      return material;
    });

    const existingCraftedMaterial = updatedMaterials.find(
      (m) => m.name.toLowerCase() === recipe.name.toLowerCase()
    );

    if (existingCraftedMaterial) {
      updatedMaterials = updatedMaterials.map((m) =>
        m.id === existingCraftedMaterial.id
          ? { ...m, quantity: m.quantity + 1 }
          : m
      );
    } else {
      const newMaterial: Material = {
        id: Date.now().toString(),
        name: recipe.name,
        quantity: 1,
      };
      updatedMaterials = [...updatedMaterials, newMaterial];
    }

    setMaterials(updatedMaterials);
    saveMaterials(updatedMaterials);
  };

  const handleImportComplete = () => {
    const storedMaterials = getMaterials();
    setMaterials(storedMaterials);

    const storedRecipes = getRecipes();
    setRecipes(storedRecipes);
  };

  return (
    <div className="app">
      <header>
        <h1>🎮 Roleplay Material Tracker</h1>
        <p>Track your materials and craftable recipes</p>
        <p className="built-by">Built by EnlistedMango with ❤️</p>
      </header>

      <main>
        <ImportExport onImportComplete={handleImportComplete} />

        <section className="add-material-section">
          <h2>{editingMaterial ? 'Edit Material' : 'Add Material'}</h2>
          <p className="section-description">
            {editingMaterial
              ? 'Update the name, quantity, or rarity of this material. Materials with quantities below 10 will show a red background warning.'
              : 'Add materials found during your adventures. Set rarity (Common/Uncommon/Rare) to display colored borders: gray for common, green for uncommon, and blue for rare.'}
          </p>
          <MaterialForm
            onAddMaterial={addMaterial}
            onUpdateMaterial={editMaterial}
            editingMaterial={editingMaterial}
            onCancelEdit={() => setEditingMaterial(null)}
          />
        </section>

        <MaterialList
          materials={materials}
          onUpdateMaterial={updateMaterial}
          onDeleteMaterial={deleteMaterial}
          onEditMaterial={setEditingMaterial}
        />

        <RecipeForm
          onAddRecipe={addRecipe}
          onUpdateRecipe={updateRecipe}
          materials={materials}
          editingRecipe={editingRecipe}
          onCancelEdit={() => setEditingRecipe(null)}
        />

        <RecipeList
          materials={materials}
          recipes={recipes}
          onDeleteRecipe={deleteRecipe}
          onEditRecipe={setEditingRecipe}
          onCraftRecipe={craftRecipe}
          onAddNewRecipe={() => setEditingRecipe({ id: '', name: '', requiredMaterials: [] })}
        />

        <CraftingCalculator recipes={recipes} materials={materials} />
      </main>
    </div>
  );
};

export default App;