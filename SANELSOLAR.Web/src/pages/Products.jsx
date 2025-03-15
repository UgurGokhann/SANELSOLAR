import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import productService from "../services/productService";
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
import { FaPlus, FaEdit, FaTrash, FaSearch, FaTimes } from "react-icons/fa";

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
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    priceUSD: "",
    unit: "Adet",
    brand: "",
    categoryIds: [],
  });
  
  // Ürün güncelleme formu için state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editFormData, setEditFormData] = useState({
    productId: "",
    name: "",
    description: "",
    priceUSD: "",
    unit: "Adet",
    brand: "",
    categoryIds: []
  });
  
  // Ürün silme için state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  
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
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleSearch = () => {
    // Mevcut ürünler içinde arama yap
    if (products.length > 0) {
      const filtered = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setFilteredProducts(products);
  };

  // Ürün ekleme/düzenleme form işlemleri
  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: value,
    });

    // Hata mesajını temizle
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: "" });
    }
  };

  const handleCategorySelect = (categoryId) => {
    const updatedCategoryIds = [...newProduct.categoryIds];
      const index = updatedCategoryIds.indexOf(categoryId);
    
    if (index === -1) {
      // Kategori seçilmemişse ekle
      updatedCategoryIds.push(categoryId);
    } else {
      // Kategori zaten seçilmişse kaldır
      updatedCategoryIds.splice(index, 1);
    }

    setNewProduct({
      ...newProduct,
      categoryIds: updatedCategoryIds,
    });
  };
  
  const handleEditCategorySelect = (categoryId) => {
    const updatedCategoryIds = [...editFormData.categoryIds];
      const index = updatedCategoryIds.indexOf(categoryId);
    
    if (index === -1) {
      // Kategori seçilmemişse ekle
      updatedCategoryIds.push(categoryId);
    } else {
      // Kategori zaten seçilmişse kaldır
      updatedCategoryIds.splice(index, 1);
    }

    setEditFormData({
      ...editFormData,
      categoryIds: updatedCategoryIds,
    });
  };

  const validateProductForm = (formData) => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Ürün adı gereklidir";
    }

    if (!formData.priceUSD || isNaN(formData.priceUSD) || parseFloat(formData.priceUSD) <= 0) {
      errors.priceUSD = "Geçerli bir fiyat giriniz";
    }

    if (!formData.unit.trim()) {
      errors.unit = "Birim gereklidir";
    }

    if (!formData.brand.trim()) {
      errors.brand = "Marka gereklidir";
    }

    if (formData.categoryIds.length === 0) {
      errors.categoryIds = "En az bir kategori seçmelisiniz";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();

    if (!validateProductForm(newProduct)) {
      return;
    }

    try {
      const response = await productService.createProduct(newProduct);

      if (response) {
        toast.success("Ürün başarıyla eklendi");

        // Formu sıfırla
      setNewProduct({
        name: "",
        description: "",
        priceUSD: "",
        unit: "Adet",
        brand: "",
        categoryIds: [],
      });

        // Ürün listesini güncelle
        const updatedProducts = await productService.getAllProducts();
        setProducts(updatedProducts);

        // Modalı kapat
        setShowAddModal(false);
      }
    } catch (err) {
      toast.error("Ürün eklenirken bir hata oluştu: " + err.message);
      console.error("Ürün ekleme hatası:", err);
    }
  };
  
  const handleEditClick = (product) => {
    setEditingProduct(product);
    setEditFormData({
      productId: product.productId,
      name: product.name,
      description: product.description,
      priceUSD: product.priceUSD.toString(),
      unit: product.unit,
      brand: product.brand,
      categoryIds: product.categories.map(cat => cat.categoryId),
    });
    setShowEditModal(true);
  };
  
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });

    // Hata mesajını temizle
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: "" });
    }
  };
  
  const handleUpdateProduct = async (e) => {
    e.preventDefault();

    if (!validateProductForm(editFormData)) {
      return;
    }

    try {
      const response = await productService.updateProduct(editFormData);
      
      if (response) {
        toast.success("Ürün başarıyla güncellendi");

      // Ürün listesini güncelle
        const updatedProducts = await productService.getAllProducts();
        setProducts(updatedProducts);

        // Modalı kapat
        setShowEditModal(false);
      }
    } catch (err) {
      toast.error("Ürün güncellenirken bir hata oluştu: " + err.message);
      console.error("Ürün güncelleme hatası:", err);
    }
  };
  
  const openDeleteModal = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    
      try {
      await productService.deleteProduct(productToDelete.productId);
      toast.success("Ürün başarıyla silindi");
        
        // Ürün listesini güncelle
      const updatedProducts = await productService.getAllProducts();
      setProducts(updatedProducts);
        
      // Modalı kapat
      setShowDeleteModal(false);
      } catch (err) {
      toast.error("Ürün silinirken bir hata oluştu: " + err.message);
      console.error("Ürün silme hatası:", err);
  }
  };

  return (
    <Container className="py-4">
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white">
          <h4 className="mb-0">Ürün Yönetimi</h4>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          <Row className="mb-3">
            <Col md={6}>
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Ürün adı veya marka ara..."
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
                  <FaPlus /> Yeni Ürün
                </Button>
              )}
            </Col>
          </Row>

          {categoryId && (
            <Row className="mb-3">
              <Col>
                <Alert variant="info" className="d-flex align-items-center justify-content-between mb-0">
                  <div>
                    <strong>Kategori Filtresi: </strong> 
                    {categories.find(c => c.categoryId == categoryId)?.name || 'Seçili Kategori'}
                  </div>
                  <Button 
                    variant="outline-secondary" 
                    size="sm" 
                    onClick={() => handleCategoryFilter(null)}
                  >
                    Filtreyi Kaldır <FaTimes />
                  </Button>
                </Alert>
              </Col>
            </Row>
          )}

          <Row className="mb-3">
            <Col>
              <div className="d-flex flex-wrap gap-2">
                <Button
                  variant={!categoryId ? "primary" : "outline-secondary"}
                  onClick={() => handleCategoryFilter(null)}
                >
                  Tümü
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category.categoryId}
                    variant={categoryId == category.categoryId ? "primary" : "outline-secondary"}
                    onClick={() => handleCategoryFilter(category.categoryId)}
                  >
                    {category.name} 
                    {category.productCount > 0 && (
                      <Badge bg="light" text="dark" className="ms-1">
                        {category.productCount}
                      </Badge>
                    )}
                  </Button>
                ))}
              </div>
            </Col>
          </Row>

          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Yükleniyor...</p>
      </div>
          ) : filteredProducts.length === 0 ? (
            <Alert variant="info">
              Ürün bulunamadı. Yeni ürün eklemek için "Yeni Ürün" butonuna tıklayın.
            </Alert>
          ) : (
            <Table responsive striped hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Ürün Adı</th>
                  <th>Marka</th>
                  <th>Fiyat (USD)</th>
                  <th>Birim</th>
                  <th>Kategoriler</th>
                  {isAuthenticated && <th>İşlemler</th>}
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product, index) => (
                  <tr key={product.productId}>
                    <td>{index + 1}</td>
                    <td>{product.name}</td>
                    <td>{product.brand}</td>
                    <td>${product.priceUSD.toFixed(2)}</td>
                    <td>{product.unit}</td>
                    <td>
                      {product.categories.map(cat => cat.name).join(", ")}
                    </td>
      {isAuthenticated && (
                      <td>
                        <Button
                          variant="warning"
                          size="sm"
                          className="me-2"
                          onClick={() => handleEditClick(product)}
                        >
                          <FaEdit /> Düzenle
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => openDeleteModal(product)}
                        >
                          <FaTrash /> Sil
                        </Button>
                      </td>
      )}
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Ürün Ekleme Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Yeni Ürün Ekle</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitProduct}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Ürün Adı</Form.Label>
                  <Form.Control
                type="text"
                name="name"
                value={newProduct.name}
                onChange={handleProductChange}
                    isInvalid={!!formErrors.name}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.name}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Marka</Form.Label>
                  <Form.Control
                    type="text"
                    name="brand"
                    value={newProduct.brand}
                    onChange={handleProductChange}
                    isInvalid={!!formErrors.brand}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.brand}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Ürün Açıklaması</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={newProduct.description}
                onChange={handleProductChange}
                isInvalid={!!formErrors.description}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.description}
              </Form.Control.Feedback>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Fiyat (USD)</Form.Label>
                  <Form.Control
                type="number"
                    step="0.01"
                    min="0.01"
                name="priceUSD"
                value={newProduct.priceUSD}
                onChange={handleProductChange}
                    isInvalid={!!formErrors.priceUSD}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.priceUSD}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Birim</Form.Label>
                  <Form.Control
                type="text"
                name="unit"
                value={newProduct.unit}
                onChange={handleProductChange}
                    isInvalid={!!formErrors.unit}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.unit}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Kategoriler</Form.Label>
              {formErrors.categoryIds && (
                <div className="text-danger mb-2">{formErrors.categoryIds}</div>
              )}
              <div className="d-flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Form.Check
                    key={category.categoryId}
                    type="checkbox"
                    id={`category-${category.categoryId}`}
                    label={category.name}
                    checked={newProduct.categoryIds.includes(category.categoryId)}
                    onChange={() => handleCategorySelect(category.categoryId)}
                    className="me-3"
                  />
                ))}
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            İptal
          </Button>
          <Button variant="primary" onClick={handleSubmitProduct}>
              Ürün Ekle
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Ürün Düzenleme Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Ürün Düzenle</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdateProduct}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Ürün Adı</Form.Label>
                  <Form.Control
                type="text"
                name="name"
                value={editFormData.name}
                onChange={handleEditFormChange}
                    isInvalid={!!formErrors.name}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.name}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Marka</Form.Label>
                  <Form.Control
                    type="text"
                    name="brand"
                    value={editFormData.brand}
                    onChange={handleEditFormChange}
                    isInvalid={!!formErrors.brand}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.brand}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Ürün Açıklaması</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={editFormData.description}
                onChange={handleEditFormChange}
                isInvalid={!!formErrors.description}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.description}
              </Form.Control.Feedback>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Fiyat (USD)</Form.Label>
                  <Form.Control
                type="number"
                    step="0.01"
                    min="0.01"
                name="priceUSD"
                value={editFormData.priceUSD}
                onChange={handleEditFormChange}
                    isInvalid={!!formErrors.priceUSD}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.priceUSD}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Birim</Form.Label>
                  <Form.Control
                type="text"
                name="unit"
                value={editFormData.unit}
                onChange={handleEditFormChange}
                    isInvalid={!!formErrors.unit}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.unit}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Kategoriler</Form.Label>
              {formErrors.categoryIds && (
                <div className="text-danger mb-2">{formErrors.categoryIds}</div>
              )}
              <div className="d-flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Form.Check
                    key={category.categoryId}
                    type="checkbox"
                    id={`edit-category-${category.categoryId}`}
                    label={category.name}
                    checked={editFormData.categoryIds.includes(category.categoryId)}
                    onChange={() => handleEditCategorySelect(category.categoryId)}
                    className="me-3"
                  />
                ))}
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            İptal
          </Button>
          <Button variant="primary" onClick={handleUpdateProduct}>
            Güncelle
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Ürün Silme Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Ürün Sil</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {productToDelete && (
            <p>
              <strong>{productToDelete.name}</strong> adlı ürünü silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                İptal
          </Button>
          <Button variant="danger" onClick={handleDeleteProduct}>
            Sil
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Products;
