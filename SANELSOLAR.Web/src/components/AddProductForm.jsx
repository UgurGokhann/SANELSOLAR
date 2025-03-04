import { useState } from "react";
import productService from "../services/productService";

const AddProductForm = ({ categories, onProductAdded }) => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    priceUSD: "",
    categoryIds: [],
  });
  const [formErrors, setFormErrors] = useState({});
  const [formSuccess, setFormSuccess] = useState("");
  const [loading, setLoading] = useState(false);

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
    setFormSuccess("");

    if (!validateProductForm()) {
      return;
    }

    try {
      setLoading(true);
      // Fiyatı sayıya dönüştür
      const productData = {
        ...newProduct,
        priceUSD: parseFloat(newProduct.priceUSD),
      };

      const createdProduct = await productService.createProduct(productData);

      // Formu temizle
      setNewProduct({
        name: "",
        description: "",
        priceUSD: "",
        categoryIds: [],
      });

      setFormSuccess("Ürün başarıyla eklendi");

      // Eklenen ürünü üst bileşene bildir
      if (onProductAdded) {
        onProductAdded(createdProduct);
      }

      // 3 saniye sonra başarı mesajını temizle
      setTimeout(() => {
        setFormSuccess("");
      }, 3000);
    } catch (err) {
      setFormErrors({
        submit: err.message || "Ürün eklenirken bir hata oluştu",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ marginBottom: "2rem" }}>
      <h2>Yeni Ürün Ekle</h2>
      {formSuccess && <div className="success-message">{formSuccess}</div>}
      {formErrors.submit && (
        <div className="error-message">{formErrors.submit}</div>
      )}

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

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Ekleniyor..." : "Ürün Ekle"}
        </button>
      </form>
    </div>
  );
};

export default AddProductForm;
