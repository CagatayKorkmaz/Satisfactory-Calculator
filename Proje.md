# Proje: Satisfactory Dinamik Planlama & Sonsuz Tuval Not Defteri

## 1. Proje Özeti
Bu proje, Satisfactory oyuncularının üretim hatlarını optimize etmesini sağlayan, Excalidraw benzeri bir sonsuz tuval (infinite canvas) üzerine kurulu, dinamik formül tabanlı bir planlama web uygulamasıdır. Klasik hesaplayıcılardan farkı; kullanıcının ara ürünler için elindeki mevcut üretim kapasitesini (Örn: "Elimde zaten 240 Iron var") girdi olarak verebilmesi ve alt kırılımların bu değere göre dinamik olarak kendini yeniden hesaplamasıdır.

## 2. Temel Teknolojiler & Görsel Tasarım
* **Framework:** React (Vite tabanlı)
* **CSS:** Tailwind CSS
* **Database & Auth:** Firebase (SQL'siz esnek DB yapısı için Firestore)
* **Yazı Tipleri:** Excalifont & Lazy Dog Font (El yazısı/taslak estetiği için)
* **Grafik / Çizim Altyapısı:** Canvas API veya `@excalidraw/excalidraw` (Wrapper/Özelleştirilmiş entegrasyon) ya da `reactflow` (Üretim hatlarını kutular arası oklarla bağlamak ve taşımak için özelleştirilmiş canvas).

## 3. Detaylı İstekler & Fonksiyonel Özellikler

### A. Excalidraw Tarzı Not Alma ve Görsel Alanı
* Kullanıcı tuval üzerinde serbestçe gezinebilecek, sürükle-bırak (pan/zoom) yapabilecek.
* Yazı ekleme aracında `Excalifont` veya `Lazy Dog` fontları seçilebilecek.
* Yazı kutuları ve elementler serbestçe taşınabilecek.
* Oyun içi itemlerin ikonları (`Iron Ingot`, `Smart Plate` vb.) tuvale sürüklenip eklenebilecek, üzerlerine not alınabilecek.

### B. Dinamik Üretim Hattı ve Geri Beslemeli Hesaplama Motoru (Core Feature)
* **Aşama 1 (Standart Ağaç Çıkarımı):** Kullanıcı "Yeni Product Ekle" butonuna basıp listeden bir ürün (Örn: `Smart Plate`) seçecek ve hedef miktar girecek (Örn: `2/dk`). Sistem, yerel JSON veritabanından tarif ağacını çıkaracak (2 Smart Plate -> 46.5 Iron Ingot vb.).
* **Aşama 2 (Dinamik Girdi Override):** Hesaplanan ağaç yapısında her düğümün (node) yanında bir "Elimdeki Miktar" girdisi olacak. Kullanıcı Iron Ingot düğümüne `240` yazdığı anda, hesaplama motoru alt kırılımları (Iron Ore, Miner vb.) bu `240` değerini baz alarak güncelleyecek. Eksik veya fazla hammadde durumları görsel olarak renk kodlarıyla (Yeşil/Kırmızı) belirtilecek.

---

## 4. Geliştirme Yol Haritası (Aşama Aşama)

### Milestones Overview

### Aşama 1: Veri Katmanının Kurulması & Mock Data
* Satisfactory güncel oyun verilerini içeren JSON dosyasını ve ürün ikon setlerini projenin `public/data/` dizinine entegre et.
* Basit bir arama fonksiyonu yaz: Ürün adına göre tarif (`recipes`) ve bileşen (`ingredients`) bilgilerini dönsün.

### Aşama 2: Sonsuz Tuval (Canvas) ve Font Kurulumları
* `Excalifont` ve `Lazy Dog` fontlarını `@font-face` ile CSS'e dahil et.
* İster ham HTML5 Canvas / SVG kullanarak, ister `reactflow` altyapısı üzerine custom düğümler yazarak temel taşınabilir kutu mimarisini oluştur.
* Tuvale metin ekleme, taşıma ve oyun içi resimleri/ikonları render etme yeteneğini kazandır.

### Aşama 3: Dinamik Matematik Motorunun Kodlanması
* Yönlü Döngüsüz Grafik (DAG - Directed Acyclic Graph) algoritması kur. Bir ürün seçildiğinde alt bileşenleri recursive (özyinelemeli) olarak hesaplayan bir fonksiyon yaz.
* Her node için bir `overrideValue` state'i tanımla. Eğer bu state boş değilse, alt kollara giden formül çarpanını standart formül yerine `target - overrideValue` üzerinden yeniden dağıt.

### Aşama 4: Firebase Entegrasyonu ve Bulut Kaydı
* Kullanıcının oluşturduğu panoları (Canvas üzerindeki node koordinatları, metinler, override değerleri) JSON formatında Firestore'a kaydet.
* Kişisel kullanım için basit bir pano listeleme (Dashboard) ekranı hazırla.

---

## 5. Örnek Veri Modeli Taslağı (Firestore Pano Kaydı İçin)

```json
{
  "boardId": "user-satisfactory-board-001",
  "boardName": "Phase 2 - Smart Plate Fabrikası",
  "createdAt": "2026-06-12",
  "elements": [
    {
      "id": "text-1",
      "type": "text",
      "x": 120,
      "y": 80,
      "content": "Buraya demir madeninden gelen hat bağlanacak.",
      "font": "LazyDog"
    },
    {
      "id": "factory-node-1",
      "type": "production-tree",
      "x": 300,
      "y": 200,
      "targetItem": "Desc_SpaceElevatorPart_01_C", // Smart Plate
      "targetQuantityPerMin": 2,
      "overrides": {
        "Desc_IronIngot_C": 240
      }
    }
  ]
}