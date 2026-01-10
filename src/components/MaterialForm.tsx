import React, { useState, useEffect } from 'react';
import { Material } from '../types';

interface MaterialFormProps {
  onAddMaterial: (material: Material) => void;
  onUpdateMaterial?: (material: Material) => void;
  editingMaterial?: Material | null;
  onCancelEdit?: () => void;
}

const MaterialForm: React.FC<MaterialFormProps> = ({
  onAddMaterial,
  onUpdateMaterial,
  editingMaterial,
  onCancelEdit
}) => {
  const [materialName, setMaterialName] = useState('');
  const [materialQuantity, setMaterialQuantity] = useState('');
  const [materialRarity, setMaterialRarity] = useState<'common' | 'uncommon' | 'rare'>('common');
  const [materialValue, setMaterialValue] = useState('');
  const [materialBuyer, setMaterialBuyer] = useState('');

  useEffect(() => {
    if (editingMaterial) {
      setMaterialName(editingMaterial.name);
      setMaterialQuantity(editingMaterial.quantity.toString());
      setMaterialRarity(editingMaterial.rarity || 'common');
      setMaterialValue(editingMaterial.value ? editingMaterial.value.toString() : '');
      setMaterialBuyer(editingMaterial.buyer || '');
    }
  }, [editingMaterial]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (materialName.trim() === '') return;

    if (editingMaterial && onUpdateMaterial) {
      const updatedMaterial: Material = {
        ...editingMaterial,
        name: materialName,
        quantity: Number(materialQuantity) || 0,
        rarity: materialRarity,
        value: materialValue ? Number(materialValue) : undefined,
        buyer: materialBuyer || undefined,
      };
      onUpdateMaterial(updatedMaterial);
      resetForm();
    } else {
      const newMaterial: Material = {
        id: Date.now().toString(),
        name: materialName,
        quantity: Number(materialQuantity) || 0,
        rarity: materialRarity,
        value: materialValue ? Number(materialValue) : undefined,
        buyer: materialBuyer || undefined,
      };
      onAddMaterial(newMaterial);
      resetForm();
    }
  };

  const resetForm = () => {
    setMaterialName('');
    setMaterialQuantity('');
    setMaterialRarity('common');
    setMaterialValue('');
    setMaterialBuyer('');
    if (onCancelEdit) onCancelEdit();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={materialName}
        onChange={(e) => setMaterialName(e.target.value)}
        placeholder="e.g., Plastic, Iron Ore, Springs"
        required
      />
      <input
        type="number"
        value={materialQuantity}
        onChange={(e) => setMaterialQuantity(e.target.value)}
        min="0"
        placeholder="Quantity (e.g., 25)"
        required
      />
      <input
        type="number"
        value={materialValue}
        onChange={(e) => setMaterialValue(e.target.value)}
        min="0"
        step="0.01"
        placeholder="Price per unit (e.g., 10.00)"
      />
      <input
        type="text"
        value={materialBuyer}
        onChange={(e) => setMaterialBuyer(e.target.value)}
        placeholder="Buyer/Vendor (e.g., John, Trader Bob)"
      />
      <select
        value={materialRarity}
        onChange={(e) => setMaterialRarity(e.target.value as 'common' | 'uncommon' | 'rare')}
        className="rarity-select"
      >
        <option value="common">Common</option>
        <option value="uncommon">Uncommon</option>
        <option value="rare">Rare</option>
      </select>
      <button type="submit">
        {editingMaterial ? 'Update Material' : 'Add Material'}
      </button>
      {editingMaterial && onCancelEdit && (
        <button type="button" onClick={resetForm} className="btn-cancel-edit">
          Cancel
        </button>
      )}
    </form>
  );
};

export default MaterialForm;