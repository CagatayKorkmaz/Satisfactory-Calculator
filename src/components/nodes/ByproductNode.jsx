import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

const ByproductNode = memo(({ id, data, selected }) => {
  const { itemName, icon, standardAmount, outputCount = 0, onDelete } = data;

  const formatAmount = (value) => {
    if (value == null) return '';
    if (value % 1 === 0) return value.toString();
    return value.toFixed(3).replace(/\.?0+$/, '');
  };

  const hasOutputs = outputCount > 0;

  return (
    <div
      className={`sf-node ${selected ? 'selected' : ''}`}
      style={{
        minWidth: 180,
        position: 'relative',
        borderLeft: '3px solid #c084fc',
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
          <div className="node-title">{itemName}</div>
        </div>
      </div>

      <div className="node-body">
        <div className="node-amount-row">
          <span className="node-amount-label">Yan Ürün</span>
          <span className="node-amount-value" style={{ color: '#c084fc' }}>
            {formatAmount(standardAmount)}/dk
          </span>
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Bottom}
        id="target-0"
        style={{ background: '#c084fc', bottom: -4 }}
      />

      {hasOutputs && Array.from({ length: outputCount }, (_, i) => {
        const count = Math.max(1, outputCount);
        const left = count === 1 ? '50%' : `${10 + (i / (count - 1)) * 80}%`;
        return (
          <Handle
            key={`source-${i}`}
            type="source"
            position={Position.Top}
            id={`source-${i}`}
            style={{ background: '#c084fc', left, top: -4 }}
          />
        );
      })}
    </div>
  );
});

ByproductNode.displayName = 'ByproductNode';
export default ByproductNode;
