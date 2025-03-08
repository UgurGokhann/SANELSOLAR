import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import productService from "../services/productService";
import categoryService from "../services/categoryService";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const productData = await productService.getProductById(id);
        setProduct(productData);

        // Ürünün kategorilerini getir
        if (productData.categoryIds && productData.categoryIds.length > 0) {
          const categoriesData = await categoryService.getAllCategories();
          const productCategories = categoriesData.filter((category) =>
            productData.categoryIds.includes(category.categoryId)
          );
          setCategories(productCategories);
        }
      } catch (err) {
        setError("Ürün bilgileri yüklenirken bir hata oluştu: " + err.message);
        console.error("Ürün yükleme hatası:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <div className="loading">Yükleniyor...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!product) {
    return <div className="error-message">Ürün bulunamadı.</div>;
  }

  return (
    <div className="container">
      <div className="card" style={{ padding: "2rem", marginTop: "2rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          <div>
            <Link
              to="/products"
              className="btn btn-secondary"
              style={{ marginBottom: "1rem" }}
            >
              &larr; Ürünlere Dön
            </Link>
            <h1>{product.name}</h1>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem" }}>
            <div style={{ flex: "1", minWidth: "300px" }}>
              <img
                src={`https://via.placeholder.com/600x400?text=${product.name}`}
                alt={product.name}
                style={{ width: "100%", borderRadius: "0.5rem" }}
              />
            </div>

            <div style={{ flex: "1", minWidth: "300px" }}>
              <h2
                style={{ color: "var(--primary-color)", marginBottom: "1rem" }}
              >
                ${product.priceUSD.toFixed(2)}
              </h2>

              <div style={{ marginBottom: "1.5rem" }}>
                <h3>Ürün Bilgileri</h3>
                <div style={{ marginTop: "0.5rem" }}>
                  <p><strong>Marka:</strong> {product.brand}</p>
                  <p><strong>Miktar:</strong> {product.quantity} {product.unit}</p>
                </div>
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <h3>Açıklama</h3>
                <p>{product.description}</p>
              </div>

              {categories.length > 0 && (
                <div style={{ marginBottom: "1.5rem" }}>
                  <h3>Kategoriler</h3>
                  <div
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                      flexWrap: "wrap",
                      marginTop: "0.5rem",
                    }}
                  >
                    {categories.map((category) => (
                      <Link
                        key={category.categoryId}
                        to={`/products?category=${category.categoryId}`}
                        className="btn btn-secondary"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <button className="btn btn-primary" style={{ marginTop: "1rem" }}>
                İletişime Geç
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
