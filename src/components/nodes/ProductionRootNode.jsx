import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

/**
 * ProductionRootNode — Üretim hattının kök düğümü (hedef ürün).
 * Kullanıcının seçtiği ürünü ve hedef miktarı gösterir.
 */
const ProductionRootNode = memo(({ id, data, selected }) => {
  const {
    itemName,
    icon,
    machine,
    machineCount,
    requiredAmount,
    standardAmount,
    onDelete,
  } = data;

  return (
    <div
      className={`sf-node ${selected ? 'selected' : ''}`}
      style={{ minWidth: 220, position: 'relative' }}
    >
      {/* Sil butonu */}
      {onDelete && (
        <button className="node-delete-btn" onClick={() => onDelete(id)} title="Sil">
          ✕
        </button>
      )}

      {/* Header */}
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
          <div className="node-title" style={{ color: 'var(--color-primary)' }}>
            {itemName}
          </div>
          {machine && (
            <div className="node-machine">
              {machine} × {machineCount}
            </div>
          )}
        </div>
        {/* Hedef rozeti */}
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

      {/* Body */}
      <div className="node-body">
        <div className="node-amount-row">
          <span className="node-amount-label">Hedef Üretim</span>
          <span className="node-amount-value">
            {standardAmount?.toFixed(2)}/dk
          </span>
        </div>
        {requiredAmount !== standardAmount && (
          <div className="node-amount-row">
            <span className="node-amount-label">Kalan İhtiyaç</span>
            <span
              className="node-amount-value"
              style={{ color: requiredAmount === 0 ? 'var(--color-success)' : 'var(--color-error)' }}
            >
              {requiredAmount?.toFixed(2)}/dk
            </span>
          </div>
        )}
      </div>

      {/* Alt bileşenlerden gelen bağlantılar (alttan) */}
      <Handle
        type="target"
        position={Position.Bottom}
        style={{ background: 'var(--color-primary)' }}
      />
    </div>
  );
});

ProductionRootNode.displayName = 'ProductionRootNode';
export default ProductionRootNode;
