# SANEL SOLAR Web Uygulaması

Bu proje, SANEL SOLAR için geliştirilmiş bir web uygulamasıdır. Güneş enerjisi ürünleri ve hizmetleri sunan bir şirket için ön yüz (frontend) uygulamasıdır.

## Teknolojiler

- React 18
- React Router 6
- Vite
- Axios
- CSS (Vanilla CSS)

## Kurulum

Projeyi yerel ortamınızda çalıştırmak için aşağıdaki adımları izleyin:

```bash
# Projeyi klonlayın
git clone <repo-url>

# Proje dizinine gidin
cd SANELSOLAR.Web

# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev
```

## Kullanım

Uygulama varsayılan olarak `http://localhost:3000` adresinde çalışacaktır. API istekleri için `http://localhost:5000` adresindeki backend'e proxy yapılandırması bulunmaktadır.

## Özellikler

- Kullanıcı kimlik doğrulama (giriş, kayıt, profil yönetimi)
- Ürün listeleme ve detay görüntüleme
- Kategori bazlı ürün filtreleme
- Responsive tasarım

## Proje Yapısı

```
SANELSOLAR.Web/
├── public/             # Statik dosyalar
├── src/                # Kaynak kodları
│   ├── assets/         # Resimler, fontlar vb.
│   ├── components/     # Yeniden kullanılabilir bileşenler
│   ├── context/        # React context'leri
│   ├── pages/          # Sayfa bileşenleri
│   ├── services/       # API servisleri
│   ├── App.jsx         # Ana uygulama bileşeni
│   ├── App.css         # Ana uygulama stilleri
│   ├── index.css       # Global stiller
│   └── main.jsx        # Uygulama giriş noktası
├── index.html          # HTML şablonu
├── package.json        # Proje bağımlılıkları
└── vite.config.js      # Vite yapılandırması
```

## Lisans

Bu proje özel lisans altında dağıtılmaktadır.
