import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Form, Button, Row, Col, Tabs, Tab, Spinner, InputGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';
import offerTemplateService from '../services/offerTemplateService';
import { FaSave, FaArrowLeft, FaPlus, FaTrash } from 'react-icons/fa';

const OfferTemplateForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [template, setTemplate] = useState({
    name: '',
    description: '',
    isDefault: false,
    
    companyName: 'SANEL SOLAR',
    companyTagline: 'ENERJİ TEKNOLOJİLERİ',
    offerTitle: 'Ticari Teklif',
    offerSubtitle: 'LiFePO₄ Batarya',
    
    customerTitle: 'Müşteri Bilgileri',
    showCustomerPhone: true,
    showCustomerAddress: true,
    deliveryTimeText: 'Ürünlerin teslim süresi siparişten itibaren 7-10 iş günüdür.',
    
    offerInfoTitle: 'Teklif Bilgileri',
    
    offerNoteText: 'Teklifimize işçilik, montaj, devreye alma dahildir.',
    
    showUnitPrices: true,
    showTotalPrices: true,
    
    footerCompanyName: 'SANEL SOLAR',
    footerCompanyTagline: 'ENERJİ TEKNOLOJİLERİ',
    footerAddress: 'YAVUZ SULTAN MAHALLESİ HÜRRİYET CADDESİ NO:349',
    footerCity: 'DERİNCE / KOCAELİ',
    footerPhone: '0 532 420 91 21',
    footerTaxInfo: 'DERİNCE V.D. / 336 056 4577',
    footerWebsite: 'www.sanelsolar.com.tr',
    footerEmail: 'info@sanelsolar.com.tr',
    
    termsAndConditions: [
      'ÖDEME İLE BİRLİKTE SİPARİŞ İŞLEME ALINACAKTIR.',
      'KREDİ KARTI İLE ÖDEMELERDE 12 AYA VARAN TAKSİT İMKANIMIZ BULUNMAKTADIR.',
      'KREDİ KARTI İLE OLAN ÖDEMELERDE KOMİSYON FARKI UYGULANMAKTADIR.',
      'OPSİYON SÜRESİ İÇERİSİNDE DÖNÜŞÜ OLMAYAN TEKLİFLERİMİZ İÇİN FİYAT REVİZE HAKKIMIZ SAKLIDIR'
    ],
    
    partners: [
      { partnerName: 'LEXRON', partnerLogo: '' },
      { partnerName: 'solinv', partnerLogo: '' },
      { partnerName: 'MOTECH', partnerLogo: '' }
    ],
    
    primaryColor: '#0099cc',
    secondaryColor: '#ffa500',
    headerBgColor: '#ffffff',
    footerBgColor: '#ffffff'
  });
  
  useEffect(() => {
    if (isEditMode) {
      fetchTemplate();
    }
  }, [id]);
  
  const fetchTemplate = async () => {
    try {
      setLoading(true);
      const data = await offerTemplateService.getTemplateById(id);
      // Default arrays if they are null
      data.termsAndConditions = data.termsAndConditions || [];
      data.partners = data.partners || [];
      setTemplate(data);
    } catch (error) {
      toast.error(error.message || 'Şablon bilgileri alınırken bir hata oluştu');
      navigate('/offer-templates');
    } finally {
      setLoading(false);
    }
  };
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTemplate(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleTermChange = (index, value) => {
    const newTerms = [...template.termsAndConditions];
    newTerms[index] = value;
    setTemplate(prev => ({
      ...prev,
      termsAndConditions: newTerms
    }));
  };
  
  const addTerm = () => {
    setTemplate(prev => ({
      ...prev,
      termsAndConditions: [...prev.termsAndConditions, '']
    }));
  };
  
  const removeTerm = (index) => {
    const newTerms = [...template.termsAndConditions];
    newTerms.splice(index, 1);
    setTemplate(prev => ({
      ...prev,
      termsAndConditions: newTerms
    }));
  };
  
  const handlePartnerChange = (index, key, value) => {
    const newPartners = [...template.partners];
    newPartners[index] = { ...newPartners[index], [key]: value };
    setTemplate(prev => ({
      ...prev,
      partners: newPartners
    }));
  };
  
  const addPartner = () => {
    setTemplate(prev => ({
      ...prev,
      partners: [...prev.partners, { partnerName: '', partnerLogo: '' }]
    }));
  };
  
  const removePartner = (index) => {
    const newPartners = [...template.partners];
    newPartners.splice(index, 1);
    setTemplate(prev => ({
      ...prev,
      partners: newPartners
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      
      if (isEditMode) {
        await offerTemplateService.updateTemplate(id, template);
        toast.success('Şablon başarıyla güncellendi');
      } else {
        await offerTemplateService.createTemplate(template);
        toast.success('Şablon başarıyla oluşturuldu');
      }
      
      navigate('/offer-templates');
    } catch (error) {
      toast.error(error.message || 'Şablon kaydedilirken bir hata oluştu');
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="container py-4 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Şablon yükleniyor...</p>
      </div>
    );
  }
  
  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>{isEditMode ? 'Şablonu Düzenle' : 'Yeni Şablon'}</h1>
        <Button variant="secondary" onClick={() => navigate('/offer-templates')}>
          <FaArrowLeft className="me-2" /> Geri
        </Button>
      </div>
      
      <Form onSubmit={handleSubmit}>
        <Card className="mb-4">
          <Card.Header>
            <h5>Genel Bilgiler</h5>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Şablon Adı</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={template.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Açıklama</Form.Label>
                  <Form.Control
                    type="text"
                    name="description"
                    value={template.description}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Varsayılan şablon olarak ayarla"
                name="isDefault"
                checked={template.isDefault}
                onChange={handleChange}
              />
            </Form.Group>
          </Card.Body>
        </Card>
        
        <Tabs defaultActiveKey="header" className="mb-4">
          <Tab eventKey="header" title="Başlık">
            <Card className="mb-4">
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Şirket Adı</Form.Label>
                      <Form.Control
                        type="text"
                        name="companyName"
                        value={template.companyName}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Şirket Sloganı</Form.Label>
                      <Form.Control
                        type="text"
                        name="companyTagline"
                        value={template.companyTagline}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Teklif Başlığı</Form.Label>
                      <Form.Control
                        type="text"
                        name="offerTitle"
                        value={template.offerTitle}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Teklif Alt Başlığı</Form.Label>
                      <Form.Control
                        type="text"
                        name="offerSubtitle"
                        value={template.offerSubtitle}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Tab>
          
          <Tab eventKey="customer" title="Müşteri Bilgileri">
            <Card className="mb-4">
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Müşteri Bilgileri Başlığı</Form.Label>
                  <Form.Control
                    type="text"
                    name="customerTitle"
                    value={template.customerTitle}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Müşteri telefonunu göster"
                    name="showCustomerPhone"
                    checked={template.showCustomerPhone}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Müşteri adresini göster"
                    name="showCustomerAddress"
                    checked={template.showCustomerAddress}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Teslimat Süresi Metni</Form.Label>
                  <Form.Control
                    type="text"
                    name="deliveryTimeText"
                    value={template.deliveryTimeText}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Card.Body>
            </Card>
          </Tab>
          
          <Tab eventKey="offerInfo" title="Teklif Bilgileri">
            <Card className="mb-4">
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Teklif Bilgileri Başlığı</Form.Label>
                  <Form.Control
                    type="text"
                    name="offerInfoTitle"
                    value={template.offerInfoTitle}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Teklif Notu</Form.Label>
                  <Form.Control
                    type="text"
                    name="offerNoteText"
                    value={template.offerNoteText}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Card.Body>
            </Card>
          </Tab>
          
          <Tab eventKey="items" title="Ürün Tablosu">
            <Card className="mb-4">
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Birim fiyatları göster"
                    name="showUnitPrices"
                    checked={template.showUnitPrices}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Toplam fiyatları göster"
                    name="showTotalPrices"
                    checked={template.showTotalPrices}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Card.Body>
            </Card>
          </Tab>
          
          <Tab eventKey="terms" title="Şartlar ve Koşullar">
            <Card className="mb-4">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5>Şartlar ve Koşullar</h5>
                <Button variant="success" size="sm" onClick={addTerm}>
                  <FaPlus className="me-1" /> Yeni Ekle
                </Button>
              </Card.Header>
              <Card.Body>
                {template.termsAndConditions.map((term, index) => (
                  <InputGroup className="mb-3" key={index}>
                    <Form.Control
                      type="text"
                      value={term}
                      onChange={(e) => handleTermChange(index, e.target.value)}
                    />
                    <Button variant="danger" onClick={() => removeTerm(index)}>
                      <FaTrash />
                    </Button>
                  </InputGroup>
                ))}
              </Card.Body>
            </Card>
          </Tab>
          
          <Tab eventKey="partners" title="İş Ortakları">
            <Card className="mb-4">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5>İş Ortakları</h5>
                <Button variant="success" size="sm" onClick={addPartner}>
                  <FaPlus className="me-1" /> Yeni Ekle
                </Button>
              </Card.Header>
              <Card.Body>
                {template.partners.map((partner, index) => (
                  <Row className="mb-3" key={index}>
                    <Col>
                      <InputGroup>
                        <Form.Control
                          placeholder="Ortak Adı"
                          value={partner.partnerName}
                          onChange={(e) => handlePartnerChange(index, 'partnerName', e.target.value)}
                        />
                        <Form.Control
                          placeholder="Logo URL (opsiyonel)"
                          value={partner.partnerLogo}
                          onChange={(e) => handlePartnerChange(index, 'partnerLogo', e.target.value)}
                        />
                        <Button variant="danger" onClick={() => removePartner(index)}>
                          <FaTrash />
                        </Button>
                      </InputGroup>
                    </Col>
                  </Row>
                ))}
              </Card.Body>
            </Card>
          </Tab>
          
          <Tab eventKey="footer" title="Alt Bilgi">
            <Card className="mb-4">
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Alt Bilgi Şirket Adı</Form.Label>
                      <Form.Control
                        type="text"
                        name="footerCompanyName"
                        value={template.footerCompanyName}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Alt Bilgi Şirket Sloganı</Form.Label>
                      <Form.Control
                        type="text"
                        name="footerCompanyTagline"
                        value={template.footerCompanyTagline}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-3">
                  <Form.Label>Adres</Form.Label>
                  <Form.Control
                    type="text"
                    name="footerAddress"
                    value={template.footerAddress}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Şehir</Form.Label>
                      <Form.Control
                        type="text"
                        name="footerCity"
                        value={template.footerCity}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Telefon</Form.Label>
                      <Form.Control
                        type="text"
                        name="footerPhone"
                        value={template.footerPhone}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-3">
                  <Form.Label>Vergi Bilgisi</Form.Label>
                  <Form.Control
                    type="text"
                    name="footerTaxInfo"
                    value={template.footerTaxInfo}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Web Sitesi</Form.Label>
                      <Form.Control
                        type="text"
                        name="footerWebsite"
                        value={template.footerWebsite}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>E-posta</Form.Label>
                      <Form.Control
                        type="text"
                        name="footerEmail"
                        value={template.footerEmail}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Tab>
          
          <Tab eventKey="colors" title="Renkler">
            <Card className="mb-4">
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Ana Renk</Form.Label>
                      <InputGroup>
                        <Form.Control
                          type="color"
                          name="primaryColor"
                          value={template.primaryColor}
                          onChange={handleChange}
                          className="me-2"
                        />
                        <Form.Control
                          type="text"
                          name="primaryColor"
                          value={template.primaryColor}
                          onChange={handleChange}
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>İkincil Renk</Form.Label>
                      <InputGroup>
                        <Form.Control
                          type="color"
                          name="secondaryColor"
                          value={template.secondaryColor}
                          onChange={handleChange}
                          className="me-2"
                        />
                        <Form.Control
                          type="text"
                          name="secondaryColor"
                          value={template.secondaryColor}
                          onChange={handleChange}
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Başlık Arka Plan Rengi</Form.Label>
                      <InputGroup>
                        <Form.Control
                          type="color"
                          name="headerBgColor"
                          value={template.headerBgColor}
                          onChange={handleChange}
                          className="me-2"
                        />
                        <Form.Control
                          type="text"
                          name="headerBgColor"
                          value={template.headerBgColor}
                          onChange={handleChange}
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Alt Bilgi Arka Plan Rengi</Form.Label>
                      <InputGroup>
                        <Form.Control
                          type="color"
                          name="footerBgColor"
                          value={template.footerBgColor}
                          onChange={handleChange}
                          className="me-2"
                        />
                        <Form.Control
                          type="text"
                          name="footerBgColor"
                          value={template.footerBgColor}
                          onChange={handleChange}
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Tab>
        </Tabs>
        
        <div className="d-grid">
          <Button 
            variant="primary" 
            type="submit" 
            size="lg" 
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" /> Kaydediliyor...
              </>
            ) : (
              <>
                <FaSave className="me-2" /> {isEditMode ? 'Güncelle' : 'Kaydet'}
              </>
            )}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default OfferTemplateForm; 