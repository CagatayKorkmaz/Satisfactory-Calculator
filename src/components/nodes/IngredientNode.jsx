import { memo, useState, useCallback } from 'react';
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
    userOverride,
    satisfied,
    overflowing,
    onOverrideChange,
    onDelete,
    inputCount,
    outputCount,
  } = data;

  const hasUnderclock = underclockPercent > 0 && fullMachines < machineCount;

  const [inputValue, setInputValue] = useState(
    userOverride !== null && userOverride !== undefined ? String(userOverride) : ''
  );

  const handleOverrideChange = useCallback((e) => {
    const val = e.target.value;
    setInputValue(val);
    const numVal = val === '' ? null : Number(val);
    if (onOverrideChange) {
      onOverrideChange(id, itemName, numVal);
    }
  }, [id, itemName, onOverrideChange]);

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
        {icon.startsWith('/')
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
            {standardAmount != null && standardAmount % 1 === 0 ? standardAmount.toString() : standardAmount?.toFixed(2)}/dk
          </span>
        </div>

        {userOverride !== null && userOverride !== undefined && (
          <div className="node-amount-row">
            <span className="node-amount-label">Kalan İhtiyaç</span>
            <span
              className={`node-amount-value ${requiredAmount === 0 ? 'zero' : ''}`}
              style={{ color: getStatusColor() }}
            >
              {requiredAmount != null && requiredAmount % 1 === 0 ? requiredAmount.toString() : requiredAmount?.toFixed(2)}/dk
            </span>
          </div>
        )}

        <div style={{ marginTop: 8 }}>
          <div className="node-override-label">Elimdeki Miktar (/dk)</div>
          <input
            className="override-input nodrag"
            type="number"
            min="0"
            step="0.5"
            placeholder="0"
            value={inputValue}
            onChange={handleOverrideChange}
            style={{
              borderColor: satisfied
                ? 'var(--color-success)'
                : overflowing
                ? 'var(--color-accent)'
                : undefined,
            }}
          />
        </div>
      </div>

      {Array.from({ length: outputCount || 1 }, (_, i) => {
        const count = Math.max(1, outputCount);
        const left = count === 1 ? '50%' : `${10 + (i / (count - 1)) * 80}%`;
        return (
          <Handle
            key={`source-${i}`}
            type="source"
            position={Position.Top}
            id={`source-${i}`}
            style={{ background: getStatusColor(), left }}
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
            style={{ background: getStatusColor(), left }}
          />
        );
      })}
    </div>
  );
});

IngredientNode.displayName = 'IngredientNode';
export default IngredientNode;
