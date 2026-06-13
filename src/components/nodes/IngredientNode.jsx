import { memo, useCallback } from 'react';
import { Handle, Position } from '@xyflow/react';

const IngredientNode = memo(({ id, data, selected }) => {
  const {
    itemName,
    icon,
    machine,
    machineCount,
    fullMachines,
    underclockPercent,
    requiredAmount,
    standardAmount,
    satisfied,
    overflowing,
    onOverrideChange,
    onDelete,
    onRecipeChange,
    inputCount,
    outputCount,
    byproductCount = 0,
    availableRecipes = [],
    activeRecipe,
  } = data;

  const hasUnderclock = underclockPercent > 0 && fullMachines < machineCount;
  const hasByproducts = byproductCount > 0;

  const formatAmount = (value) => {
    if (value == null) return '';
    if (value % 1 === 0) return value.toString();
    return value.toFixed(3).replace(/\.?0+$/, '');
  };

  const handleToggleEstablished = useCallback((e) => {
    e.stopPropagation();
    if (!onOverrideChange) return;
    if (satisfied) {
      onOverrideChange(id, itemName, null);
    } else {
      onOverrideChange(id, itemName, standardAmount);
    }
  }, [id, itemName, standardAmount, satisfied, onOverrideChange]);

  const getStatusColor = () => {
    if (overflowing) return 'var(--color-accent)';
    if (satisfied) return 'var(--color-success)';
    if (requiredAmount > 0) return 'var(--color-error)';
    return 'var(--color-text-dim)';
  };

  const getStatusLabel = () => {
    if (overflowing) return { text: 'FAZLA', cls: 'overflow' };
    if (satisfied) return { text: 'YETERLİ', cls: 'satisfied' };
    if (requiredAmount > 0) return { text: 'EKSİK', cls: 'needed' };
    return null;
  };

  const status = getStatusLabel();

  return (
    <div
      className={`sf-node ${selected ? 'selected' : ''} ${satisfied ? 'satisfied' : ''} ${overflowing ? 'overflow' : ''}`}
      style={{
        minWidth: 200,
        position: 'relative',
        borderLeft: `3px solid ${getStatusColor()}`,
      }}
    >
      {onDelete && (
        <button className="node-delete-btn" onClick={() => onDelete(id)} title="Sil">
          ✕
        </button>
      )}

      <div className="node-header">
        {icon?.startsWith('/')
          ? <img className="node-icon" src={icon} alt={itemName} />
          : <span className="node-icon">{icon}</span>}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="node-title" style={{ fontSize: 15, fontWeight: 700 }}>{itemName}</div>
          {machine && (
            <div className="node-machine" style={{ fontSize: 14, fontWeight: 700 }}>
              {machine} × {machineCount > 0 ? machineCount : '—'}
            </div>
          )}
          {machine && hasUnderclock && (
            <div className="node-underclock">
              {fullMachines} @ 100%, 1 @ %{underclockPercent}
            </div>
          )}
        </div>
        {status && (
          <span className={`status-badge ${status.cls}`}>
            {status.text}
          </span>
        )}
      </div>

      <div className="node-body">
        <div className="node-amount-row">
          <span className="node-amount-label">Standart İhtiyaç</span>
          <span className="node-amount-value">
            {formatAmount(standardAmount)}/dk
          </span>
        </div>

        {availableRecipes.length > 1 && (
          <div className="node-recipe-select nodrag" style={{ padding: '2px 0 4px' }}>
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
              {[...availableRecipes].sort((a, b) => a.isAlternate - b.isAlternate).map(r => (
                <option key={r.recipeName} value={r.recipeName}>
                  {r.isAlternate ? '(Alt) ' : ''}{r.recipeName}
                </option>
              ))}
            </select>
          </div>
        )}

        <div
          className={`node-established-toggle ${satisfied ? 'active' : ''}`}
          onClick={handleToggleEstablished}
        >
          <span className="checkmark-icon">{satisfied ? '✅' : '⬜'}</span>
          <span className="established-label">Üretim Kuruldu</span>
        </div>
      </div>

      {(() => {
        const totalTopCount = Math.max(1, (outputCount || 1) + byproductCount);
        return (
          <>
            {Array.from({ length: outputCount || 1 }, (_, i) => {
              const left = totalTopCount === 1 ? '50%' : `${10 + (i / (totalTopCount - 1)) * 80}%`;
              return (
                <Handle
                  key={`source-${i}`}
                  type="source"
                  position={Position.Top}
                  id={`source-${i}`}
                  style={{ background: getStatusColor(), left, top: -4 }}
                />
              );
            })}
            {hasByproducts && Array.from({ length: byproductCount }, (_, i) => {
              const idx = (outputCount || 1) + i;
              const left = totalTopCount === 1 ? '50%' : `${10 + (idx / (totalTopCount - 1)) * 80}%`;
              return (
                <Handle
                  key={`byproduct-source-${i}`}
                  type="source"
                  position={Position.Top}
                  id={`byproduct-source-${i}`}
                  style={{ background: '#c084fc', left, top: -4 }}
                />
              );
            })}
          </>
        );
      })()}

      {Array.from({ length: inputCount || 1 }, (_, i) => {
        const count = Math.max(1, inputCount);
        const left = count === 1 ? '50%' : `${10 + (i / (count - 1)) * 80}%`;
        return (
          <Handle
            key={`target-${i}`}
            type="target"
            position={Position.Bottom}
            id={`target-${i}`}
            style={{ background: getStatusColor(), left, bottom: -4 }}
          />
        );
      })}
    </div>
  );
});

IngredientNode.displayName = 'IngredientNode';
export default IngredientNode;
