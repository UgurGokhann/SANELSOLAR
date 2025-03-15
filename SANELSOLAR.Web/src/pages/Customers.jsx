import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Table,
  Form,
  Modal,
  InputGroup,
  Spinner,
} from "react-bootstrap";
import { FaPlus, FaEdit, FaTrash, FaSearch, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import customerService from "../services/customerService";
import { useAuth } from "../context/AuthContext";

const Customers = () => {
  const { isAuthenticated } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    address: "",
  });
  const [validationErrors, setValidationErrors] = useState({});

  // Müşterileri yükle
  useEffect(() => {
    if (isAuthenticated) {
      loadCustomers();
    }
  }, [isAuthenticated]);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const data = await customerService.getAllCustomers();
      setCustomers(data);
    } catch (err) {
      toast.error(err.message || "Müşteriler yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const data = await customerService.searchCustomers(searchTerm);
      setCustomers(data);
    } catch (err) {
      toast.error(err.message || "Müşteri araması sırasında bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    loadCustomers();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Validation error'u temizle
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: null,
      });
    }
  };

  const resetForm = () => {
    setFormData({
      firstname: "",
      lastname: "",
      email: "",
      phone: "",
      address: "",
    });
    setValidationErrors({});
  };

  const openAddModal = () => {
    resetForm();
    setShowAddModal(true);
  };

  const openEditModal = (customer) => {
    setValidationErrors({});
    setCurrentCustomer(customer);
    setFormData({
      customerId: customer.customerId,
      firstname: customer.firstname,
      lastname: customer.lastname,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (customer) => {
    setValidationErrors({});
    setCurrentCustomer(customer);
    setShowDeleteModal(true);
  };

  // Form validasyon fonksiyonu
  const validateForm = () => {
    const errors = {};
    let isValid = true;

    // Ad kontrolü
    if (!formData.firstname || formData.firstname.trim() === '') {
      errors.firstname = "Ad alanı zorunludur";
      isValid = false;
    } else if (formData.firstname.length < 2) {
      errors.firstname = "Ad en az 2 karakter olmalıdır";
      isValid = false;
    }

    // Soyad kontrolü
    if (!formData.lastname || formData.lastname.trim() === '') {
      errors.lastname = "Soyad alanı zorunludur";
      isValid = false;
    } else if (formData.lastname.length < 2) {
      errors.lastname = "Soyad en az 2 karakter olmalıdır";
      isValid = false;
    }

    // Email kontrolü
    if (!formData.email || formData.email.trim() === '') {
      errors.email = "E-posta alanı zorunludur";
      isValid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        errors.email = "Geçerli bir e-posta adresi giriniz";
        isValid = false;
      }
    }

    // Telefon kontrolü
    if (!formData.phone || formData.phone.trim() === '') {
      errors.phone = "Telefon alanı zorunludur";
      isValid = false;
    } else {
      // Basit telefon formatı kontrolü (en az 10 karakter ve sadece rakam)
      const phoneRegex = /^\d{10,11}$/;
      if (!phoneRegex.test(formData.phone.replace(/[^0-9]/g, ''))) {
        errors.phone = "Geçerli bir telefon numarası giriniz (10-11 rakam)";
        isValid = false;
      }
    }

    // Adres kontrolü
    if (!formData.address || formData.address.trim() === '') {
      errors.address = "Adres alanı zorunludur";
      isValid = false;
    } else if (formData.address.length < 10) {
      errors.address = "Adres en az 10 karakter olmalıdır";
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleAddCustomer = async () => {
    // Form validasyonu yap
    if (!validateForm()) {
      toast.error("Lütfen form alanlarını kontrol ediniz.");
      return;
    }
    
    try {
      setLoading(true);
      const response = await customerService.createCustomer(formData);
      
      if (response.isError) {
        if (response.validationErrors) {
          setValidationErrors(
            response.validationErrors.reduce((acc, curr) => {
              acc[curr.propertyName.toLowerCase()] = curr.errorMessage;
              return acc;
            }, {})
          );
          toast.error("Lütfen form alanlarını kontrol ediniz.");
        } else {
          toast.error(response.message || "Müşteri eklenirken bir hata oluştu.");
        }
        return;
      }
      
      await loadCustomers();
      setShowAddModal(false);
      resetForm();
      toast.success("Müşteri başarıyla eklendi.");
    } catch (err) {
      toast.error(err.message || "Müşteri eklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCustomer = async () => {
    // Form validasyonu yap
    if (!validateForm()) {
      toast.error("Lütfen form alanlarını kontrol ediniz.");
      return;
    }
    
    try {
      setLoading(true);
      const response = await customerService.updateCustomer(formData);
      
      if (response.isError) {
        if (response.validationErrors) {
          setValidationErrors(
            response.validationErrors.reduce((acc, curr) => {
              acc[curr.propertyName.toLowerCase()] = curr.errorMessage;
              return acc;
            }, {})
          );
          toast.error("Lütfen form alanlarını kontrol ediniz.");
        } else {
          toast.error(response.message || "Müşteri güncellenirken bir hata oluştu.");
        }
        return;
      }
      
      await loadCustomers();
      setShowEditModal(false);
      resetForm();
      toast.success("Müşteri başarıyla güncellendi.");
    } catch (err) {
      toast.error(err.message || "Müşteri güncellenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCustomer = async () => {
    try {
      setLoading(true);
      await customerService.deleteCustomer(currentCustomer.customerId);
      await loadCustomers();
      setShowDeleteModal(false);
      toast.success("Müşteri başarıyla silindi.");
    } catch (err) {
      toast.error(err.message || "Müşteri silinirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-4">
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white">
          <h4 className="mb-0">Müşteri Yönetimi</h4>
        </Card.Header>
        <Card.Body>
          <Row className="mb-3">
            <Col md={6}>
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Müşteri ara..."
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
              <Button variant="success" onClick={openAddModal}>
                <FaPlus /> Yeni Müşteri
              </Button>
            </Col>
          </Row>

          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Yükleniyor...</p>
            </div>
          ) : customers.length === 0 ? (
            <div className="text-center py-4">
              <p>Kayıtlı müşteri bulunamadı. Yeni müşteri eklemek için "Yeni Müşteri" butonuna tıklayın.</p>
            </div>
          ) : (
            <Table responsive striped hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Ad Soyad</th>
                  <th>E-posta</th>
                  <th>Telefon</th>
                  <th>Adres</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer, index) => (
                  <tr key={customer.customerId}>
                    <td>{index + 1}</td>
                    <td>{customer.fullname}</td>
                    <td>{customer.email}</td>
                    <td>{customer.phone}</td>
                    <td>{customer.address}</td>
                    <td>
                      <Button
                        variant="warning"
                        size="sm"
                        className="me-2"
                        onClick={() => openEditModal(customer)}
                      >
                        <FaEdit /> Düzenle
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => openDeleteModal(customer)}
                      >
                        <FaTrash /> Sil
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Müşteri Ekleme Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Yeni Müşteri Ekle</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Ad</Form.Label>
                  <Form.Control
                    type="text"
                    name="firstname"
                    value={formData.firstname}
                    onChange={handleInputChange}
                    isInvalid={!!validationErrors.firstname}
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.firstname}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Soyad</Form.Label>
                  <Form.Control
                    type="text"
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleInputChange}
                    isInvalid={!!validationErrors.lastname}
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.lastname}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>E-posta</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                isInvalid={!!validationErrors.email}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.email}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Telefon</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                isInvalid={!!validationErrors.phone}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.phone}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Adres</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                isInvalid={!!validationErrors.address}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.address}
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            İptal
          </Button>
          <Button variant="primary" onClick={handleAddCustomer} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : "Kaydet"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Müşteri Düzenleme Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Müşteri Düzenle</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Ad</Form.Label>
                  <Form.Control
                    type="text"
                    name="firstname"
                    value={formData.firstname}
                    onChange={handleInputChange}
                    isInvalid={!!validationErrors.firstname}
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.firstname}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Soyad</Form.Label>
                  <Form.Control
                    type="text"
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleInputChange}
                    isInvalid={!!validationErrors.lastname}
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.lastname}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>E-posta</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                isInvalid={!!validationErrors.email}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.email}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Telefon</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                isInvalid={!!validationErrors.phone}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.phone}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Adres</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                isInvalid={!!validationErrors.address}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.address}
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            İptal
          </Button>
          <Button variant="primary" onClick={handleUpdateCustomer} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : "Güncelle"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Müşteri Silme Onay Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Müşteri Sil</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentCustomer && (
            <p>
              <strong>{currentCustomer.fullname}</strong> isimli müşteriyi silmek istediğinize emin misiniz?
              Bu işlem geri alınamaz.
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            İptal
          </Button>
          <Button variant="danger" onClick={handleDeleteCustomer} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : "Sil"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Customers; 