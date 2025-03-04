import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import categoryService from "../services/categoryService";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import "./Home.css"; // Aynı stil dosyasını kullanıyoruz

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated, user } = useAuth();

  // Kategori ekleme formu için state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const categoriesData =
          await categoryService.getCategoriesWithProducts();
        setCategories(categoriesData);
      } catch (err) {
        setError("Kategoriler yüklenirken bir hata oluştu: " + err.message);
        console.error("Kategori yükleme hatası:", err);
        toast.error("Kategoriler yüklenirken bir hata oluştu: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Yeni kategori form değişikliklerini işle
  const handleCategoryChange = (e) => {
    const { name, value } = e.target;
    setNewCategory({ ...newCategory, [name]: value });

    // Hata mesajını temizle
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: "" });
    }
  };

  // Form doğrulama
  const validateCategoryForm = () => {
    const errors = {};

    if (!newCategory.name.trim()) {
      errors.name = "Kategori adı gereklidir";
    }

    if (!newCategory.description.trim()) {
      errors.description = "Kategori açıklaması gereklidir";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Kategori ekleme formunu gönder
  const handleSubmitCategory = async (e) => {
    e.preventDefault();

    if (!validateCategoryForm()) {
      // Form doğrulama hatalarını toast ile göster
      Object.values(formErrors).forEach((error) => {
        if (error) toast.error(error);
      });
      return;
    }

    try {
      const categoryData = {
        ...newCategory,
      };

      const createdCategory = await categoryService.createCategory(
        categoryData
      );

      // Kategori listesini güncelle
      setCategories([...categories, createdCategory]);

      // Formu temizle
      setNewCategory({
        name: "",
        description: "",
      });

      // Başarı mesajını toast ile göster
      toast.success("Kategori başarıyla eklendi");

      // Form başarıyla gönderildikten sonra formu kapat
      setShowAddForm(false);
    } catch (err) {
      // Hata mesajını toast ile göster
      toast.error(err.message || "Kategori eklenirken bir hata oluştu");
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
      <h1 className="section-title">Kategoriler</h1>

      {/* Kategori Ekleme Butonu - Sadece yetkili kullanıcılar görebilir */}
      {isAuthenticated && (
        <div style={{ marginBottom: "2rem", textAlign: "right" }}>
          <button
            className="btn btn-primary"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? "Formu Gizle" : "Yeni Kategori Ekle"}
          </button>
        </div>
      )}

      {/* Kategori Ekleme Formu */}
      {showAddForm && isAuthenticated && (
        <div className="card" style={{ marginBottom: "2rem" }}>
          <h2>Yeni Kategori Ekle</h2>

          <form onSubmit={handleSubmitCategory}>
            <div className="form-group">
              <label htmlFor="name">Kategori Adı</label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-control"
                value={newCategory.name}
                onChange={handleCategoryChange}
              />
              {formErrors.name && (
                <div className="error-message">{formErrors.name}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="description">Kategori Açıklaması</label>
              <textarea
                id="description"
                name="description"
                className="form-control"
                rows="3"
                value={newCategory.description}
                onChange={handleCategoryChange}
              ></textarea>
              {formErrors.description && (
                <div className="error-message">{formErrors.description}</div>
              )}
            </div>

            <button type="submit" className="btn btn-primary">
              Kategori Ekle
            </button>
          </form>
        </div>
      )}

      {categories.length > 0 ? (
        <div className="categories-grid">
          {categories.map((category) => (
            <div className="category-card" key={category.categoryId}>
              <h2 className="category-title">{category.name}</h2>
              <p className="category-description">{category.description}</p>
              <div style={{ marginTop: "1rem" }}>
                <Link
                  to={`/products?category=${category.categoryId}`}
                  className="btn btn-primary"
                >
                  Ürünleri Gör
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Henüz kategori bulunmamaktadır.</p>
      )}
    </div>
  );
};

export default Categories;
