import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import productService from "../services/productService";
import categoryService from "../services/categoryService";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import "./Home.css"; // Aynı stil dosyasını kullanıyoruz

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryId = searchParams.get("category");
  const { isAuthenticated, user } = useAuth();

  // Ürün ekleme formu için state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    priceUSD: "",
    categoryIds: [],
  });
  const [formErrors, setFormErrors] = useState({});
  const [formSuccess, setFormSuccess] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoriesData] = await Promise.all([
          categoryService.getAllCategories(),
        ]);

        setCategories(categoriesData);

        // Kategori ID'si varsa, o kategoriye ait ürünleri getir
        if (categoryId) {
          const productsData = await productService.getProductsByCategory(
            categoryId
          );
          setProducts(productsData);
        } else {
          // Yoksa tüm ürünleri getir
          const productsData = await productService.getAllProducts();
          setProducts(productsData);
        }
      } catch (err) {
        setError("Veri yüklenirken bir hata oluştu: " + err.message);
        console.error("Veri yükleme hatası:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryId]);

  const handleCategoryFilter = (id) => {
    if (id) {
      setSearchParams({ category: id });
    } else {
      setSearchParams({});
    }
  };

  // Yeni ürün form değişikliklerini işle
  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });

    // Hata mesajını temizle
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: "" });
    }
  };

  // Kategori seçimlerini işle
  const handleCategorySelect = (categoryId) => {
    const updatedCategoryIds = [...newProduct.categoryIds];

    if (updatedCategoryIds.includes(categoryId)) {
      // Kategori zaten seçiliyse, kaldır
      const index = updatedCategoryIds.indexOf(categoryId);
      updatedCategoryIds.splice(index, 1);
    } else {
      // Kategori seçili değilse, ekle
      updatedCategoryIds.push(categoryId);
    }

    setNewProduct({ ...newProduct, categoryIds: updatedCategoryIds });
  };

  // Form doğrulama
  const validateProductForm = () => {
    const errors = {};

    if (!newProduct.name.trim()) {
      errors.name = "Ürün adı gereklidir";
    }

    if (!newProduct.description.trim()) {
      errors.description = "Ürün açıklaması gereklidir";
    }

    if (
      !newProduct.priceUSD ||
      isNaN(newProduct.priceUSD) ||
      parseFloat(newProduct.priceUSD) <= 0
    ) {
      errors.priceUSD = "Geçerli bir fiyat giriniz";
    }

    if (newProduct.categoryIds.length === 0) {
      errors.categoryIds = "En az bir kategori seçmelisiniz";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Ürün ekleme formunu gönder
  const handleSubmitProduct = async (e) => {
    e.preventDefault();

    if (!validateProductForm()) {
      // Form doğrulama hatalarını toast ile göster
      Object.values(formErrors).forEach((error) => {
        if (error) toast.error(error);
      });
      return;
    }

    try {
      // Fiyatı sayıya dönüştür
      const productData = {
        ...newProduct,
        priceUSD: parseFloat(newProduct.priceUSD),
      };

      const createdProduct = await productService.createProduct(productData);

      // Ürün listesini güncelle
      setProducts([...products, createdProduct]);

      // Formu temizle
      setNewProduct({
        name: "",
        description: "",
        priceUSD: "",
        categoryIds: [],
      });

      // Başarı mesajını toast ile göster
      toast.success("Ürün başarıyla eklendi");

      // Form başarıyla gönderildikten sonra formu kapat
      setShowAddForm(false);
    } catch (err) {
      // Hata mesajını toast ile göster
      toast.error(err.message || "Ürün eklenirken bir hata oluştu");
    }
  };

  if (loading) {
    return <div className="loading">Yükleniyor...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="container">
      <h1 className="section-title">Ürünler</h1>

      <div className="filters" style={{ marginBottom: "2rem" }}>
        <h3>Kategoriler</h3>
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            flexWrap: "wrap",
            marginTop: "1rem",
          }}
        >
          <button
            className={`btn ${!categoryId ? "btn-primary" : "btn-secondary"}`}
            onClick={() => handleCategoryFilter(null)}
          >
            Tümü
          </button>
          {categories.map((category) => (
            <button
              key={category.categoryId}
              className={`btn ${
                categoryId == category.categoryId
                  ? "btn-primary"
                  : "btn-secondary"
              }`}
              onClick={() => handleCategoryFilter(category.categoryId)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Ürün Ekleme Butonu - Sadece yetkili kullanıcılar görebilir */}
      {isAuthenticated && (
        <div style={{ marginBottom: "2rem", textAlign: "right" }}>
          <button
            className="btn btn-primary"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? "Formu Gizle" : "Yeni Ürün Ekle"}
          </button>
        </div>
      )}

      {/* Ürün Ekleme Formu */}
      {showAddForm && isAuthenticated && (
        <div className="card" style={{ marginBottom: "2rem" }}>
          <h2>Yeni Ürün Ekle</h2>

          <form onSubmit={handleSubmitProduct}>
            <div className="form-group">
              <label htmlFor="name">Ürün Adı</label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-control"
                value={newProduct.name}
                onChange={handleProductChange}
              />
              {formErrors.name && (
                <div className="error-message">{formErrors.name}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="description">Ürün Açıklaması</label>
              <textarea
                id="description"
                name="description"
                className="form-control"
                rows="3"
                value={newProduct.description}
                onChange={handleProductChange}
              ></textarea>
              {formErrors.description && (
                <div className="error-message">{formErrors.description}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="priceUSD">Fiyat (USD)</label>
              <input
                type="number"
                id="priceUSD"
                name="priceUSD"
                className="form-control"
                min="0.01"
                step="0.01"
                value={newProduct.priceUSD}
                onChange={handleProductChange}
              />
              {formErrors.priceUSD && (
                <div className="error-message">{formErrors.priceUSD}</div>
              )}
            </div>

            <div className="form-group">
              <label>Kategoriler</label>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                  marginTop: "0.5rem",
                }}
              >
                {categories.map((category) => (
                  <div
                    key={category.categoryId}
                    className={`btn ${
                      newProduct.categoryIds.includes(category.categoryId)
                        ? "btn-primary"
                        : "btn-secondary"
                    }`}
                    onClick={() => handleCategorySelect(category.categoryId)}
                    style={{ cursor: "pointer" }}
                  >
                    {category.name}
                  </div>
                ))}
              </div>
              {formErrors.categoryIds && (
                <div className="error-message">{formErrors.categoryIds}</div>
              )}
            </div>

            <button type="submit" className="btn btn-primary">
              Ürün Ekle
            </button>
          </form>
        </div>
      )}

      {products.length > 0 ? (
        <div className="products-grid">
          {products.map((product) => (
            <div className="product-card" key={product.productId}>
              <div className="product-image">
                <img
                  src={`https://via.placeholder.com/300x200?text=${product.name}`}
                  alt={product.name}
                />
              </div>
              <div className="product-info">
                <h3 className="product-title">{product.name}</h3>
                <p className="product-price">${product.priceUSD.toFixed(2)}</p>
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
        <p>Bu kriterlere uygun ürün bulunamadı.</p>
      )}
    </div>
  );
};

export default Products;
