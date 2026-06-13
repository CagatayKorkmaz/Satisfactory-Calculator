import { memo, useState, useCallback, useRef, useEffect } from 'react';

const SIZE_MAP = { S: 14, M: 18, L: 24, XL: 32 };

const TextNode = memo(({ id, data, selected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(data.text || 'Metin ekle...');
  const editRef = useRef(null);
  const editAtRef = useRef(0);

  useEffect(() => {
    if (data._editing && data._editAt > editAtRef.current) {
      editAtRef.current = data._editAt;
      setIsEditing(true);
    }
  }, [data._editing, data._editAt]);

  useEffect(() => {
    if (isEditing && editRef.current) {
      editRef.current.innerText = text;
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(editRef.current);
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }, [isEditing, text]);

  const commitText = useCallback(() => {
    if (data.onChange) data.onChange(id, { text, font: data.font, size: data.size, color: data.color, align: data.align, opacity: data.opacity, imageUrl: data.imageUrl, imagePosition: data.imagePosition, _editing: false });
  }, [id, text, data]);

  const handleInput = useCallback((e) => {
    setText(e.currentTarget.innerText);
  }, []);

  const handleBlur = useCallback(() => {
    setIsEditing(false);
    commitText();
  }, [commitText]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      setIsEditing(false);
      commitText();
    }
  }, [commitText]);

  const fontStyles = {
    'Excalifont': 'var(--font-excali)',
    'Lazy Dog': 'var(--font-lazy)',
    'Sans-serif': 'var(--font-ui)',
  };

  const fontSize = SIZE_MAP[data.size] || SIZE_MAP.M;
  const textColor = data.color || '#e2e8f0';
  const textAlign = data.align || 'left';
  const opacity = data.opacity ?? 1;
  const imageUrl = data.imageUrl || null;
  const imagePosition = data.imagePosition || 'top';

  const hasImage = Boolean(imageUrl);
  const defaultText = 'Metin ekle...';
  const isEmpty = !isEditing && text === defaultText;

  const sharedStyle = {
    fontFamily: fontStyles[data.font] || 'var(--font-excali)',
    fontSize,
    color: textColor,
    textAlign,
    lineHeight: 1.4,
    padding: '8px 12px',
  };

  const renderContent = () => {
    const textEl = isEditing ? (
      <div
        ref={editRef}
        className="nodrag"
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        style={{
          ...sharedStyle,
          outline: 'none',
          minWidth: 100,
          minHeight: 40,
          wordBreak: 'break-word',
          whiteSpace: 'pre-wrap',
          cursor: 'text',
        }}
      />
    ) : (
      <div
        className="text-node-content"
        style={{
          ...sharedStyle,
          cursor: 'text',
          userSelect: 'none',
          opacity,
          color: isEmpty ? 'var(--color-text-muted)' : textColor,
        }}
      >
        {text}
      </div>
    );

    if (!hasImage) return textEl;

    const imgEl = (
      <img
        src={imageUrl}
        alt=""
        className="nodrag"
        style={{
          width: 48,
          height: 48,
          objectFit: 'contain',
          opacity,
          flexShrink: 0,
        }}
      />
    );

    const containerStyle = {
      display: 'flex',
      gap: 4,
      opacity,
    };

    if (imagePosition === 'top') {
      return (
        <div style={{ ...containerStyle, flexDirection: 'column', alignItems: 'center' }}>
          {imgEl}
          {textEl}
        </div>
      );
    }
    if (imagePosition === 'left') {
      return (
        <div style={{ ...containerStyle, flexDirection: 'row', alignItems: 'flex-start' }}>
          {imgEl}
          <div style={{ flex: 1, minWidth: 0 }}>{textEl}</div>
        </div>
      );
    }
    if (imagePosition === 'right') {
      return (
        <div style={{ ...containerStyle, flexDirection: 'row-reverse', alignItems: 'flex-start' }}>
          {imgEl}
          <div style={{ flex: 1, minWidth: 0 }}>{textEl}</div>
        </div>
      );
    }
    return textEl;
  };

  return (
    <div
      className={`text-node-wrapper ${selected ? 'selected' : ''}`}
    >
      {renderContent()}
    </div>
  );
});

TextNode.displayName = 'TextNode';
export default TextNode;
