import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Row, Col, Button, Spinner } from 'react-bootstrap';
import { FaArrowLeft, FaEdit } from 'react-icons/fa';
import { toast } from 'react-toastify';
import offerService from '../services/offerService';
import customerService from '../services/customerService';
import productService from '../services/productService';
import OfferPDF from '../components/OfferPDF';

const OfferDetail = () => {
  const { id } = useParams();
  const [offer, setOffer] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [offerItems, setOfferItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOfferData = async () => {
      setLoading(true);
      try {
        // Fetch offer details
        const offerData = await offerService.getOfferById(id);
        setOffer(offerData);

        // Fetch customer details
        if (offerData.customerId) {
          const customerData = await customerService.getCustomerById(offerData.customerId);
          setCustomer(customerData);
        }

        // Fetch offer items
        if (offerData.offerItems && offerData.offerItems.length > 0) {
          setOfferItems(offerData.offerItems);
          
          // Get all product IDs from offer items
          const productIds = offerData.offerItems.map(item => item.productId);
          
          // Fetch all products
          const allProducts = await productService.getAllProducts();
          
          // Filter products to only include those in the offer
          const offerProducts = allProducts.filter(product => 
            productIds.includes(product.productId)
          );
          
          setProducts(offerProducts);
        }
      } catch (error) {
        toast.error('Teklif bilgileri yüklenirken bir hata oluştu');
        console.error('Error fetching offer data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOfferData();
  }, [id]);

  // Format date to Turkish locale
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR');
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Yükleniyor...</span>
        </Spinner>
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="container mt-4">
        <Card>
          <Card.Body className="text-center">
            <h3>Teklif bulunamadı</h3>
            <Link to="/offers" className="btn btn-primary mt-3">
              <FaArrowLeft className="me-2" /> Tekliflere Dön
            </Link>
          </Card.Body>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h3>Teklif #{offer.offerId}</h3>
          <div>
            <Link to="/offers" className="btn btn-secondary me-2">
              <FaArrowLeft className="me-2" /> Geri
            </Link>
            <Link to={`/offers/edit/${offer.offerId}`} className="btn btn-warning">
              <FaEdit className="me-2" /> Düzenle
            </Link>
          </div>
        </Card.Header>
        <Card.Body>
          <Row className="mb-4">
            <Col md={6}>
              <h5>Müşteri Bilgileri</h5>
              <p><strong>Müşteri:</strong> {customer?.fullname}</p>
              <p><strong>Telefon:</strong> {customer?.phone}</p>
              <p><strong>E-posta:</strong> {customer?.email}</p>
              <p><strong>Adres:</strong> {customer?.address}</p>
            </Col>
            <Col md={6}>
              <h5>Teklif Bilgileri</h5>
              <p><strong>Teklif Tarihi:</strong> {formatDate(offer.offerDate)}</p>
              <p><strong>Geçerlilik Tarihi:</strong> {formatDate(offer.validUntil)}</p>
              <p><strong>Referans No:</strong> {offer.referenceNumber}</p>
              <p><strong>Durum:</strong> {offer.status}</p>
            </Col>
          </Row>

          <h5>Teklif Kalemleri</h5>
          <div className="table-responsive mb-4">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Ürün</th>
                  <th>Miktar</th>
                  <th>Birim Fiyat (USD)</th>
                  <th>Toplam (USD)</th>
                  <th>Toplam (TRY)</th>
                </tr>
              </thead>
              <tbody>
                {offerItems.map((item, index) => {
                  const product = products.find(p => p.productId === item.productId);
                  return (
                    <tr key={index}>
                      <td>{product?.name || 'Bilinmeyen Ürün'}</td>
                      <td>{item.quantity}</td>
                      <td>${item.unitPriceUSD?.toFixed(2)}</td>
                      <td>${item.totalUSD?.toFixed(2)}</td>
                      <td>₺{item.totalTRY?.toFixed(2)}</td>
                    </tr>
                  );
                })}
                <tr className="table-active fw-bold">
                  <td colSpan="3" className="text-end">Toplam:</td>
                  <td>${offer.totalAmountUSD?.toFixed(2)}</td>
                  <td>₺{offer.totalAmountTRY?.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {offer.notes && (
            <div className="mb-4">
              <h5>Notlar</h5>
              <p>{offer.notes}</p>
            </div>
          )}

          <div className="mt-4">
            <h5>PDF Çıktısı</h5>
            <OfferPDF 
              offer={offer} 
              customer={customer} 
              offerItems={offerItems} 
              products={products} 
            />
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default OfferDetail; 