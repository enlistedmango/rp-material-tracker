import React, { useState } from 'react';
import { Material } from '../types';

interface MaterialListProps {
  materials: Material[];
  onUpdateMaterial: (id: string, quantity: number) => void;
  onDeleteMaterial: (id: string) => void;
  onEditMaterial: (material: Material) => void;
}

const MaterialList: React.FC<MaterialListProps> = ({
  materials,
  onUpdateMaterial,
  onDeleteMaterial,
  onEditMaterial,
}) => {
  const [quickAddMode, setQuickAddMode] = useState(false);
  const [quickAddValues, setQuickAddValues] = useState<{ [key: string]: string }>({});
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMaterials = materials.filter((material) =>
    material.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const calculateTotalValue = () => {
    return filteredMaterials.reduce((total, material) => {
      return total + (material.quantity * (material.value || 0));
    }, 0);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  if (materials.length === 0) {
    return (
      <div className="materials-section">
        <h2>Your Materials</h2>
        <p className="empty-message">No materials yet. Add some above!</p>
      </div>
    );
  }

  const sortedMaterials = [...filteredMaterials].sort((a, b) => b.quantity - a.quantity);

  const handleQuickAddChange = (id: string, value: string) => {
    setQuickAddValues({ ...quickAddValues, [id]: value });
  };

  const handleQuickAddSubmit = (material: Material) => {
    const addAmount = parseInt(quickAddValues[material.id] || '0');
    if (addAmount > 0) {
      onUpdateMaterial(material.id, material.quantity + addAmount);
      setQuickAddValues({ ...quickAddValues, [material.id]: '' });
    }
  };

  const handleApplyAll = () => {
    sortedMaterials.forEach((material) => {
      const addAmount = parseInt(quickAddValues[material.id] || '0');
      if (addAmount > 0) {
        onUpdateMaterial(material.id, material.quantity + addAmount);
      }
    });
    setQuickAddValues({});
  };

  return (
    <div className="materials-section">
      <div className="materials-header">
        <h2>Your Materials</h2>
        <button
          onClick={() => {
            setQuickAddMode(!quickAddMode);
            setQuickAddValues({});
          }}
          className={`btn-quick-add-toggle ${quickAddMode ? 'active' : ''}`}
        >
          {quickAddMode ? '✓ Done Adding' : '+ Quick Add'}
        </button>
      </div>
      
      <div className="search-filter-bar">
        <input
          type="text"
          placeholder="🔍 Search materials..."
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
        Sorted by quantity (highest first). Use Quick Add mode to bulk update materials after a run.
        Hover over cards to see edit (✎) and delete (✕) buttons. Low stock items ({"< 10"}) have red backgrounds.
        {searchQuery && ` Showing ${filteredMaterials.length} of ${materials.length} materials.`}
      </p>
      {calculateTotalValue() > 0 && (
        <div className="total-value-display">
          <span className="total-value-label">Total Material Value:</span>
          <span className="total-value-amount">{formatCurrency(calculateTotalValue())}</span>
        </div>
      )}
      {quickAddMode && (
        <div className="quick-add-instructions">
          <p>Enter quantities found during your run, then click "Apply All" or press Enter on each field.</p>
          <button onClick={handleApplyAll} className="btn-apply-all">
            Apply All
          </button>
        </div>
      )}
      {filteredMaterials.length === 0 && searchQuery ? (
        <div className="no-results">
          <p>No materials found matching "{searchQuery}"</p>
        </div>
      ) : (
      <div className="materials-grid">
        {sortedMaterials.map((material) => (
          <div
            key={material.id}
            className={`material-card ${material.quantity < 10 ? 'low-stock' : ''}`}
            data-rarity={material.rarity || 'common'}
          >
            <div className="material-card-actions">
              <button
                onClick={() => onEditMaterial(material)}
                className="btn-edit-material"
                title="Edit material"
              >
                ✎
              </button>
              <button
                onClick={() => onDeleteMaterial(material.id)}
                className="btn-delete-material"
                title="Delete material"
              >
                ✕
              </button>
            </div>
            <span className="material-name">{material.name}</span>
            {material.value && material.value > 0 && (
              <div className="material-value-info">
                <span className="material-unit-value">${material.value.toFixed(2)} each</span>
                <span className="material-total-value">{formatCurrency(material.quantity * material.value)}</span>
              </div>
            )}
            {quickAddMode ? (
              <div className="quick-add-input-container">
                <span className="current-qty">Current: {material.quantity}</span>
                <div className="quick-add-controls">
                  <input
                    type="number"
                    min="0"
                    placeholder="Add..."
                    value={quickAddValues[material.id] || ''}
                    onChange={(e) => handleQuickAddChange(material.id, e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleQuickAddSubmit(material);
                      }
                    }}
                    className="quick-add-input"
                  />
                  <button
                    onClick={() => handleQuickAddSubmit(material)}
                    className="btn-quick-add-submit"
                    disabled={!quickAddValues[material.id] || parseInt(quickAddValues[material.id]) <= 0}
                  >
                    +
                  </button>
                </div>
              </div>
            ) : (
              <div className="material-controls">
                <button
                  onClick={() => onUpdateMaterial(material.id, material.quantity - 1)}
                  disabled={material.quantity <= 0}
                  className="btn-small"
                >
                  −
                </button>
                <span className="material-quantity">{material.quantity}</span>
                <button
                  onClick={() => onUpdateMaterial(material.id, material.quantity + 1)}
                  className="btn-small"
                >
                  +
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      )}
    </div>
  );
};

export default MaterialList;