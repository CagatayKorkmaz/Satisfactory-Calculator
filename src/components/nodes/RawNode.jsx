import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

const RawNode = memo(({ id, data, selected }) => {
  const {
    itemName,
    icon,
    requiredAmount,
    standardAmount,
    satisfied,
    overflowing,
    onOverrideChange,
    outputCount,
  } = data;

  const handleToggleEstablished = (e) => {
    e.stopPropagation();
    if (!onOverrideChange) return;
    if (satisfied) {
      onOverrideChange(id, itemName, null);
    } else {
      onOverrideChange(id, itemName, standardAmount);
    }
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
            {requiredAmount != null && requiredAmount % 1 === 0 ? requiredAmount.toString() : requiredAmount?.toFixed(3).replace(/\.?0+$/, '')}/dk
          </span>
        </div>

        <div
          className={`node-established-toggle ${satisfied ? 'active' : ''}`}
          onClick={handleToggleEstablished}
        >
          <span className="checkmark-icon">{satisfied ? '✅' : '⬜'}</span>
          <span className="established-label">Üretim Kuruldu</span>
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
