import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import productService from "../services/productService";
import categoryService from "../services/categoryService";
import "./Home.css";

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          productService.getAllProducts(),
          categoryService.getAllCategories(),
        ]);

        // İlk 4 ürünü öne çıkan ürünler olarak göster
        setFeaturedProducts(productsData.slice(0, 4));
        setCategories(categoriesData);
      } catch (err) {
        setError("Veri yüklenirken bir hata oluştu: " + err.message);
        console.error("Veri yükleme hatası:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
            <div className="hero-buttons">
              <Link to="/products" className="btn btn-primary">
                Ürünleri Keşfet
              </Link>
              <Link to="/categories" className="btn btn-secondary">
                Kategorilere Göz At
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="featured-products">
        <div className="container">
          <h2 className="section-title">Öne Çıkan Ürünler</h2>
          {featuredProducts.length > 0 ? (
            <div className="products-grid">
              {featuredProducts.map((product) => (
                <div className="product-card" key={product.productId}>
                  <div className="product-image">
                    <img
                      src={`https://via.placeholder.com/300x200?text=${product.name}`}
                      alt={product.name}
                    />
                  </div>
                  <div className="product-info">
                    <h3 className="product-title">{product.name}</h3>
                    <p className="product-price">
                      ${product.priceUSD.toFixed(2)}
                    </p>
                    <Link
                      to={`/products/${product.productId}`}
                      className="btn btn-primary"
                    >
                      Detaylar
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>Henüz ürün bulunmamaktadır.</p>
          )}
          <div className="view-all">
            <Link to="/products" className="btn btn-secondary">
              Tüm Ürünleri Gör
            </Link>
          </div>
        </div>
      </section>

      <section className="categories-section">
        <div className="container">
          <h2 className="section-title">Kategoriler</h2>
          {categories.length > 0 ? (
            <div className="categories-grid">
              {categories.map((category) => (
                <Link
                  to={`/products?category=${category.categoryId}`}
                  className="category-card"
                  key={category.categoryId}
                >
                  <h3 className="category-title">{category.name}</h3>
                  <p className="category-description">{category.description}</p>
                </Link>
              ))}
            </div>
          ) : (
            <p>Henüz kategori bulunmamaktadır.</p>
          )}
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
