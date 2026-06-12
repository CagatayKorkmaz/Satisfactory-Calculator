import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

const RawNode = memo(({ id, data, selected }) => {
  const {
    itemName,
    icon,
    requiredAmount,
    satisfied,
    overflowing,
    onOverrideChange,
    outputCount,
  } = data;

  const handleOverrideChange = (e) => {
    const val = e.target.value;
    const numVal = val === '' ? null : Number(val);
    if (onOverrideChange) onOverrideChange(id, itemName, numVal);
  };

  const getStatusColor = () => {
    if (overflowing) return 'var(--color-accent)';
    if (satisfied) return 'var(--color-success)';
    return 'var(--color-warning)';
  };

  return (
    <div
      className={`sf-node ${selected ? 'selected' : ''} ${satisfied ? 'satisfied' : ''}`}
      style={{
        minWidth: 180,
        position: 'relative',
        borderLeft: `3px solid ${getStatusColor()}`,
        opacity: satisfied ? 0.7 : 1,
      }}
    >
      <div
        className="node-header"
        style={{
          background: 'rgba(245, 158, 11, 0.08)',
        }}
      >
        {icon.startsWith('/')
          ? <img className="node-icon" src={icon} alt={itemName} />
          : <span className="node-icon">{icon}</span>}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="node-title" style={{ color: 'var(--color-warning)' }}>
            {itemName}
          </div>
          <div className="node-machine" style={{ color: 'var(--color-warning)', opacity: 0.7 }}>
            ⛏️ Ham Kaynak
          </div>
        </div>
      </div>

      <div className="node-body">
        <div className="node-amount-row">
          <span className="node-amount-label">Gereken</span>
          <span
            className="node-amount-value"
            style={{ color: satisfied ? 'var(--color-success)' : 'var(--color-warning)' }}
          >
            {requiredAmount?.toFixed(2)}/dk
          </span>
        </div>

        <div style={{ marginTop: 8 }}>
          <div className="node-override-label">Elimdeki Miktar (/dk)</div>
          <input
            className="override-input nodrag"
            type="number"
            min="0"
            step="1"
            placeholder="0"
            defaultValue={data.userOverride ?? ''}
            onChange={handleOverrideChange}
            style={{
              borderColor: satisfied ? 'var(--color-success)'
                : overflowing ? 'var(--color-accent)'
                : 'var(--color-warning)',
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
    </div>
  );
});

RawNode.displayName = 'RawNode';
export default RawNode;
