import React, { useState } from 'react';
import { Recipe, Material } from '../types';

interface CraftingCalculatorProps {
    recipes: Recipe[];
    materials: Material[];
}

interface OrderItem {
    recipe: Recipe;
    quantity: number;
}

const CraftingCalculator: React.FC<CraftingCalculatorProps> = ({
    recipes,
    materials
}) => {
    const [selectedRecipeId, setSelectedRecipeId] = useState<string>('');
    const [quantity, setQuantity] = useState<number>(1);
    const [order, setOrder] = useState<OrderItem[]>([]);
    const [expandedMaterials, setExpandedMaterials] = useState<Set<string>>(new Set());

    const selectedRecipe = recipes.find(r => r.id === selectedRecipeId);

    const addToOrder = () => {
        if (!selectedRecipe) return;

        const existingItem = order.find(item => item.recipe.id === selectedRecipe.id);

        if (existingItem) {
            setOrder(order.map(item =>
                item.recipe.id === selectedRecipe.id
                    ? { ...item, quantity: item.quantity + quantity }
                    : item
            ));
        } else {
            setOrder([...order, { recipe: selectedRecipe, quantity }]);
        }

        setSelectedRecipeId('');
        setQuantity(1);
    };

    const removeFromOrder = (recipeId: string) => {
        setOrder(order.filter(item => item.recipe.id !== recipeId));
    };

    const updateOrderQuantity = (recipeId: string, newQuantity: number) => {
        if (newQuantity <= 0) {
            removeFromOrder(recipeId);
            return;
        }
        setOrder(order.map(item =>
            item.recipe.id === recipeId
                ? { ...item, quantity: newQuantity }
                : item
        ));
    };

    const clearOrder = () => {
        setOrder([]);
        setExpandedMaterials(new Set());
    };

    const toggleMaterialExpansion = (materialName: string) => {
        const newExpanded = new Set(expandedMaterials);
        if (newExpanded.has(materialName.toLowerCase())) {
            newExpanded.delete(materialName.toLowerCase());
        } else {
            newExpanded.add(materialName.toLowerCase());
        }
        setExpandedMaterials(newExpanded);
    };

    const isMaterialACraftableRecipe = (materialName: string): boolean => {
        return recipes.some(r => r.name.toLowerCase() === materialName.toLowerCase());
    };

    const getRecipeForMaterial = (materialName: string): Recipe | undefined => {
        return recipes.find(r => r.name.toLowerCase() === materialName.toLowerCase());
    };

    const calculateTotalRequirements = () => {
        const totals: { [materialName: string]: number } = {};

        order.forEach(item => {
            item.recipe.requiredMaterials.forEach(req => {
                const materialKey = req.materialName.toLowerCase();
                if (!totals[materialKey]) {
                    totals[materialKey] = 0;
                }
                totals[materialKey] += req.quantity * item.quantity;
            });
        });

        return Object.entries(totals).map(([materialName, totalNeeded]) => {
            const currentMaterial = materials.find(
                (m) => m.name.toLowerCase() === materialName
            );
            const currentAmount = currentMaterial?.quantity || 0;
            const stillNeeded = Math.max(0, totalNeeded - currentAmount);
            const isCraftable = isMaterialACraftableRecipe(materialName);

            return {
                materialName: currentMaterial?.name || materialName,
                totalNeeded,
                currentAmount,
                stillNeeded,
                hasEnough: currentAmount >= totalNeeded,
                isCraftable
            };
        }).sort((a, b) => a.materialName.localeCompare(b.materialName));
    };

    const totalRequirements = calculateTotalRequirements();
    const canFulfillOrder = totalRequirements.length > 0 && totalRequirements.every(r => r.hasEnough);

    return (
        <div className="crafting-calculator-section">
            <h2>📋 Order Fulfillment Calculator</h2>
            <p className="calculator-description">
                Plan multiple crafts at once by building an order. Select recipes and quantities, then view total material requirements.
                The calculator automatically accounts for nested recipes (items that require other crafted items as materials).
            </p>

            <div className="calculator-inputs">
                <div className="calculator-input-group">
                    <label>Select Recipe</label>
                    <select
                        value={selectedRecipeId}
                        onChange={(e) => setSelectedRecipeId(e.target.value)}
                        className="calculator-select"
                    >
                        <option value="">Choose a recipe...</option>
                        {recipes.map((recipe) => (
                            <option key={recipe.id} value={recipe.id}>
                                {recipe.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="calculator-input-group">
                    <label>Quantity</label>
                    <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                        min="1"
                        className="calculator-quantity-input"
                    />
                </div>

                <div className="calculator-input-group">
                    <label>&nbsp;</label>
                    <button
                        onClick={addToOrder}
                        disabled={!selectedRecipe}
                        className="btn-add-to-order"
                    >
                        + Add to Order
                    </button>
                </div>
            </div>

            {order.length > 0 && (
                <>
                    <div className="order-list">
                        <div className="order-header">
                            <h3>Current Order</h3>
                            <button onClick={clearOrder} className="btn-clear-order">
                                Clear All
                            </button>
                        </div>
                        <div className="order-items">
                            {order.map((item) => (
                                <div key={item.recipe.id} className="order-item">
                                    <div className="order-item-info">
                                        <span className="order-item-name">{item.recipe.name}</span>
                                        <div className="order-item-controls">
                                            <button
                                                onClick={() => updateOrderQuantity(item.recipe.id, item.quantity - 1)}
                                                className="btn-order-qty"
                                            >
                                                −
                                            </button>
                                            <span className="order-item-quantity">×{item.quantity}</span>
                                            <button
                                                onClick={() => updateOrderQuantity(item.recipe.id, item.quantity + 1)}
                                                className="btn-order-qty"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeFromOrder(item.recipe.id)}
                                        className="btn-remove-order-item"
                                        title="Remove from order"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="calculator-results">
                        <div className="calculator-header">
                            <h3>Total Materials Required</h3>
                            <div className={`calculator-status ${canFulfillOrder ? 'can-craft' : 'cannot-craft'}`}>
                                {canFulfillOrder ? '✓ Can fulfill order' : '✗ Insufficient materials'}
                            </div>
                        </div>

                        <div className="materials-table-wrapper">
                            <table className="materials-table">
                                <thead>
                                    <tr>
                                        <th>Material</th>
                                        <th>Total Needed</th>
                                        <th>You Have</th>
                                        <th>Still Need</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {totalRequirements.map((req, idx) => {
                                        const subRecipe = req.isCraftable ? getRecipeForMaterial(req.materialName) : null;
                                        const isExpanded = expandedMaterials.has(req.materialName.toLowerCase());

                                        return (
                                            <React.Fragment key={idx}>
                                                <tr
                                                    className={`${req.hasEnough ? 'sufficient-row' : 'insufficient-row'} ${req.isCraftable ? 'expandable-row' : ''}`}
                                                >
                                                    <td className="material-name-cell">
                                                        {req.isCraftable && (
                                                            <button
                                                                onClick={() => toggleMaterialExpansion(req.materialName)}
                                                                className="expand-btn"
                                                                title="Click to see recipe details"
                                                            >
                                                                {isExpanded ? '▼' : '▶'}
                                                            </button>
                                                        )}
                                                        {req.materialName}
                                                        {req.isCraftable && <span className="craftable-badge">📦</span>}
                                                    </td>
                                                    <td className="total-cell">{req.totalNeeded}</td>
                                                    <td className="current-cell">{req.currentAmount}</td>
                                                    <td className={`needed-cell ${req.stillNeeded === 0 ? 'zero' : 'nonzero'}`}>
                                                        {req.stillNeeded}
                                                    </td>
                                                    <td className="status-cell">
                                                        <span className={`status-badge ${req.hasEnough ? 'check' : 'cross'}`}>
                                                            {req.hasEnough ? '✓' : '✗'}
                                                        </span>
                                                    </td>
                                                </tr>
                                                {isExpanded && subRecipe && (
                                                    <tr className="expanded-details">
                                                        <td colSpan={5}>
                                                            <div className="sub-recipe-details">
                                                                <div className="sub-recipe-header">
                                                                    <strong>Recipe for {req.materialName}:</strong>
                                                                    <span className="sub-recipe-qty">({req.totalNeeded}× needed)</span>
                                                                </div>
                                                                <table className="sub-materials-table">
                                                                    <thead>
                                                                        <tr>
                                                                            <th>Material</th>
                                                                            <th>Per Item</th>
                                                                            <th>Total Needed</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {subRecipe.requiredMaterials.map((subReq, subIdx) => {
                                                                            const totalSubNeeded = subReq.quantity * req.totalNeeded;
                                                                            const isSubCraftable = isMaterialACraftableRecipe(subReq.materialName);
                                                                            const subSubRecipe = isSubCraftable ? getRecipeForMaterial(subReq.materialName) : null;
                                                                            const isSubExpanded = expandedMaterials.has(`${req.materialName.toLowerCase()}:${subReq.materialName.toLowerCase()}`);

                                                                            return (
                                                                                <React.Fragment key={subIdx}>
                                                                                    <tr>
                                                                                        <td>
                                                                                            {isSubCraftable && (
                                                                                                <button
                                                                                                    onClick={() => toggleMaterialExpansion(`${req.materialName}:${subReq.materialName}`)}
                                                                                                    className="expand-btn sub-expand-btn"
                                                                                                    title="Click to see recipe details"
                                                                                                >
                                                                                                    {isSubExpanded ? '▼' : '▶'}
                                                                                                </button>
                                                                                            )}
                                                                                            {subReq.materialName}
                                                                                            {isSubCraftable && <span className="craftable-badge">📦</span>}
                                                                                        </td>
                                                                                        <td>{subReq.quantity}</td>
                                                                                        <td className="sub-total-needed">{totalSubNeeded}</td>
                                                                                    </tr>
                                                                                    {isSubExpanded && subSubRecipe && (
                                                                                        <tr>
                                                                                            <td colSpan={3} className="nested-recipe-cell">
                                                                                                <div className="nested-recipe-details">
                                                                                                    <strong>Recipe for {subReq.materialName}:</strong>
                                                                                                    <ul className="nested-materials-list">
                                                                                                        {subSubRecipe.requiredMaterials.map((nestedReq, nestedIdx) => (
                                                                                                            <li key={nestedIdx}>
                                                                                                                <span className="nested-material-name">{nestedReq.materialName}</span>
                                                                                                                <span className="nested-material-qty">×{nestedReq.quantity} each</span>
                                                                                                                <span className="nested-material-total">(×{nestedReq.quantity * totalSubNeeded} total)</span>
                                                                                                            </li>
                                                                                                        ))}
                                                                                                    </ul>
                                                                                                </div>
                                                                                            </td>
                                                                                        </tr>
                                                                                    )}
                                                                                </React.Fragment>
                                                                            );
                                                                        })}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

            {order.length === 0 && (
                <div className="calculator-placeholder">
                    <p>Add items to the order to calculate total materials needed</p>
                </div>
            )}
        </div>
    );
};

export default CraftingCalculator;
