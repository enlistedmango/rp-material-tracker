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
  const [materialQuantity, setMaterialQuantity] = useState(0);
  const [materialRarity, setMaterialRarity] = useState<'common' | 'uncommon' | 'rare'>('common');

  useEffect(() => {
    if (editingMaterial) {
      setMaterialName(editingMaterial.name);
      setMaterialQuantity(editingMaterial.quantity);
      setMaterialRarity(editingMaterial.rarity || 'common');
    }
  }, [editingMaterial]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (materialName.trim() === '') return;

    if (editingMaterial && onUpdateMaterial) {
      const updatedMaterial: Material = {
        ...editingMaterial,
        name: materialName,
        quantity: materialQuantity,
        rarity: materialRarity,
      };
      onUpdateMaterial(updatedMaterial);
      resetForm();
    } else {
      const newMaterial: Material = {
        id: Date.now().toString(),
        name: materialName,
        quantity: materialQuantity,
        rarity: materialRarity,
      };
      onAddMaterial(newMaterial);
      resetForm();
    }
  };

  const resetForm = () => {
    setMaterialName('');
    setMaterialQuantity(0);
    setMaterialRarity('common');
    if (onCancelEdit) onCancelEdit();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={materialName}
        onChange={(e) => setMaterialName(e.target.value)}
        placeholder="Material Name"
        required
      />
      <input
        type="number"
        value={materialQuantity}
        onChange={(e) => setMaterialQuantity(Number(e.target.value))}
        min="0"
        placeholder="Quantity"
        required
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