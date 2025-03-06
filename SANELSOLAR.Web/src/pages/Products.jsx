import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Ürün ekleme formu için state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    priceUSD: "",
    categoryIds: [],
  });
  
  // Ürün güncelleme formu için state
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editFormData, setEditFormData] = useState({
    productId: "",
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

  // Ürünleri filtrele
  useEffect(() => {
    if (products.length > 0) {
      const filtered = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  }, [products, searchTerm]);

  const handleCategoryFilter = (id) => {
    if (id) {
      setSearchParams({ category: id });
    } else {
      setSearchParams({});
    }
    // Kategori değiştiğinde arama terimini sıfırla
    setSearchTerm("");
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
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
  
  // Güncelleme formu için kategori seçimlerini işle
  const handleEditCategorySelect = (categoryId) => {
    const updatedCategoryIds = [...editFormData.categoryIds];

    if (updatedCategoryIds.includes(categoryId)) {
      // Kategori zaten seçiliyse, kaldır
      const index = updatedCategoryIds.indexOf(categoryId);
      updatedCategoryIds.splice(index, 1);
    } else {
      // Kategori seçili değilse, ekle
      updatedCategoryIds.push(categoryId);
    }

    setEditFormData({ ...editFormData, categoryIds: updatedCategoryIds });
  };

  // Form doğrulama
  const validateProductForm = (formData) => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Ürün adı gereklidir";
    }

    

    if (
      !formData.priceUSD ||
      isNaN(formData.priceUSD) ||
      parseFloat(formData.priceUSD) <= 0
    ) {
      errors.priceUSD = "Geçerli bir fiyat giriniz";
    }

    if (formData.categoryIds.length === 0) {
      errors.categoryIds = "En az bir kategori seçmelisiniz";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Ürün ekleme formunu gönder
  const handleSubmitProduct = async (e) => {
    e.preventDefault();

    if (!validateProductForm(newProduct)) {
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
  
  // Ürün düzenleme formunu aç
  const handleEditClick = (product) => {
    setEditingProduct(product);
    setEditFormData({
      productId: product.productId,
      name: product.name,
      description: product.description,
      priceUSD: product.priceUSD.toString(),
      categoryIds: product.categories ? product.categories.map(cat => cat.categoryId) : [],
    });
    setShowEditForm(true);
    setShowAddForm(false); // Ekleme formunu kapat
  };
  
  // Düzenleme formu değişikliklerini işle
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });

    // Hata mesajını temizle
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: "" });
    }
  };
  
  // Ürün güncelleme formunu gönder
  const handleUpdateProduct = async (e) => {
    e.preventDefault();

    if (!validateProductForm(editFormData)) {
      // Form doğrulama hatalarını toast ile göster
      Object.values(formErrors).forEach((error) => {
        if (error) toast.error(error);
      });
      return;
    }

    try {
      // Fiyatı sayıya dönüştür
      const productData = {
        ...editFormData,
        priceUSD: parseFloat(editFormData.priceUSD),
      };

      const updatedProduct = await productService.updateProduct(productData);

      // Ürün listesini güncelle
      setProducts(products.map(p => 
        p.productId === updatedProduct.productId ? updatedProduct : p
      ));

      // Başarı mesajını toast ile göster
      toast.success("Ürün başarıyla güncellendi");

      // Form başarıyla gönderildikten sonra formu kapat
      setShowEditForm(false);
      setEditingProduct(null);
    } catch (err) {
      // Hata mesajını toast ile göster
      toast.error(err.message || "Ürün güncellenirken bir hata oluştu");
    }
  };
  
  // Ürün silme işlemi
  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Bu ürünü silmek istediğinizden emin misiniz?")) {
      try {
        await productService.deleteProduct(productId);
        
        // Ürün listesini güncelle
        setProducts(products.filter(p => p.productId !== productId));
        
        // Başarı mesajını toast ile göster
        toast.success("Ürün başarıyla silindi");
      } catch (err) {
        // Hata mesajını toast ile göster
        toast.error(err.message || "Ürün silinirken bir hata oluştu");
      }
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

      {/* Ürün Arama */}
      <div className="search-container" style={{ marginBottom: "2rem" }}>
        <input
          type="text"
          placeholder="Ürün adına göre ara..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="form-control"
          style={{ width: "100%", padding: "0.5rem" }}
        />
      </div>

      {/* Ürün Ekleme Butonu - Sadece yetkili kullanıcılar görebilir */}
      {isAuthenticated && (
        <div style={{ marginBottom: "2rem", textAlign: "right" }}>
          <button
            className="btn btn-primary"
            onClick={() => {
              setShowAddForm(!showAddForm);
              setShowEditForm(false); // Düzenleme formunu kapat
            }}
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
      
      {/* Ürün Düzenleme Formu */}
      {showEditForm && isAuthenticated && editingProduct && (
        <div className="card" style={{ marginBottom: "2rem" }}>
          <h2>Ürün Düzenle</h2>

          <form onSubmit={handleUpdateProduct}>
            <input type="hidden" name="productId" value={editFormData.productId} />
            
            <div className="form-group">
              <label htmlFor="edit-name">Ürün Adı</label>
              <input
                type="text"
                id="edit-name"
                name="name"
                className="form-control"
                value={editFormData.name}
                onChange={handleEditFormChange}
              />
              {formErrors.name && (
                <div className="error-message">{formErrors.name}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="edit-description">Ürün Açıklaması</label>
              <textarea
                id="edit-description"
                name="description"
                className="form-control"
                rows="3"
                value={editFormData.description}
                onChange={handleEditFormChange}
              ></textarea>
              {formErrors.description && (
                <div className="error-message">{formErrors.description}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="edit-priceUSD">Fiyat (USD)</label>
              <input
                type="number"
                id="edit-priceUSD"
                name="priceUSD"
                className="form-control"
                min="0.01"
                step="0.01"
                value={editFormData.priceUSD}
                onChange={handleEditFormChange}
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
                      editFormData.categoryIds.includes(category.categoryId)
                        ? "btn-primary"
                        : "btn-secondary"
                    }`}
                    onClick={() => handleEditCategorySelect(category.categoryId)}
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

            <div style={{ display: "flex", gap: "1rem" }}>
              <button type="submit" className="btn btn-primary">
                Güncelle
              </button>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => {
                  setShowEditForm(false);
                  setEditingProduct(null);
                }}
              >
                İptal
              </button>
            </div>
          </form>
        </div>
      )}

      {filteredProducts.length > 0 ? (
        <div className="products-list">
          {filteredProducts.map((product) => (
            <div className="product-item" key={product.productId} style={{ 
              padding: "1rem", 
              marginBottom: "1rem", 
              borderBottom: "1px solid #eee",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <div className="product-info">
                <h3 className="product-title">{product.name}</h3>
                <p className="product-price">${product.priceUSD.toFixed(2)}</p>
                <div className="product-categories" style={{ fontSize: "0.9rem", color: "#666" }}>
                  <strong>Kategoriler:</strong> {product.categories && product.categories.length > 0 
                    ? product.categories.map(cat => cat.name).join(", ") 
                    : "Kategori yok"}
                </div>
                <p className="product-description">{product.description}</p>
              </div>
              
              {isAuthenticated && (
                <div className="product-actions" style={{ display: "flex", gap: "0.5rem" }}>
                  <button 
                    className="btn btn-sm btn-primary"
                    onClick={() => handleEditClick(product)}
                  >
                    Düzenle
                  </button>
                  <button 
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDeleteProduct(product.productId)}
                  >
                    Sil
                  </button>
                </div>
              )}
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
