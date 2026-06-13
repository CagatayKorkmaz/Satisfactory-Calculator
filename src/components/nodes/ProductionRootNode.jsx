import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

const ProductionRootNode = memo(({ id, data, selected }) => {
  const {
    itemName,
    icon,
    machine,
    machineCount,
    fullMachines,
    underclockPercent,
    requiredAmount,
    standardAmount,
    onDelete,
    onRecipeChange,
    inputCount,
    byproductCount = 0,
    availableRecipes = [],
    activeRecipe,
  } = data;

  const hasUnderclock = underclockPercent > 0 && fullMachines < machineCount;
  const hasByproducts = byproductCount > 0;

  const formatAmount = (value) => (
    value != null && value % 1 === 0 ? value.toString() : value?.toFixed(2)
  );

  return (
    <div
      className={`sf-node ${selected ? 'selected' : ''}`}
      style={{ minWidth: 220, position: 'relative' }}
    >
      {onDelete && (
        <button className="node-delete-btn" onClick={() => onDelete(id)} title="Sil">
          ✕
        </button>
      )}

      <div
        className="node-header"
        style={{
          background: 'linear-gradient(135deg, rgba(240,165,0,0.15), rgba(240,165,0,0.05))',
          borderRadius: '16px 16px 0 0',
        }}
      >
        {icon.startsWith('/')
          ? <img className="node-icon" src={icon} alt={itemName} />
          : <span className="node-icon">{icon}</span>}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="node-title" style={{ color: 'var(--color-primary)', fontSize: 16, fontWeight: 700 }}>
            {itemName}
          </div>
          {machine && (
            <div className="node-machine" style={{ fontSize: 14, fontWeight: 700 }}>
              {machine} × {machineCount}
            </div>
          )}
          {machine && hasUnderclock && (
            <div className="node-underclock">
              {fullMachines} @ 100%, 1 @ %{underclockPercent}
            </div>
          )}
        </div>
        <div
          style={{
            background: 'var(--color-primary)',
            color: '#000',
            fontSize: 9,
            fontWeight: 700,
            padding: '2px 6px',
            borderRadius: 4,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}
        >
          HEDEF
        </div>
      </div>

      <div className="node-body">
        <div className="node-amount-row">
          <span className="node-amount-label">Hedef Üretim</span>
          <span className="node-amount-value">
            {formatAmount(standardAmount)}/dk
          </span>
        </div>
        {requiredAmount !== standardAmount && (
          <div className="node-amount-row">
            <span className="node-amount-label">Kalan İhtiyaç</span>
            <span
              className="node-amount-value"
              style={{ color: requiredAmount === 0 ? 'var(--color-success)' : 'var(--color-error)' }}
            >
              {formatAmount(requiredAmount)}/dk
            </span>
          </div>
        )}

        {availableRecipes.length > 1 && (
          <div className="node-recipe-select nodrag" style={{ padding: '2px 0 2px' }}>
            <select
              className="recipe-dropdown"
              value={activeRecipe || ''}
              onChange={(e) => {
                e.stopPropagation();
                if (onRecipeChange) onRecipeChange(id, itemName, e.target.value);
              }}
              onClick={e => e.stopPropagation()}
              onMouseDown={e => e.stopPropagation()}
            >
              {availableRecipes.map(r => (
                <option key={r.recipeName} value={r.recipeName}>
                  {r.isAlternate ? '✦ ' : ''}{r.recipeName}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {hasByproducts && Array.from({ length: byproductCount }, (_, i) => {
        const count = Math.max(1, byproductCount);
        const left = count === 1 ? '50%' : `${10 + (i / (count - 1)) * 80}%`;
        return (
          <Handle
            key={`byproduct-source-${i}`}
            type="source"
            position={Position.Top}
            id={`byproduct-source-${i}`}
            style={{ background: '#c084fc', left }}
          />
        );
      })}

      {Array.from({ length: inputCount || 1 }, (_, i) => {
        const count = Math.max(1, inputCount);
        const left = count === 1 ? '50%' : `${10 + (i / (count - 1)) * 80}%`;
        return (
          <Handle
            key={`target-${i}`}
            type="target"
            position={Position.Bottom}
            id={`target-${i}`}
            style={{ background: 'var(--color-primary)', left }}
          />
        );
      })}
    </div>
  );
});

ProductionRootNode.displayName = 'ProductionRootNode';
export default ProductionRootNode;
