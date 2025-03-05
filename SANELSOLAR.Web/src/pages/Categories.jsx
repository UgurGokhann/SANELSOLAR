import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import categoryService from "../services/categoryService";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import "./Home.css"; // Aynı stil dosyasını kullanıyoruz

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated, user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  // Kategori ekleme formu için state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
  });
  const [formErrors, setFormErrors] = useState({});

  // Kategori güncelleme formu için state
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [updateCategory, setUpdateCategory] = useState({
    categoryId: 0,
    name: "",
    description: "",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const categoriesData =
          await categoryService.getCategoriesWithProducts();
        setCategories(categoriesData);
        setFilteredCategories(categoriesData);
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

  // Arama işlevi
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCategories(categories);
    } else {
      const filtered = categories.filter(category => 
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCategories(filtered);
    }
  }, [searchTerm, categories]);

  // Arama kutusundaki değişiklikleri işle
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Yeni kategori form değişikliklerini işle
  const handleCategoryChange = (e) => {
    const { name, value } = e.target;
    setNewCategory({ ...newCategory, [name]: value });

    // Hata mesajını temizle
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: "" });
    }
  };

  // Güncelleme formu değişikliklerini işle
  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdateCategory({ ...updateCategory, [name]: value });

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

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Güncelleme formu doğrulama
  const validateUpdateForm = () => {
    const errors = {};

    if (!updateCategory.name.trim()) {
      errors.name = "Kategori adı gereklidir";
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

  // Kategori güncelleme formunu gönder
  const handleUpdateCategory = async (e) => {
    e.preventDefault();

    if (!validateUpdateForm()) {
      // Form doğrulama hatalarını toast ile göster
      Object.values(formErrors).forEach((error) => {
        if (error) toast.error(error);
      });
      return;
    }

    try {
      await categoryService.updateCategory(updateCategory);

      // Kategori listesini güncelle
      const updatedCategories = categories.map(cat => 
        cat.categoryId === updateCategory.categoryId 
          ? { ...cat, name: updateCategory.name, description: updateCategory.description } 
          : cat
      );
      setCategories(updatedCategories);

      // Başarı mesajını toast ile göster
      toast.success("Kategori başarıyla güncellendi");

      // Form başarıyla gönderildikten sonra formu kapat
      setShowUpdateForm(false);
    } catch (err) {
      // Hata mesajını toast ile göster
      toast.error(err.message || "Kategori güncellenirken bir hata oluştu");
    }
  };

  // Kategori silme işlemi
  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm("Bu kategoriyi silmek istediğinizden emin misiniz?")) {
      try {
        await categoryService.deleteCategory(categoryId);
        
        // Kategori listesini güncelle
        const updatedCategories = categories.filter(cat => cat.categoryId !== categoryId);
        setCategories(updatedCategories);
        
        // Başarı mesajını toast ile göster
        toast.success("Kategori başarıyla silindi");
      } catch (err) {
        // Hata mesajını toast ile göster
        toast.error(err.message || "Kategori silinirken bir hata oluştu");
      }
    }
  };

  // Güncelleme formunu aç
  const openUpdateForm = (category) => {
    setUpdateCategory({
      categoryId: category.categoryId,
      name: category.name,
      description: category.description || "",
    });
    setShowUpdateForm(true);
    setShowAddForm(false); // Ekleme formunu kapat
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

      {/* Arama Kutusu */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Kategori ara..."
          className="search-input"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {/* Kategori Ekleme Butonu - Sadece yetkili kullanıcılar görebilir */}
      {isAuthenticated && (
        <div style={{ marginBottom: "2rem", textAlign: "right" }}>
          <button
            className="btn btn-primary"
            onClick={() => {
              setShowAddForm(!showAddForm);
              setShowUpdateForm(false); // Güncelleme formunu kapat
            }}
          >
            {showAddForm ? "Formu Gizle" : "Yeni Kategori Ekle"}
          </button>
        </div>
      )}

      {/* Kategori Ekleme Formu */}
      {showAddForm && isAuthenticated && (
        <div className="card form-card" style={{ marginBottom: "2rem" }}>
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
              <label htmlFor="description">Kategori Açıklaması <span className="optional-text">(Opsiyonel)</span></label>
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

      {/* Kategori Güncelleme Formu */}
      {showUpdateForm && isAuthenticated && (
        <div className="card form-card" style={{ marginBottom: "2rem" }}>
          <h2>Kategori Güncelle</h2>

          <form onSubmit={handleUpdateCategory}>
            <div className="form-group">
              <label htmlFor="update-name">Kategori Adı</label>
              <input
                type="text"
                id="update-name"
                name="name"
                className="form-control"
                value={updateCategory.name}
                onChange={handleUpdateChange}
              />
              {formErrors.name && (
                <div className="error-message">{formErrors.name}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="update-description">Kategori Açıklaması <span className="optional-text">(Opsiyonel)</span></label>
              <textarea
                id="update-description"
                name="description"
                className="form-control"
                rows="3"
                value={updateCategory.description}
                onChange={handleUpdateChange}
              ></textarea>
              {formErrors.description && (
                <div className="error-message">{formErrors.description}</div>
              )}
            </div>

            <div className="button-group">
              <button type="submit" className="btn btn-primary">
                Güncelle
              </button>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => setShowUpdateForm(false)}
              >
                İptal
              </button>
            </div>
          </form>
        </div>
      )}

      {filteredCategories.length > 0 ? (
        <div className="categories-grid">
          {filteredCategories.map((category) => (
            <div className="category-card" key={category.categoryId}>
              <h2 className="category-title">{category.name}</h2>
              <p className="category-description">{category.description || "Açıklama yok"}</p>
              
              <div className="category-actions">
                <Link
                  to={`/products?category=${category.categoryId}`}
                  className="btn btn-primary"
                >
                  Ürünleri Gör
                </Link>
                
                {isAuthenticated && (
                  <>
                    <button 
                      className="btn btn-secondary"
                      onClick={() => openUpdateForm(category)}
                    >
                      Düzenle
                    </button>
                    <button 
                      className="btn btn-danger"
                      onClick={() => handleDeleteCategory(category.categoryId)}
                    >
                      Sil
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>
          {searchTerm.trim() !== "" 
            ? `"${searchTerm}" ile eşleşen kategori bulunamadı.` 
            : "Henüz kategori bulunmamaktadır."}
        </p>
      )}
    </div>
  );
};

export default Categories;
