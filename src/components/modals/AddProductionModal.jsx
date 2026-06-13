import { useState, useMemo, useEffect, useCallback } from 'react';
import { isAlternateRecipe } from '../../engine/recipeEngine';

/**
 * AddProductionModal — Üretim hattı ekleme modalı.
 * recipes.json'dan ürün seçimi ve hedef miktar girişi.
 */
export default function AddProductionModal({ recipes, itemsMap, onConfirm, onClose }) {
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [targetAmount, setTargetAmount] = useState(1);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  // Her ürünü tek göster (alternatifler ve unpackage tarifleri hariç)
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

  // Arama sonuçları değişince ilk sonucu pre-select yap
  useEffect(() => {
    if (filteredRecipes.length > 0) {
      setHighlightedIndex(0);
      setSelectedItem(filteredRecipes[0]);
    } else {
      setHighlightedIndex(-1);
      setSelectedItem(null);
    }
  }, [filteredRecipes]);

  const handleConfirm = useCallback(() => {
    if (!selectedItem) return;
    onConfirm({ item: selectedItem.item, targetAmount: Number(targetAmount) });
    onClose();
  }, [selectedItem, targetAmount, onConfirm, onClose]);

  // ESC, ok tuşları ve Enter ile navigation
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightedIndex(prev => {
          if (filteredRecipes.length === 0) return prev;
          const next = Math.min(prev + 1, filteredRecipes.length - 1);
          setSelectedItem(filteredRecipes[next]);
          return next;
        });
        return;
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightedIndex(prev => {
          if (filteredRecipes.length === 0) return prev;
          const next = Math.max(prev - 1, 0);
          setSelectedItem(filteredRecipes[next]);
          return next;
        });
        return;
      }

      if (e.key === 'Enter' && selectedItem) {
        e.preventDefault();
        handleConfirm();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, filteredRecipes, selectedItem, handleConfirm]);

  // Seçili öğeyi görünüme kaydır
  useEffect(() => {
    if (highlightedIndex >= 0 && filteredRecipes[highlightedIndex]) {
      const el = document.getElementById(`item-${filteredRecipes[highlightedIndex].id}`);
      if (el) el.scrollIntoView({ block: 'nearest' });
    }
  }, [highlightedIndex, filteredRecipes]);

  const selectedMeta = selectedItem ? (itemsMap[selectedItem.item] || {}) : null;

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-box">
        {/* Başlık */}
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
            🏭
          </div>
          <div>
            <div className="modal-title">Üretim Hattı Ekle</div>
            <div className="modal-subtitle">Üretmek istediğin ürünü ve hedef miktarı seç</div>
          </div>
        </div>

        {/* Ürün Arama */}
        <div className="form-group">
          <label className="form-label">Ürün Ara</label>
          <div className="search-wrapper">
            <span className="search-icon">🔍</span>
            <input
              id="product-search"
              className="form-input"
              type="text"
              placeholder="Smart Plate, Motor, Computer..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        {/* Ürün Listesi */}
        <div className="form-group">
          <div className="item-list">
            {filteredRecipes.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 13 }}>
                Ürün bulunamadı
              </div>
            ) : filteredRecipes.map((recipe, index) => {
              const meta = itemsMap[recipe.item] || { icon: '📦', category: '' };
              const isSelected = selectedItem?.item === recipe.item;
              return (
                <div
                  key={recipe.id}
                  id={`item-${recipe.id}`}
                  className={`item-list-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedItem(recipe);
                    setHighlightedIndex(index);
                  }}
                >
                  {meta.icon.startsWith('/')
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

        {/* Hedef Miktar */}
        {selectedItem && (
          <div className="form-group" style={{ animation: 'slideUp 200ms ease' }}>
            <label className="form-label" htmlFor="target-amount">
              Hedef Üretim ({selectedMeta?.icon?.startsWith('/')
                ? '' : selectedMeta?.icon} {selectedItem.item} /dk)
              {selectedMeta?.icon?.startsWith('/') &&
                <img src={selectedMeta.icon} alt="" style={{width:18,height:18,verticalAlign:'middle',marginLeft:4}} />
              }
            </label>
            <input
              id="target-amount"
              className="form-input"
              type="number"
              min="0.1"
              step="0.5"
              value={targetAmount}
              onChange={e => setTargetAmount(e.target.value)}
            />
            <div style={{ marginTop: 6, fontSize: 12, color: 'var(--color-text-muted)' }}>
              Standart çıktı: {selectedItem.output_per_min}/dk · 
              Gereken makine: {Math.ceil(targetAmount / selectedItem.output_per_min)}×
            </div>
          </div>
        )}

        {/* Eylem butonları */}
        <div className="modal-actions">
          <button id="modal-cancel" className="btn btn-ghost" onClick={onClose}>İptal</button>
          <button
            id="modal-confirm"
            className="btn btn-primary"
            onClick={handleConfirm}
            disabled={!selectedItem}
            style={{ opacity: selectedItem ? 1 : 0.5, cursor: selectedItem ? 'pointer' : 'not-allowed' }}
          >
            🏗️ Üretim Hattı Oluştur
          </button>
        </div>
      </div>
    </div>
  );
}
