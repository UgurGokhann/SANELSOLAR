import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import categoryService from "../services/categoryService";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Table,
  Form,
  Modal,
  Alert,
  InputGroup,
  Spinner,
  Badge,
} from "react-bootstrap";
import { FaPlus, FaEdit, FaTrash, FaSearch, FaTimes, FaExternalLinkAlt } from "react-icons/fa";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated, user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Kategori ekleme formu için state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
  });
  
  // Kategori güncelleme formu için state
  const [showEditModal, setShowEditModal] = useState(false);
  const [updateCategory, setUpdateCategory] = useState({
    categoryId: 0,
    name: "",
    description: ""
  });
  
  // Kategori silme için state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  
  const [formErrors, setFormErrors] = useState({});

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
  
  const handleSearch = () => {
    // Mevcut kategoriler içinde arama yap
    if (categories.length > 0) {
      const filtered = categories.filter(category => 
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCategories(filtered);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setFilteredCategories(categories);
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
  const validateCategoryForm = (formData) => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Kategori adı gereklidir";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Yeni kategori ekleme
  const handleSubmitCategory = async (e) => {
    e.preventDefault();
    
    if (!validateCategoryForm(newCategory)) {
      return;
    }

    try {
      const response = await categoryService.createCategory(newCategory);
      
      if (response) {
        toast.success("Kategori başarıyla eklendi");
        
        // Formu sıfırla
        setNewCategory({
          name: "",
          description: "",
        });
        
        // Kategori listesini güncelle
        const updatedCategories = await categoryService.getCategoriesWithProducts();
        setCategories(updatedCategories);
        setFilteredCategories(updatedCategories);
        
        // Modalı kapat
        setShowAddModal(false);
      }
    } catch (err) {
      toast.error("Kategori eklenirken bir hata oluştu: " + err.message);
      console.error("Kategori ekleme hatası:", err);
    }
  };

  // Kategori güncelleme
  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    
    if (!validateCategoryForm(updateCategory)) {
      return;
    }
    
    // Ekstra kontrol: "DIGER" kategorisinin güncellenmesini engelle
    if (updateCategory.name === "DIGER") {
      toast.error("DIGER kategorisi güncellenemez");
      setShowEditModal(false);
      return;
    }

    try {
      const response = await categoryService.updateCategory(updateCategory);
      
      if (response) {
        toast.success("Kategori başarıyla güncellendi");
        
        // Kategori listesini güncelle
        const updatedCategories = await categoryService.getCategoriesWithProducts();
        setCategories(updatedCategories);
        setFilteredCategories(updatedCategories);
        
        // Modalı kapat
        setShowEditModal(false);
      }
    } catch (err) {
      toast.error("Kategori güncellenirken bir hata oluştu: " + err.message);
    }
  };

  // Kategori silme
  const openDeleteModal = (category) => {
    // "DIGER" kategorisinin silinmesini engelle
    if (category.name === "DIGER") {
      toast.error("DIGER kategorisi silinemez");
      return;
    }
    
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;
    
    // Ekstra kontrol: "DIGER" kategorisinin silinmesini engelle
    if (categoryToDelete.name === "DIGER") {
      toast.error("DIGER kategorisi silinemez");
      setShowDeleteModal(false);
      return;
    }
    
    try {
      // Eğer kategoriye ait ürünler varsa, kullanıcıya bilgi ver
      const hasProducts = categoryToDelete.productCount > 0;
      
      await categoryService.deleteCategory(categoryToDelete.categoryId);
      
      if (hasProducts) {
        toast.success(`Kategori başarıyla silindi. ${categoryToDelete.productCount} ürün "DIGER" kategorisine aktarıldı.`);
      } else {
        toast.success("Kategori başarıyla silindi.");
      }
      
      // Kategori listesini güncelle
      const updatedCategories = await categoryService.getCategoriesWithProducts();
      setCategories(updatedCategories);
      setFilteredCategories(updatedCategories);
      
      // Modalı kapat
      setShowDeleteModal(false);
    } catch (err) {
      toast.error("Kategori silinirken bir hata oluştu: " + err.message);
      console.error("Kategori silme hatası:", err);
    }
  };

  // Kategori düzenleme formunu aç
  const openEditModal = (category) => {
    // "DIGER" kategorisinin güncellenmesini engelle
    if (category.name === "DIGER") {
      toast.error("DIGER kategorisi güncellenemez");
      return;
    }
    
    setUpdateCategory({
      categoryId: category.categoryId,
      name: category.name,
      description: category.description || ""
    });
    
    setShowEditModal(true);
  };

  // Ürün sayısına tıklandığında ürünler sayfasına yönlendir
  const handleProductCountClick = (categoryId) => {
    navigate(`/products?category=${categoryId}`);
  };

  return (
    <Container className="py-4">
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white">
          <h4 className="mb-0">Kategori Yönetimi</h4>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          <Row className="mb-3">
            <Col md={6}>
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Kategori ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                />
                <Button variant="outline-secondary" onClick={clearSearch}>
                  <FaTimes />
                </Button>
                <Button variant="primary" onClick={handleSearch}>
                  <FaSearch /> Ara
                </Button>
              </InputGroup>
            </Col>
            <Col md={6} className="text-end">
              {isAuthenticated && (
                <Button variant="success" onClick={() => setShowAddModal(true)}>
                  <FaPlus /> Yeni Kategori
                </Button>
              )}
            </Col>
          </Row>

          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Yükleniyor...</p>
            </div>
          ) : filteredCategories.length === 0 ? (
            <Alert variant="info">
              Kategori bulunamadı. Yeni kategori eklemek için "Yeni Kategori" butonuna tıklayın.
            </Alert>
          ) : (
            <Table responsive striped hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Kategori Adı</th>
                  <th>Açıklama</th>
                  <th>Ürün Sayısı</th>
                  {isAuthenticated && <th>İşlemler</th>}
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((category, index) => (
                  <tr key={category.categoryId}>
                    <td>{index + 1}</td>
                    <td>
                      {category.name}
                    </td>
                    <td>{category.description || "-"}</td>
                    <td>
                      {category.productCount > 0 ? (
                        <Badge 
                          bg="primary" 
                          className="product-count-badge" 
                          onClick={() => handleProductCountClick(category.categoryId)}
                          style={{ 
                            cursor: 'pointer', 
                            padding: '6px 10px',
                            fontSize: '0.9rem'
                          }}
                        >
                          {category.productCount} <FaExternalLinkAlt size={10} className="ms-1" />
                        </Badge>
                      ) : (
                        <span>0</span>
                      )}
                    </td>
                    {isAuthenticated && (
                      <td>
                        {category.name !== "DIGER" && (
                          <>
                            <Button
                              variant="warning"
                              size="sm"
                              className="me-2"
                              onClick={() => openEditModal(category)}
                            >
                              <FaEdit /> Düzenle
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => openDeleteModal(category)}
                            >
                              <FaTrash /> Sil
                            </Button>
                          </>
                        )}
                        {category.name === "DIGER" && (
                          <Badge bg="secondary">Sistem Kategorisi</Badge>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Kategori Ekleme Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Yeni Kategori Ekle</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitCategory}>
            <Form.Group className="mb-3">
              <Form.Label>Kategori Adı</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newCategory.name}
                onChange={handleCategoryChange}
                isInvalid={!!formErrors.name}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.name}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Kategori Açıklaması <span className="text-muted">(Opsiyonel)</span></Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={newCategory.description}
                onChange={handleCategoryChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            İptal
          </Button>
          <Button variant="primary" onClick={handleSubmitCategory}>
            Kategori Ekle
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Kategori Düzenleme Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Kategori Düzenle</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdateCategory}>
            <Form.Group className="mb-3">
              <Form.Label>Kategori Adı</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={updateCategory.name}
                onChange={handleUpdateChange}
                isInvalid={!!formErrors.name}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.name}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Kategori Açıklaması <span className="text-muted">(Opsiyonel)</span></Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={updateCategory.description}
                onChange={handleUpdateChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            İptal
          </Button>
          <Button variant="primary" onClick={handleUpdateCategory}>
            Güncelle
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Kategori Silme Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Kategori Sil</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {categoryToDelete && (
            <div>
              <p>
                <strong>{categoryToDelete.name}</strong> adlı kategoriyi silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
              </p>
              
              {categoryToDelete.productCount > 0 && (
                <Alert variant="warning" className="mt-2">
                  <p>Bu kategoriye ait <strong>{categoryToDelete.productCount}</strong> ürün bulunmaktadır.</p>
                  <p className="mb-0">Kategoriyi sildiğinizde, bu ürünler otomatik olarak <strong>"DIGER"</strong> kategorisine aktarılacaktır. Eğer "DIGER" kategorisi yoksa, sistem tarafından oluşturulacaktır.</p>
                </Alert>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            İptal
          </Button>
          <Button variant="danger" onClick={handleDeleteCategory}>
            Sil
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Categories;
