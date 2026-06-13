import { useState, useMemo, useEffect, useCallback } from 'react';
import { isAlternateRecipe } from '../../engine/recipeEngine';

/**
 * EditProductionModal — Üretim ağacını düzenleme modalı.
 * Modlar:
 *  - 'changeItem': Ürünü değiştir (yeni ürün + hedef miktar)
 *  - 'changeTarget': Hedef üretimi değiştir (sadece hedef miktar)
 *  - 'scaleToCapacity': Kapasiteye göre ölçekle (yeni kapasite miktarı)
 */
export default function EditProductionModal({
  recipes,
  itemsMap,
  mode,
  currentItem,
  currentTargetAmount,
  currentNodeLabel,
  onConfirm,
  onClose,
}) {
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [targetAmount, setTargetAmount] = useState(currentTargetAmount || 1);
  const [capacityInput, setCapacityInput] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const filteredRecipes = useMemo(() => {
    const q = search.toLowerCase();
    const seen = new Set();
    return recipes.filter(r => {
      if (isAlternateRecipe(r)) return false;
      if (r.id.startsWith('unpackage')) return false;
      if (!r.item.toLowerCase().includes(q)) return false;
      if (seen.has(r.item)) return false;
      seen.add(r.item);
      return true;
    });
  }, [recipes, search]);

  const handleConfirm = useCallback(() => {
    if (mode === 'changeItem') {
      if (!selectedItem) return;
      onConfirm({ item: selectedItem.item, targetAmount: Number(targetAmount) });
    } else if (mode === 'changeTarget') {
      onConfirm({ item: currentItem, targetAmount: Number(targetAmount) });
    } else if (mode === 'scaleToCapacity') {
      const newCapacity = Number(capacityInput);
      if (!newCapacity || newCapacity <= 0) return;
      onConfirm({ newCapacity });
    }
    onClose();
  }, [mode, selectedItem, currentItem, targetAmount, capacityInput, onConfirm, onClose]);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  useEffect(() => {
    if (mode !== 'changeItem') return;
    const handler = (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightedIndex(prev => {
          const next = Math.min(prev + 1, filteredRecipes.length - 1);
          if (next >= 0) setSelectedItem(filteredRecipes[next]);
          return next;
        });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightedIndex(prev => {
          const next = Math.max(prev - 1, 0);
          if (next >= 0 && filteredRecipes[next]) setSelectedItem(filteredRecipes[next]);
          return next;
        });
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (selectedItem) handleConfirm();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [mode, filteredRecipes, selectedItem, handleConfirm]);

  useEffect(() => {
    if (highlightedIndex >= 0 && filteredRecipes[highlightedIndex]) {
      const el = document.getElementById(`edit-item-${filteredRecipes[highlightedIndex].id}`);
      if (el) el.scrollIntoView({ block: 'nearest' });
    }
  }, [highlightedIndex, filteredRecipes]);

  const selectedMeta = mode === 'changeItem' && selectedItem
    ? (itemsMap[selectedItem.item] || {})
    : null;

  const title = mode === 'changeItem'
    ? 'Ürünü Değiştir'
    : mode === 'changeTarget'
    ? 'Hedef Üretimi Değiştir'
    : 'Kapasiteye Göre Ölçekle';

  const subtitle = mode === 'changeItem'
    ? 'Yeni ürün ve hedef miktarı seç'
    : mode === 'changeTarget'
    ? `${currentItem} için yeni hedef miktarı gir`
    : `Mevcut ihtiyaç: ${currentNodeLabel || currentItem}`;

  const icon = mode === 'changeItem' ? '🔄' : mode === 'changeTarget' ? '🎯' : '📐';

  const confirmLabel = mode === 'changeItem'
    ? '🔄 Ürünü Değiştir'
    : mode === 'changeTarget'
    ? '🎯 Hedefi Güncelle'
    : '📐 Ölçekle';

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-box">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div
            style={{
              width: 40, height: 40,
              background: 'linear-gradient(135deg, var(--color-primary), #ff6b00)',
              borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20,
            }}
          >
            {icon}
          </div>
          <div>
            <div className="modal-title">{title}</div>
            <div className="modal-subtitle">{subtitle}</div>
          </div>
        </div>

        {/* Ürün Arama (sadece changeItem modunda) */}
        {mode === 'changeItem' && (
          <>
            <div className="form-group">
              <label className="form-label">Yeni Ürün Ara</label>
              <div className="search-wrapper">
                <span className="search-icon">🔍</span>
                <input
                  id="edit-product-search"
                  className="form-input"
                  type="text"
                  placeholder="Smart Plate, Motor, Computer..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  autoFocus
                />
              </div>
            </div>

            <div className="form-group">
              <div className="item-list">
                {filteredRecipes.length === 0 ? (
                  <div style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 13 }}>
                    Ürün bulunamadı
                  </div>
                ) : filteredRecipes.map((recipe, index) => {
                  const meta = itemsMap[recipe.item] || { icon: '📦', category: '' };
                  const isSelected = selectedItem?.item === recipe.item;
                  const isHighlighted = highlightedIndex === index;
                  return (
                    <div
                      key={recipe.id}
                      id={`edit-item-${recipe.id}`}
                      className={`item-list-item ${isSelected ? 'selected' : ''} ${isHighlighted ? 'highlighted' : ''}`}
                      onClick={() => {
                        setSelectedItem(recipe);
                        setHighlightedIndex(index);
                      }}
                    >
                      {meta.icon?.startsWith('/')
                        ? <img className="item-icon" src={meta.icon} alt={recipe.item} />
                        : <span className="item-icon">{meta.icon}</span>}
                      <div style={{ flex: 1 }}>
                        <div className="item-name">{recipe.item}</div>
                        <div className="item-meta">
                          {recipe.machine} · {recipe.output_per_min}/dk
                        </div>
                      </div>
                      {isSelected && (
                        <span style={{ color: 'var(--color-primary)', fontSize: 18 }}>✓</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Hedef Miktar (changeItem ve changeTarget modlarında) */}
        {(mode === 'changeItem' || mode === 'changeTarget') && (
          <div className="form-group" style={{ animation: 'slideUp 200ms ease' }}>
            <label className="form-label" htmlFor="edit-target-amount">
              Hedef Üretim (
                {mode === 'changeItem' && selectedMeta
                  ? <>{selectedMeta.icon?.startsWith('/') ? '' : selectedMeta.icon} {selectedItem?.item}</>
                  : <>{currentItem}</>
                } /dk)
              {mode === 'changeItem' && selectedMeta?.icon?.startsWith('/') &&
                <img src={selectedMeta.icon} alt="" style={{width:18,height:18,verticalAlign:'middle',marginLeft:4}} />
              }
            </label>
            <input
              id="edit-target-amount"
              className="form-input"
              type="number"
              min="0.1"
              step="0.5"
              value={targetAmount}
              onChange={e => setTargetAmount(e.target.value)}
            />
            {mode === 'changeItem' && selectedItem && (
              <div style={{ marginTop: 6, fontSize: 12, color: 'var(--color-text-muted)' }}>
                Standart çıktı: {selectedItem.output_per_min}/dk ·
                Gereken makine: {Math.ceil(targetAmount / selectedItem.output_per_min)}×
              </div>
            )}
          </div>
        )}

        {/* Kapasite Girişi (scaleToCapacity modunda) */}
        {mode === 'scaleToCapacity' && (
          <div className="form-group" style={{ animation: 'slideUp 200ms ease' }}>
            <label className="form-label" htmlFor="capacity-input">
              Yeni Kapasite Miktarı (/dk)
            </label>
            <input
              id="capacity-input"
              className="form-input"
              type="number"
              min="0.1"
              step="0.5"
              placeholder={currentNodeLabel || '0'}
              value={capacityInput}
              onChange={e => setCapacityInput(e.target.value)}
              autoFocus
            />
            <div style={{ marginTop: 6, fontSize: 12, color: 'var(--color-text-muted)' }}>
              Bu değer, ağaçtaki tüm miktarları orantılı olarak ölçeklendirir.
            </div>
          </div>
        )}

        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>İptal</button>
          <button
            className="btn btn-primary"
            onClick={handleConfirm}
            disabled={mode === 'changeItem' ? !selectedItem : mode === 'scaleToCapacity' ? !capacityInput : false}
            style={{
              opacity: (mode === 'changeItem' && !selectedItem) || (mode === 'scaleToCapacity' && !capacityInput) ? 0.5 : 1,
              cursor: 'pointer',
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
