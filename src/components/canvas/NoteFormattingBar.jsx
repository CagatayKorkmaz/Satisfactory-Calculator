import { useState, useCallback, useRef, useEffect } from 'react';

const FONTS = ['Excalifont', 'Lazy Dog', 'Sans-serif'];
const SIZES = [
  { label: 'S', value: 'S', px: 14 },
  { label: 'M', value: 'M', px: 18 },
  { label: 'L', value: 'L', px: 24 },
  { label: 'XL', value: 'XL', px: 32 },
];
const COLORS = [
  '#e2e8f0', '#f0a500', '#00d4ff', '#22c55e',
  '#ef4444', '#c084fc', '#f97316', '#94a3b8',
];
const OPACITIES = [
  { label: '100%', value: 1 },
  { label: '75%', value: 0.75 },
  { label: '50%', value: 0.5 },
  { label: '25%', value: 0.25 },
];
const IMAGE_POSITIONS = [
  { label: 'Top', value: 'top' },
  { label: 'Left', value: 'left' },
  { label: 'Right', value: 'right' },
];

const AlignIcon = ({ align }) => (
  <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    {align === 'left' && (
      <>
        <line x1="0" y1="1.5" x2="12" y2="1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="0" y1="6" x2="16" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="0" y1="10.5" x2="10" y2="10.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </>
    )}
    {align === 'center' && (
      <>
        <line x1="2" y1="1.5" x2="14" y2="1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="0" y1="6" x2="16" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="3" y1="10.5" x2="13" y2="10.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </>
    )}
    {align === 'right' && (
      <>
        <line x1="4" y1="1.5" x2="16" y2="1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="0" y1="6" x2="16" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="6" y1="10.5" x2="16" y2="10.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </>
    )}
  </svg>
);

export default function NoteFormattingBar({
  nodeId,
  nodeData,
  itemsMap = {},
  onUpdate,
  onDelete,
}) {
  const [showImageSearch, setShowImageSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const searchRef = useRef(null);

  const filteredItems = Object.entries(itemsMap).filter(([name]) =>
    name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectItem = useCallback((name, icon) => {
    onUpdate(nodeId, { imageUrl: icon });
    setShowImageSearch(false);
    setSearchTerm('');
  }, [nodeId, onUpdate]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowImageSearch(false);
        setSearchTerm('');
      }
    };
    if (showImageSearch) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showImageSearch]);

  const currentColor = nodeData.color || '#e2e8f0';
  const currentSize = nodeData.size || 'M';
  const currentAlign = nodeData.align || 'left';
  const currentOpacity = nodeData.opacity ?? 1;
  const currentFont = nodeData.font || 'Excalifont';
  const hasImage = Boolean(nodeData.imageUrl);
  const currentImagePosition = nodeData.imagePosition || 'top';

  return (
    <div className="note-formatting-bar glass-panel">
      <select
        className="fmt-select"
        value={currentFont}
        onChange={e => onUpdate(nodeId, { font: e.target.value })}
      >
        {FONTS.map(f => (
          <option key={f} value={f}>{f}</option>
        ))}
      </select>

      <div className="fmt-divider" />

      {SIZES.map(s => (
        <button
          key={s.value}
          className={`fmt-btn ${currentSize === s.value ? 'active' : ''}`}
          onClick={() => onUpdate(nodeId, { size: s.value })}
        >
          {s.label}
        </button>
      ))}

      <div className="fmt-divider" />

      {COLORS.map(c => (
        <button
          key={c}
          className="fmt-color-btn"
          style={{
            background: c,
            outline: currentColor === c ? '2px solid var(--color-primary)' : '2px solid transparent',
            outlineOffset: 2,
          }}
          onClick={() => onUpdate(nodeId, { color: c })}
          aria-label={`Renk: ${c}`}
          title={`Renk: ${c}`}
        />
      ))}

      <div className="fmt-divider" />

      <button
        className={`fmt-btn ${currentAlign === 'left' ? 'active' : ''}`}
        onClick={() => onUpdate(nodeId, { align: 'left' })}
        title="Left"
      >
        <AlignIcon align="left" />
      </button>
      <button
        className={`fmt-btn ${currentAlign === 'center' ? 'active' : ''}`}
        onClick={() => onUpdate(nodeId, { align: 'center' })}
        title="Center"
      >
        <AlignIcon align="center" />
      </button>
      <button
        className={`fmt-btn ${currentAlign === 'right' ? 'active' : ''}`}
        onClick={() => onUpdate(nodeId, { align: 'right' })}
        title="Right"
      >
        <AlignIcon align="right" />
      </button>

      <div className="fmt-divider" />

      {OPACITIES.map(o => (
        <button
          key={o.value}
          className={`fmt-btn ${currentOpacity === o.value ? 'active' : ''}`}
          onClick={() => onUpdate(nodeId, { opacity: o.value })}
        >
          {o.label}
        </button>
      ))}

      <div className="fmt-divider" />

      <div ref={searchRef} style={{ position: 'relative' }}>
        <button
          className={`fmt-btn ${showImageSearch ? 'active' : ''}`}
          onClick={() => setShowImageSearch(prev => !prev)}
          title="Add Image"
        >
          🖼️
        </button>
        {showImageSearch && (
          <div className="fmt-image-popover">
            <input
              className="fmt-search-input"
              placeholder="Item ara..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              autoFocus
            />
            <div className="fmt-image-list">
              {filteredItems.length > 0 ? (
                filteredItems.slice(0, 50).map(([name, item]) => (
                  <div
                    key={name}
                    className="fmt-image-item"
                    onClick={() => handleSelectItem(name, item.icon)}
                  >
                    <img src={item.icon} alt={name} className="fmt-image-icon" />
                    <span>{name}</span>
                  </div>
                ))
              ) : (
                <div className="fmt-image-empty">Eşleşen item yok</div>
              )}
            </div>
          </div>
        )}
      </div>

      {hasImage && (
        <>
          {IMAGE_POSITIONS.map(p => (
            <button
              key={p.value}
              className={`fmt-btn ${currentImagePosition === p.value ? 'active' : ''}`}
              onClick={() => onUpdate(nodeId, { imagePosition: p.value })}
              title={p.label}
            >
              {p.label}
            </button>
          ))}
          <button
            className="fmt-btn fmt-btn-danger"
            onClick={() => onUpdate(nodeId, { imageUrl: null })}
            title="Resmi Kaldır"
          >
            ✕
          </button>
        </>
      )}

      <div className="fmt-divider" />

      <button
        className="fmt-btn fmt-btn-delete"
        onClick={() => onDelete(nodeId)}
        title="Notu Sil"
      >
        🗑️
      </button>
    </div>
  );
}
