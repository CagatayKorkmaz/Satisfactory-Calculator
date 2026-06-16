import { useEffect } from 'react';

const ALTERNATIVE_SITES = [
  {
    name: 'Satisfactory Wiki',
    url: 'https://satisfactory.fandom.com/',
    icon: '📖',
    description: 'Oyunun resmi wiki sayfası',
  },
  {
    name: 'Satisfactory Calculator',
    url: 'https://satisfactory-calculator.com/',
    icon: '🧮',
    description: 'Popüler üretim planlayıcı',
  },
  {
    name: 'Satisfactory Tools',
    url: 'https://www.satisfactorytools.com/1.0/production',
    icon: '🔧',
    description: 'Gelişmiş üretim aracı',
  },
];

export default function AboutModal({ onClose }) {
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="about-modal-box">
        {/* Header */}
        <div className="about-header">
          <div className="about-logo-icon">⚙️</div>
          <div>
            <div className="about-title">Satisfactory Planlama</div>
            <div className="about-version">v1.2</div>
          </div>
          <button className="about-close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Sections */}
        <div className="about-content">
          {/* Proje Hakkında */}
          <div className="about-section">
            <div className="about-section-title">
              <span className="about-section-icon">📋</span>
              Proje Hakkında
            </div>
            <div className="about-text">
              Satisfactory Planner, Satisfactory oyuncularının üretim hatlarını planlamasını ve optimize etmesini sağlayan,sonsuz tuval üzerine kurulu bir web uygulamasıdır.
            </div>
            <div className="about-features">
              <div className="about-feature">
                <span className="about-feature-icon">🔄</span>
                <div>
                  <strong>Dinamik Üretim Ağacı</strong>
                  <span>Hedef ürün ve miktar seçin, tüm üretim ağacı otomatik oluşur.</span>
                </div>
              </div>
              <div className="about-feature">
                <span className="about-feature-icon">🔀</span>
                <div>
                  <strong>Alternatif Tarifler</strong>
                  <span>Standart ve alternatif tarifler arasında geçiş yapın.</span>
                </div>
              </div>
              <div className="about-feature">
                <span className="about-feature-icon">📦</span>
                <div>
                  <strong>Kapasite Override</strong>
                  <span>Mevcut üretim kapasitenizi girin, alt kırılımlar buna göre yeniden hesaplanır.</span>
                </div>
              </div>
              <div className="about-feature">
                <span className="about-feature-icon">📝</span>
                <div>
                  <strong>Not Defteri</strong>
                  <span>Tuval üzerine formatlı notlar ve görseller ekleyin.</span>
                </div>
              </div>
              <div className="about-feature">
                <span className="about-feature-icon">💾</span>
                <div>
                  <strong>Otomatik Kayıt</strong>
                  <span>Çalışmanız tarayıcı otomatik olarak kaydedilir.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Önemli Bilgilendirme */}
          <div className="about-section about-warning-section">
            <div className="about-section-title">
              <span className="about-section-icon">⚠️</span>
              Önemli Bilgilendirme
            </div>
            <div className="about-warning-text">
              Bazı tarifler ve alternatif tarifler eksik/hatalı olabilir. Hesaplamalarda yan ürün dahil edilmemektedir.
            </div>
          </div>

          {/* Son Güncelleme */}
          <div className="about-section">
            <div className="about-section-title">
              <span className="about-section-icon">🆕</span>
              Son Güncelleme
            </div>
            <div className="about-changelog">
              <div className="about-changelog-version">v1.2</div>
              <div className="about-changelog-text">
                <strong>Space Arama Çubuğu</strong> — Space tuşu ile açılan arama barı eklendi. Item ismiyle arama yapabilir, sonuçları klavye ile gezinebilirsiniz.<br /><br />
                <strong>Matematik İşlem Desteği</strong> — Arama barında 150-50, 240/3 gibi işlemler yapabilir, sonucu not olarak ekleyebilirsiniz.<br /><br />
                <strong>Üretim Hattı Kısayolu</strong> — Arama barından doğrudan üretim hattı oluşturabilir, hedef miktarı belirleyebilirsiniz.<br /><br />
                <strong>Hızlı Eylemler</strong> — Item seçiminde Üretim Hattı Oluştur, Not Olarak Ekle ve Wiki'de Göster seçenekleri sunulur.
              </div>
            </div>
          </div>

          {/* Alternatif Siteler */}
          <div className="about-section">
            <div className="about-section-title">
              <span className="about-section-icon">🔗</span>
              Alternatif Siteler
            </div>
            <div className="about-links">
              {ALTERNATIVE_SITES.map((site) => (
                <a
                  key={site.url}
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="about-link-card"
                >
                  <span className="about-link-icon">{site.icon}</span>
                  <div className="about-link-info">
                    <div className="about-link-name">{site.name}</div>
                    <div className="about-link-desc">{site.description}</div>
                  </div>
                  <span className="about-link-arrow">↗</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
