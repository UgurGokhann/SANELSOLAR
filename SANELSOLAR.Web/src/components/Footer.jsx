import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-section">
          <h3 className="footer-title">SANEL SOLAR</h3>
          <p className="footer-description">
            Güneş enerjisi çözümleri ile sürdürülebilir bir gelecek için
            yanınızdayız.
          </p>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Hızlı Bağlantılar</h3>
          <ul className="footer-links">
            <li>
              <Link to="/">Ana Sayfa</Link>
            </li>
            <li>
              <Link to="/products">Ürünler</Link>
            </li>
            <li>
              <Link to="/categories">Kategoriler</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">İletişim</h3>
          <ul className="footer-contact">
            <li>
              <i className="footer-icon">📍</i> Ankara, Türkiye
            </li>
            <li>
              <i className="footer-icon">📧</i> info@sanelsolar.com
            </li>
            <li>
              <i className="footer-icon">📞</i> +90 (312) 123 4567
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p className="footer-copyright">
            &copy; {currentYear} SANEL SOLAR. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
