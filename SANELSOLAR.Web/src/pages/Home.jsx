import { useState } from "react";
import "./Home.css";

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (loading) {
    return <div className="loading">Yükleniyor...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="home-page">
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Güneş Enerjisi Çözümleri</h1>
            <p className="hero-description">
              SANEL SOLAR ile sürdürülebilir enerji çözümleriyle tanışın. Güneş
              enerjisi sistemleri ve ekipmanları için doğru adres.
            </p>
          </div>
        </div>
      </section>

      <section className="about-section">
        <div className="container">
          <div className="about-content">
            <h2 className="section-title">SANEL SOLAR Hakkında</h2>
            <p>
              SANEL SOLAR, güneş enerjisi sistemleri ve ekipmanları konusunda
              uzmanlaşmış bir şirkettir. Sürdürülebilir enerji çözümleri
              sunarak, müşterilerimizin enerji ihtiyaçlarını karşılamak ve
              çevreye duyarlı bir gelecek için çalışıyoruz.
            </p>
            <p>
              Yüksek kaliteli ürünler, profesyonel hizmet ve müşteri memnuniyeti
              odaklı yaklaşımımızla sektörde fark yaratıyoruz.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
