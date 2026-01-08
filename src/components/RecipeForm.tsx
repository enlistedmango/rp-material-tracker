import React, { useState, useEffect } from 'react';
import { Recipe, Material } from '../types';

interface RecipeFormProps {
    onAddRecipe: (recipe: Recipe) => void;
    onUpdateRecipe: (recipe: Recipe) => void;
    materials: Material[];
    editingRecipe: Recipe | null;
    onCancelEdit: () => void;
}

const RecipeForm: React.FC<RecipeFormProps> = ({
    onAddRecipe,
    onUpdateRecipe,
    materials,
    editingRecipe,
    onCancelEdit
}) => {
    const [recipeName, setRecipeName] = useState('');
    const [requiredMaterials, setRequiredMaterials] = useState<
        { materialName: string; quantity: number }[]
    >([]);
    const [selectedMaterial, setSelectedMaterial] = useState('');
    const [selectedQuantity, setSelectedQuantity] = useState(1);
    const [showForm, setShowForm] = useState(false);
    const [inputMode, setInputMode] = useState<'select' | 'text'>('select');
    const [manualMaterialName, setManualMaterialName] = useState('');

    useEffect(() => {
        if (editingRecipe) {
            if (editingRecipe.id) {
                setRecipeName(editingRecipe.name);
                setRequiredMaterials(editingRecipe.requiredMaterials);
            } else {
                setRecipeName('');
                setRequiredMaterials([]);
            }
            setShowForm(true);
        }
    }, [editingRecipe]);

    const handleAddMaterial = () => {
        const materialName = inputMode === 'select' ? selectedMaterial : manualMaterialName.trim();
        if (!materialName) return;

        const existing = requiredMaterials.find(
            (m) => m.materialName === materialName
        );

        if (existing) {
            setRequiredMaterials(
                requiredMaterials.map((m) =>
                    m.materialName === materialName
                        ? { ...m, quantity: m.quantity + selectedQuantity }
                        : m
                )
            );
        } else {
            setRequiredMaterials([
                ...requiredMaterials,
                { materialName: materialName, quantity: selectedQuantity },
            ]);
        }

        setSelectedMaterial('');
        setManualMaterialName('');
        setSelectedQuantity(1);
    };

    const handleRemoveMaterial = (materialName: string) => {
        setRequiredMaterials(
            requiredMaterials.filter((m) => m.materialName !== materialName)
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (recipeName.trim() === '' || requiredMaterials.length === 0) return;

        const recipe: Recipe = {
            id: editingRecipe ? editingRecipe.id : Date.now().toString(),
            name: recipeName,
            requiredMaterials,
        };

        if (editingRecipe) {
            onUpdateRecipe(recipe);
        } else {
            onAddRecipe(recipe);
        }

        handleClose();
    };

    const handleClose = () => {
        setRecipeName('');
        setRequiredMaterials([]);
        setSelectedMaterial('');
        setSelectedQuantity(1);
        setShowForm(false);
        if (editingRecipe) {
            onCancelEdit();
        }
    };

    const allMaterialNames = materials.map((m) => m.name).sort();

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    return (
        <>
            {showForm && (
                <>
                    <div className="modal-overlay" onClick={handleOverlayClick} />
                    <div className="modal-content">
                        <form onSubmit={handleSubmit} className="recipe-form">
                            <div className="form-header">
                                <h3>{editingRecipe ? 'Edit Recipe' : 'Create New Recipe'}</h3>
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="btn-close"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="form-group">
                                <label>Recipe Name *</label>
                                <input
                                    type="text"
                                    value={recipeName}
                                    onChange={(e) => setRecipeName(e.target.value)}
                                    placeholder="e.g., Pistol Upper"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Required Materials *</label>
                                <div className="input-mode-toggle">
                                    <button
                                        type="button"
                                        className={inputMode === 'select' ? 'active' : ''}
                                        onClick={() => setInputMode('select')}
                                    >
                                        Select Existing
                                    </button>
                                    <button
                                        type="button"
                                        className={inputMode === 'text' ? 'active' : ''}
                                        onClick={() => setInputMode('text')}
                                    >
                                        Add New Material
                                    </button>
                                </div>
                                <div className="material-selector">
                                    {inputMode === 'select' ? (
                                        <select
                                            value={selectedMaterial}
                                            onChange={(e) => setSelectedMaterial(e.target.value)}
                                            className="material-select"
                                        >
                                            <option value="">Select a material...</option>
                                            {allMaterialNames.map((name) => (
                                                <option key={name} value={name}>
                                                    {name}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <input
                                            type="text"
                                            value={manualMaterialName}
                                            onChange={(e) => setManualMaterialName(e.target.value)}
                                            placeholder="Enter material name..."
                                            className="material-input"
                                        />
                                    )}
                                    <input
                                        type="number"
                                        value={selectedQuantity}
                                        onChange={(e) => setSelectedQuantity(Number(e.target.value))}
                                        min="1"
                                        className="quantity-input"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddMaterial}
                                        className="btn-add-material"
                                        disabled={!selectedMaterial}
                                    >
                                        Add
                                    </button>
                                </div>

                                {requiredMaterials.length > 0 && (
                                    <div className="required-materials-list">
                                        {requiredMaterials.map((mat) => (
                                            <div key={mat.materialName} className="material-tag">
                                                <span>
                                                    {mat.materialName} × {mat.quantity}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveMaterial(mat.materialName)}
                                                    className="btn-remove-tag"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="form-actions">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="btn-cancel"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn-submit"
                                    disabled={!recipeName || requiredMaterials.length === 0}
                                >
                                    {editingRecipe ? 'Update Recipe' : 'Create Recipe'}
                                </button>
                            </div>
                        </form>
                    </div>
                </>
            )}
        </>
    );
};

export default RecipeForm;
