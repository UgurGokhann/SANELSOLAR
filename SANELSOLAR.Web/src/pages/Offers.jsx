import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Table, Button, Card, Row, Col, Form, InputGroup, Badge, Modal, Spinner } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaFilter, FaEye } from 'react-icons/fa';
import { toast } from 'react-toastify';
import offerService from '../services/offerService';
import customerService from '../services/customerService';

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCustomerId, setFilterCustomerId] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [offerToDelete, setOfferToDelete] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchOffers();
    fetchCustomers();
  }, []);

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const data = await offerService.getAllOffers();
      setOffers(data);
    } catch (error) {
      toast.error(error.message || 'Teklifler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const data = await customerService.getAllCustomers();
      setCustomers(data);
    } catch (error) {
      toast.error('Müşteriler yüklenirken bir hata oluştu');
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterCustomerChange = (e) => {
    setFilterCustomerId(e.target.value);
  };

  const handleFilterStatusChange = (e) => {
    setFilterStatus(e.target.value);
  };

  const handleFilterStartDateChange = (e) => {
    setFilterStartDate(e.target.value);
  };

  const handleFilterEndDateChange = (e) => {
    setFilterEndDate(e.target.value);
  };

  const applyFilters = async () => {
    setLoading(true);
    try {
      const filters = {};
      
      if (filterCustomerId) {
        filters.customerId = filterCustomerId;
      }
      
      if (filterStatus) {
        filters.status = filterStatus;
      }
      
      if (filterStartDate) {
        filters.startDate = new Date(filterStartDate).toISOString();
      }
      
      if (filterEndDate) {
        filters.endDate = new Date(filterEndDate).toISOString();
      }
      
      const filteredOffers = await offerService.getAllOffers(filters);
      setOffers(filteredOffers);
    } catch (error) {
      toast.error('Filtreleme sırasında bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setFilterCustomerId('');
    setFilterStatus('');
    setFilterStartDate('');
    setFilterEndDate('');
    fetchOffers();
  };

  const confirmDelete = (offer) => {
    setOfferToDelete(offer);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!offerToDelete) return;

    try {
      await offerService.deleteOffer(offerToDelete.offerId);
      toast.success('Teklif başarıyla silindi');
      fetchOffers();
    } catch (error) {
      toast.error(error.message || 'Teklif silinirken bir hata oluştu');
    } finally {
      setShowDeleteModal(false);
      setOfferToDelete(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Beklemede':
        return <Badge bg="warning">Beklemede</Badge>;
      case 'Onaylandı':
        return <Badge bg="success">Onaylandı</Badge>;
      case 'Reddedildi':
        return <Badge bg="danger">Reddedildi</Badge>;
      case 'Tamamlandı':
        return <Badge bg="info">Tamamlandı</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  const filteredOffers = offers.filter(offer => {
    const customerName = offer.customerName?.toLowerCase() || '';
    const offerIdStr = offer.offerId.toString();
    const searchLower = searchTerm.toLowerCase();
    
    return customerName.includes(searchLower) || offerIdStr.includes(searchLower);
  });

  return (
    <div className="container-fluid mt-4">
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h3>Teklifler</h3>
          <Link to="/offers/new">
            <Button variant="primary">
              <FaPlus className="me-2" /> Yeni Teklif
            </Button>
          </Link>
        </Card.Header>
        <Card.Body>
          <Row className="mb-3">
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text>
                  <FaSearch />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Müşteri adı veya teklif numarası ile ara..."
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </InputGroup>
            </Col>
            <Col md={6} className="text-end">
              <Button 
                variant="outline-secondary" 
                onClick={() => setShowFilters(!showFilters)}
                className="me-2"
              >
                <FaFilter className="me-2" /> Filtreler
              </Button>
              <Button variant="outline-primary" onClick={resetFilters}>
                Filtreleri Temizle
              </Button>
            </Col>
          </Row>

          {showFilters && (
            <Card className="mb-3">
              <Card.Body>
                <Row>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Müşteri</Form.Label>
                      <Form.Select
                        value={filterCustomerId}
                        onChange={handleFilterCustomerChange}
                      >
                        <option value="">Tüm Müşteriler</option>
                        {customers.map(customer => (
                          <option key={customer.customerId} value={customer.customerId}>
                            {customer.fullname}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Durum</Form.Label>
                      <Form.Select
                        value={filterStatus}
                        onChange={handleFilterStatusChange}
                      >
                        <option value="">Tüm Durumlar</option>
                        <option value="Beklemede">Beklemede</option>
                        <option value="Onaylandı">Onaylandı</option>
                        <option value="Reddedildi">Reddedildi</option>
                        <option value="Tamamlandı">Tamamlandı</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Başlangıç Tarihi</Form.Label>
                      <Form.Control
                        type="date"
                        value={filterStartDate}
                        onChange={handleFilterStartDateChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Bitiş Tarihi</Form.Label>
                      <Form.Control
                        type="date"
                        value={filterEndDate}
                        onChange={handleFilterEndDateChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <div className="text-end">
                  <Button variant="primary" onClick={applyFilters}>
                    Filtrele
                  </Button>
                </div>
              </Card.Body>
            </Card>
          )}

          {loading ? (
            <div className="text-center my-5">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Yükleniyor...</span>
              </Spinner>
            </div>
          ) : (
            <Table responsive striped hover>
              <thead>
                <tr>
                  <th>Teklif No</th>
                  <th>Müşteri</th>
                  <th>Teklif Tarihi</th>
                  <th>Geçerlilik Tarihi</th>
                  <th>Toplam (USD)</th>
                  <th>Toplam (TRY)</th>
                  <th>Durum</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filteredOffers.length > 0 ? (
                  filteredOffers.map(offer => (
                    <tr key={offer.offerId}>
                      <td>{offer.offerId}</td>
                      <td>{offer.customerName}</td>
                      <td>{new Date(offer.offerDate).toLocaleDateString('tr-TR')}</td>
                      <td>{new Date(offer.validUntil).toLocaleDateString('tr-TR')}</td>
                      <td>${offer.totalAmountUSD.toFixed(2)}</td>
                      <td>₺{offer.totalAmountTRY.toFixed(2)}</td>
                      <td>{getStatusBadge(offer.status)}</td>
                      <td>
                        <Link to={`/offers/${offer.offerId}`} className="btn btn-sm btn-info me-1">
                          <FaEye />
                        </Link>
                        <Link to={`/offers/edit/${offer.offerId}`} className="btn btn-sm btn-warning me-1">
                          <FaEdit />
                        </Link>
                        <Button 
                          variant="danger" 
                          size="sm" 
                          onClick={() => confirmDelete(offer)}
                        >
                          <FaTrash />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center">
                      Teklif bulunamadı
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Teklifi Sil</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {offerToDelete && (
            <p>
              <strong>{offerToDelete.customerName}</strong> müşterisine ait <strong>#{offerToDelete.offerId}</strong> numaralı teklifi silmek istediğinize emin misiniz?
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            İptal
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Sil
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Offers; 