import React, { useState } from 'react';
import { Recipe, Material } from '../types';

interface RecipeListProps {
  recipes: Recipe[];
  materials: Material[];
  onDeleteRecipe: (id: string) => void;
  onEditRecipe: (recipe: Recipe) => void;
  onCraftRecipe: (recipe: Recipe) => void;
  onAddNewRecipe: () => void;
}

const RecipeList: React.FC<RecipeListProps> = ({
  recipes,
  materials,
  onDeleteRecipe,
  onEditRecipe,
  onCraftRecipe,
  onAddNewRecipe
}) => {
  const [filter, setFilter] = useState<'all' | 'craftable'>('all');
  const [sortBy, setSortBy] = useState<'default' | 'mostCraftable' | 'leastCraftable' | 'alphabetical'>('mostCraftable');
  const [searchQuery, setSearchQuery] = useState('');

  const canCraft = (recipe: Recipe): boolean => {
    return recipe.requiredMaterials.every((required) => {
      const material = materials.find(
        (m) => m.name.toLowerCase() === required.materialName.toLowerCase()
      );
      return material && material.quantity >= required.quantity;
    });
  };

  const getMaxCraftableCount = (recipe: Recipe): number => {
    let minCraftable = Infinity;

    for (const required of recipe.requiredMaterials) {
      const material = materials.find(
        (m) => m.name.toLowerCase() === required.materialName.toLowerCase()
      );

      if (!material || material.quantity < required.quantity) {
        return 0;
      }

      const possibleCrafts = Math.floor(material.quantity / required.quantity);
      minCraftable = Math.min(minCraftable, possibleCrafts);
    }

    return minCraftable === Infinity ? 0 : minCraftable;
  };

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (filter === 'craftable') {
      return canCraft(recipe) && matchesSearch;
    }
    return matchesSearch;
  });

  const sortedRecipes = [...filteredRecipes].sort((a, b) => {
    if (sortBy === 'mostCraftable') {
      return getMaxCraftableCount(b) - getMaxCraftableCount(a);
    } else if (sortBy === 'leastCraftable') {
      return getMaxCraftableCount(a) - getMaxCraftableCount(b);
    } else if (sortBy === 'alphabetical') {
      return a.name.localeCompare(b.name);
    }
    return 0;
  });

  return (
    <div className="recipes-section">
      <div className="recipes-header">
        <h2>Recipes</h2>
        <div className="recipes-controls">
          <button onClick={onAddNewRecipe} className="btn-add-new-recipe">
            + Add Recipe
          </button>
          <div className="filter-buttons">
            <button
              onClick={() => setFilter('all')}
              className={filter === 'all' ? 'active' : ''}
            >
              All
            </button>
            <button
              onClick={() => setFilter('craftable')}
              className={filter === 'craftable' ? 'active' : ''}
            >
              Craftable
            </button>
          </div>
          <div className="sort-dropdown">
            <label>Sort by:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}>
              <option value="default">Default</option>
              <option value="mostCraftable">Most Craftable</option>
              <option value="leastCraftable">Least Craftable</option>
              <option value="alphabetical">A-Z</option>
            </select>
          </div>
        </div>
      </div>

      <div className="search-filter-bar">
        <input
          type="text"
          placeholder="🔍 Search recipes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="btn-clear-search"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      <p className="section-description">
        Recipes show craftable items with required materials. Green cards indicate you have enough materials to craft.
        The badge shows how many you can craft. Click "Craft" to consume materials and create the item.
        {searchQuery && ` Showing ${sortedRecipes.length} of ${recipes.length} recipes.`}
      </p>

      <div className="recipes-grid-compact">
        {sortedRecipes.map((recipe) => {
          const craftable = canCraft(recipe);
          const maxCraftable = getMaxCraftableCount(recipe);
          return (
            <div
              key={recipe.id}
              className={`recipe-card-compact ${craftable ? 'craftable' : ''}`}
            >
              <div className="card-header-compact">
                <h4>{recipe.name}</h4>
                <span className={`craft-num ${maxCraftable === 0 ? 'zero' : ''}`}>
                  {maxCraftable}x
                </span>
              </div>
              <div className="card-materials">
                {recipe.requiredMaterials.map((req, idx) => {
                  const userMaterial = materials.find(
                    (m) => m.name.toLowerCase() === req.materialName.toLowerCase()
                  );
                  const hasEnough =
                    userMaterial && userMaterial.quantity >= req.quantity;
                  return (
                    <div key={idx} className={`mat-line ${hasEnough ? 'ok' : 'low'}`}>
                      {req.materialName} <span className="mat-count">{userMaterial?.quantity || 0}/{req.quantity}</span>
                    </div>
                  );
                })}
              </div>
              <div className="card-actions">
                {craftable && (
                  <button onClick={() => onCraftRecipe(recipe)} className="btn-compact btn-craft">
                    Craft
                  </button>
                )}
                <button onClick={() => onEditRecipe(recipe)} className="btn-compact" title="Edit">✎</button>
                <button onClick={() => onDeleteRecipe(recipe.id)} className="btn-compact btn-del" title="Delete">✕</button>
              </div>
            </div>
          );
        })}
      </div>

      {sortedRecipes.length === 0 && (
        <p className="empty-message">
          {searchQuery
            ? `No recipes found matching "${searchQuery}"`
            : filter === 'craftable'
            ? 'No craftable recipes with your current materials.'
            : 'No recipes available.'}
        </p>
      )}
    </div>
  );
};

export default RecipeList;