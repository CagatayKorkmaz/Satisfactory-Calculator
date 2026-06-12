import { useState, useEffect } from 'react';
import SatisfactoryCanvas from './components/canvas/SatisfactoryCanvas';

export default function App() {
  const [recipesData, setRecipesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/data/recipes.json')
      .then(res => {
        if (!res.ok) throw new Error('recipes.json yüklenemedi');
        return res.json();
      })
      .then(data => {
        setRecipesData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{
        width: '100vw', height: '100vh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'var(--color-bg)',
        gap: 16,
      }}>
        <div style={{
          width: 60, height: 60,
          background: 'linear-gradient(135deg, #f0a500, #ff6b00)',
          borderRadius: 16,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 32,
          animation: 'spin-slow 2s linear infinite',
        }}>
          ⚙️
        </div>
        <div style={{ color: 'var(--color-text-dim)', fontSize: 15 }}>
          Satisfactory verileri yükleniyor...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        width: '100vw', height: '100vh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'var(--color-bg)',
        gap: 12,
      }}>
        <div style={{ fontSize: 48 }}>⚠️</div>
        <div style={{ color: 'var(--color-error)', fontSize: 16 }}>Hata: {error}</div>
      </div>
    );
  }

  return <SatisfactoryCanvas recipesData={recipesData} />;
}
