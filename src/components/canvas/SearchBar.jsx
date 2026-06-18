import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { getAllProducibleItems, RAW_RESOURCES } from '../../engine/recipeEngine';

function tryEvaluateMath(expr) {
  const cleaned = expr.replace(/\s/g, '');
  if (!/^[0-9+\-*/().]+$/.test(cleaned)) return null;
  if (!/[+\-*/]/.test(cleaned)) return null;
  try {
    const result = Function(`"use strict"; return (${cleaned})`)();
    if (typeof result === 'number' && isFinite(result) && !isNaN(result)) {
      return Math.round(result * 100) / 100;
    }
    return null;
  } catch {
    return null;
  }
}

export default function SearchBar({
  isOpen,
  onClose,
  recipes,
  itemsMap,
  onAddProduction,
  onAddNoteWithImage,
}) {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [targetAmount, setTargetAmount] = useState(1);
  const [showAmountInput, setShowAmountInput] = useState(false);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const allItems = useMemo(() => {
    return getAllProducibleItems(recipes);
  }, [recipes]);

  const mathResult = useMemo(() => {
    if (!search) return null;
    return tryEvaluateMath(search);
  }, [search]);

  const filteredItems = useMemo(() => {
    if (!search) return [];
    const q = search.toLowerCase();
    return allItems
      .filter(r => r.item.toLowerCase().includes(q) && !RAW_RESOURCES.includes(r.item))
      .slice(0, 20);
  }, [allItems, search]);

  const showMath = mathResult !== null;
  const totalResults = showMath ? filteredItems.length + 1 : filteredItems.length;

  const selectedItem = useMemo(() => {
    if (showAmountInput) {
      if (showMath && selectedIndex === 0) return null;
      const itemIndex = showMath ? selectedIndex - 1 : selectedIndex;
      return filteredItems[itemIndex] || null;
    }
    if (showMath && selectedIndex === 0) return null;
    const itemIndex = showMath ? selectedIndex - 1 : selectedIndex;
    return filteredItems[itemIndex] || null;
  }, [filteredItems, selectedIndex, showAmountInput, showMath]);

  const isMathSelected = showMath && selectedIndex === 0;

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      setSearch('');
      setShowAmountInput(false);
      setSelectedIndex(0);
      setTargetAmount(1);
    }
  }, [isOpen]);

  const handleSelectItem = useCallback((item, index) => {
    setSelectedIndex(index);
    setShowAmountInput(true);
    setTargetAmount(1);
  }, []);

  const handleSelectMath = useCallback(() => {
    onAddNoteWithImage({
      text: `${search} = ${mathResult}`,
    });
    onClose();
  }, [search, mathResult, onAddNoteWithImage, onClose]);

  const handleCreateProduction = useCallback(() => {
    if (!selectedItem) return;
    onAddProduction({ item: selectedItem.item, targetAmount: Number(targetAmount) });
    onClose();
  }, [selectedItem, targetAmount, onAddProduction, onClose]);

  const handleAddAsNote = useCallback(() => {
    if (!selectedItem) return;
    const meta = itemsMap[selectedItem.item] || { icon: '📦', name: selectedItem.item };
    onAddNoteWithImage({
      imageUrl: meta.icon,
      text: `${selectedItem.item}`,
    });
    onClose();
  }, [selectedItem, itemsMap, onAddNoteWithImage, onClose]);

  const handleShowWiki = useCallback(() => {
    if (!selectedItem) return;
    const wikiName = selectedItem.item.replace(/ /g, '_').replace(/™/g, '');
    window.open(`https://satisfactory.wiki.gg/wiki/${encodeURIComponent(wikiName)}`, '_blank');
  }, [selectedItem]);

  useEffect(() => {
    if (!isOpen) return;

    const handler = (e) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, totalResults - 1));
        return;
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
        return;
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        if (showAmountInput && selectedItem) {
          handleCreateProduction();
        } else if (isMathSelected) {
          handleSelectMath();
        } else if (selectedItem) {
          setShowAmountInput(true);
        }
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose, totalResults, selectedItem, showAmountInput, isMathSelected, handleCreateProduction, handleSelectMath]);

  useEffect(() => {
    if (selectedIndex >= 0) {
      const el = document.getElementById(`search-item-${selectedIndex}`);
      if (el) el.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  useEffect(() => {
    if (showAmountInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showAmountInput]);

  if (!isOpen) return null;

  const selectedMeta = selectedItem ? (itemsMap[selectedItem.item] || {}) : null;

  return (
    <div className="searchbar-overlay" onClick={onClose}>
      <div className="searchbar-panel glass-panel" onClick={e => e.stopPropagation()}>
        <div className="searchbar-header">
          {!showAmountInput ? (
            <>
              <span className="searchbar-icon">🔍</span>
              <input
                ref={inputRef}
                className="searchbar-input"
                type="text"
                placeholder="Eşya ara veya işlem yap"
                value={search}
                onChange={e => { setSearch(e.target.value); setSelectedIndex(0); }}
                autoFocus
              />
            </>
          ) : (
            <>
              <div className="searchbar-selected-info">
                {selectedMeta?.icon?.startsWith('/')
                  ? <img src={selectedMeta.icon} alt="" className="searchbar-selected-icon" />
                  : <span className="searchbar-selected-emoji">{selectedMeta?.icon || '📦'}</span>
                }
                <div className="searchbar-selected-text">
                  <span className="searchbar-selected-name">{selectedItem?.item}</span>
                  <span className="searchbar-selected-meta">Standart çıktı: {selectedItem?.output_per_min}/dk</span>
                </div>
              </div>
              <input
                ref={inputRef}
                className="searchbar-amount-input"
                type="number"
                min="0.1"
                step="0.5"
                value={targetAmount}
                onChange={e => setTargetAmount(e.target.value)}
                placeholder="Miktar"
                autoFocus
              />
              <span className="searchbar-amount-unit">/dk</span>
            </>
          )}
        </div>

        {!showAmountInput && (showMath || filteredItems.length > 0) && (
          <div className="searchbar-list" ref={listRef}>
            {showMath && (
              <div
                id="search-item-0"
                className={`searchbar-item searchbar-item-math ${isMathSelected ? 'selected' : ''}`}
                onClick={handleSelectMath}
              >
                <span className="searchbar-item-icon">=</span>
                <div className="searchbar-item-info">
                  <span className="searchbar-item-name">{search} = <strong>{mathResult}</strong></span>
                  <span className="searchbar-item-meta">Enter ile not olarak ekle</span>
                </div>
              </div>
            )}
            {filteredItems.map((item, index) => {
              const meta = itemsMap[item.item] || { icon: '📦', category: '' };
              const realIndex = showMath ? index + 1 : index;
              const isSelected = selectedIndex === realIndex;
              return (
                <div
                  key={item.id}
                  id={`search-item-${realIndex}`}
                  className={`searchbar-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleSelectItem(item, realIndex)}
                >
                  {meta.icon?.startsWith('/')
                    ? <img src={meta.icon} alt="" className="searchbar-item-icon" />
                    : <span className="searchbar-item-icon">{meta.icon}</span>
                  }
                  <div className="searchbar-item-info">
                    <span className="searchbar-item-name">{item.item}</span>
                    <span className="searchbar-item-meta">{item.machine} · {item.output_per_min}/dk</span>
                  </div>
                  <span className="searchbar-item-category" data-category={meta.category}>{meta.category}</span>
                </div>
              );
            })}
          </div>
        )}

        {!showAmountInput && search && totalResults === 0 && (
          <div className="searchbar-empty">Sonuç bulunamadı</div>
        )}

        {showAmountInput && (
          <div className="searchbar-actions">
            <button className="searchbar-action-btn primary" onClick={handleCreateProduction}>
              <span className="searchbar-action-icon">🏭</span>
              <div className="searchbar-action-text">
                <span className="searchbar-action-label">Üretim Hattı Oluştur</span>
                <span className="searchbar-action-desc">{targetAmount}/dk üretimi başlat</span>
              </div>
            </button>
            <button className="searchbar-action-btn" onClick={handleAddAsNote}>
              <span className="searchbar-action-icon">📝</span>
              <div className="searchbar-action-text">
                <span className="searchbar-action-label">Not Olarak Ekle</span>
                <span className="searchbar-action-desc">Item image'lı not oluştur</span>
              </div>
            </button>
            <button className="searchbar-action-btn" onClick={handleShowWiki}>
              <span className="searchbar-action-icon">🌐</span>
              <div className="searchbar-action-text">
                <span className="searchbar-action-label">Wiki'de Göster</span>
                <span className="searchbar-action-desc">Fandom wiki'de aç</span>
              </div>
            </button>
            <button className="searchbar-action-btn back" onClick={() => { setShowAmountInput(false); setSelectedIndex(0); }}>
              <span className="searchbar-action-icon">←</span>
              <div className="searchbar-action-text">
                <span className="searchbar-action-label">Geri</span>
                <span className="searchbar-action-desc">Listeye dön</span>
              </div>
            </button>
          </div>
        )}

        <div className="searchbar-hint">
          {showAmountInput
            ? 'Enter ile oluştur · Escape ile kapat'
            : '↑↓ ile gezin · Enter ile seçin · Escape ile kapatın'
          }
        </div>
      </div>
    </div>
  );
}
