import { memo, useState, useCallback } from 'react';
import { Handle, Position } from '@xyflow/react';

/**
 * TextNode — Serbest metin düğümü.
 * Çift tıkla düzenleme, font seçimi (Excalifont / Caveat) destekler.
 */
const TextNode = memo(({ id, data, selected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(data.text || 'Metin ekle...');
  const [font, setFont] = useState(data.font || 'Excalifont');

  const handleDoubleClick = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsEditing(false);
    if (data.onChange) data.onChange(id, { text, font });
  }, [id, text, font, data]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') setIsEditing(false);
  }, []);

  const handleFontChange = useCallback((newFont) => {
    setFont(newFont);
    if (data.onChange) data.onChange(id, { text, font: newFont });
  }, [id, text, data]);

  const fontStyles = {
    'Excalifont': 'var(--font-excali)',
    'Caveat': 'var(--font-handwritten)',
  };

  return (
    <div
      className={`text-node-wrapper ${selected ? 'selected' : ''}`}
      onDoubleClick={handleDoubleClick}
      style={{ minWidth: 120 }}
    >
      {/* Font seçici toolbar - seçiliyken görünür */}
      {selected && (
        <div className="text-node-toolbar nodrag">
          {['Excalifont', 'Caveat'].map(f => (
            <button
              key={f}
              className={`text-node-font-btn ${font === f ? 'active' : ''}`}
              onClick={() => handleFontChange(f)}
              style={{ fontFamily: fontStyles[f] }}
            >
              {f === 'Excalifont' ? 'Excali' : 'Caveat'}
            </button>
          ))}
          {data.onDelete && (
            <button
              className="text-node-font-btn"
              onClick={() => data.onDelete(id)}
              style={{ color: 'var(--color-error)', marginLeft: 4 }}
              title="Sil"
            >
              ✕
            </button>
          )}
        </div>
      )}

      {isEditing ? (
        <textarea
          className="text-node-content nodrag"
          value={text}
          onChange={e => setText(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          style={{
            fontFamily: fontStyles[font],
            background: 'transparent',
            border: 'none',
            resize: 'both',
            minWidth: 100,
            minHeight: 40,
            outline: 'none',
            color: 'var(--color-text)',
            fontSize: 18,
            lineHeight: 1.4,
            padding: '8px 12px',
          }}
        />
      ) : (
        <div
          className="text-node-content"
          style={{
            fontFamily: fontStyles[font],
            fontSize: 18,
            cursor: 'text',
            userSelect: 'none',
            color: text === 'Metin ekle...' ? 'var(--color-text-muted)' : 'var(--color-text)',
          }}
        >
          {text}
        </div>
      )}

      {/* Serbest metin için connection handle'ları (isteğe bağlı bağlantı) */}
      <Handle
        type="source"
        position={Position.Right}
        style={{ opacity: selected ? 1 : 0 }}
      />
      <Handle
        type="target"
        position={Position.Left}
        style={{ opacity: selected ? 1 : 0 }}
      />
    </div>
  );
});

TextNode.displayName = 'TextNode';
export default TextNode;
