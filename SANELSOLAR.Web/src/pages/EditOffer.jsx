import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Card, Form, Button, Row, Col, Table, InputGroup, Spinner } from 'react-bootstrap';
import { FaPlus, FaTrash, FaSave, FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';
import offerService from '../services/offerService';
import customerService from '../services/customerService';
import productService from '../services/productService';
import categoryService from '../services/categoryService';

const EditOffer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [exchangeRate, setExchangeRate] = useState(0);
  const [profitMargin, setProfitMargin] = useState(30); // Default profit margin of 30%
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [installationAddress, setInstallationAddress] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [validUntil, setValidUntil] = useState('');
  const [notes, setNotes] = useState('');
  const [offerItems, setOfferItems] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [totalAmountUSD, setTotalAmountUSD] = useState(0);
  const [totalAmountTRY, setTotalAmountTRY] = useState(0);
  const [offerDate, setOfferDate] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetchInitialData();
  }, [id]);

  useEffect(() => {
    calculateTotals();
  }, [offerItems, exchangeRate, profitMargin]);

  useEffect(() => {
    if (exchangeRate > 0 && offerItems.length > 0) {
      const updatedItems = offerItems.map(item => ({
        ...item,
        totalTRY: calculateTRYAmount(item.totalUSD)
      }));
      setOfferItems(updatedItems);
    }
  }, [exchangeRate, profitMargin]);

  useEffect(() => {
    if (selectedCategory) {
      fetchProductsByCategory(selectedCategory);
    } else {
      setFilteredProducts(products);
    }
  }, [selectedCategory, products]);

  // Helper function to calculate TRY amount with profit margin
  const calculateTRYAmount = (usdAmount) => {
    const profitMultiplier = 1 + (profitMargin / 100);
    return usdAmount * exchangeRate * profitMultiplier;
  };

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      // Fetch offer data
      const offerData = await offerService.getOfferById(id);
      
      // Fetch customers
      const customersData = await customerService.getAllCustomers();
      setCustomers(customersData);

      // Fetch categories
      const categoriesData = await categoryService.getAllCategories();
      setCategories(categoriesData);

      // Fetch products
      const productsData = await productService.getAllProducts();
      setProducts(productsData);
      setFilteredProducts(productsData);

      // Set offer data
      setSelectedCustomer(offerData.customerId.toString());
      setValidUntil(new Date(offerData.validUntil).toISOString().split('T')[0]);
      
      // Use the exchange rate from the offer data, or fetch current if not available
      if (offerData.exchangeRate) {
        setExchangeRate(offerData.exchangeRate);
      } else {
        try {
          const rateData = await offerService.getCurrentExchangeRate();
          setExchangeRate(rateData.rate || 36.5);
        } catch (rateError) {
          console.warn("Error fetching exchange rate:", rateError);
          setExchangeRate(36.5); // Default fallback value
          toast.warning("Döviz kuru alınamadı, varsayılan değer kullanılıyor.");
        }
      }
      
      setNotes(offerData.notes || '');
      setReferenceNumber(offerData.referenceNumber || `STS-${Math.floor(Math.random() * 10000000).toString().padStart(7, '0')}`);
      setOfferDate(new Date(offerData.offerDate).toISOString().split('T')[0]);
      setStatus(offerData.status || 'Beklemede');

      // Find customer and set installation address
      const customer = customersData.find(c => c.customerId === offerData.customerId);
      if (customer) {
        setInstallationAddress(customer.address || '');
      }

      // Set offer items
      if (offerData.offerItems && offerData.offerItems.length > 0) {
        const mappedItems = offerData.offerItems.map(item => {
          const product = productsData.find(p => p.productId === item.productId);
          return {
            id: item.offerItemId,
            offerItemId: item.offerItemId,
            productId: item.productId.toString(),
            productName: product ? product.name : 'Ürün',
            quantity: item.quantity,
            unitPriceUSD: item.unitPriceUSD,
            totalUSD: item.quantity * item.unitPriceUSD,
            totalTRY: calculateTRYAmount(item.quantity * item.unitPriceUSD),
            unit: product ? product.unit : 'Adet',
            brand: product ? product.brand : 'SANEL SOLAR'
          };
        });
        setOfferItems(mappedItems);
      }
    } catch (error) {
      toast.error('Teklif verileri yüklenirken bir hata oluştu');
      navigate('/offers');
    } finally {
      setLoading(false);
    }
  };

  const fetchProductsByCategory = async (categoryId) => {
    try {
      if (categoryId) {
        const categoryProducts = await productService.getProductsByCategory(categoryId);
        setFilteredProducts(categoryProducts);
      } else {
        setFilteredProducts(products);
      }
    } catch (error) {
      toast.error('Kategoriye göre ürünler yüklenirken bir hata oluştu');
      setFilteredProducts(products);
    }
  };

  const handleCustomerChange = (e) => {
    const customerId = e.target.value;
    setSelectedCustomer(customerId);
    
    // Find customer and set installation address
    const customer = customers.find(c => c.customerId.toString() === customerId);
    if (customer) {
      setInstallationAddress(customer.address || '');
    } else {
      setInstallationAddress('');
    }
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setSelectedProduct('');
  };

  const handleProductChange = (e) => {
    setSelectedProduct(e.target.value);
  };

  const handleRemoveItem = (id) => {
    setOfferItems(offerItems.filter(item => item.id !== id));
  };

  const handleItemChange = (id, field, value) => {
    const updatedItems = offerItems.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        // Recalculate totals if quantity or price changes
        if (field === 'quantity' || field === 'unitPriceUSD') {
          updatedItem.totalUSD = updatedItem.quantity * updatedItem.unitPriceUSD;
          updatedItem.totalTRY = calculateTRYAmount(updatedItem.totalUSD);
        }
        
        return updatedItem;
      }
      return item;
    });
    
    setOfferItems(updatedItems);
  };

  const calculateTotals = () => {
    const totalUSD = offerItems.reduce((sum, item) => sum + (item.totalUSD || 0), 0);
    const totalTRY = offerItems.reduce((sum, item) => sum + (item.totalTRY || 0), 0);
    
    setTotalAmountUSD(totalUSD);
    setTotalAmountTRY(totalTRY);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedCustomer) {
      toast.warning('Lütfen bir müşteri seçin');
      return;
    }

    if (!validUntil) {
      toast.warning('Lütfen geçerlilik tarihi girin');
      return;
    }

    if (offerItems.length === 0 || (offerItems.length === 1 && !offerItems[0].productId)) {
      toast.warning('Lütfen en az bir ürün ekleyin');
      return;
    }

    setSubmitting(true);
    
    try {
      // Prepare offer data
      const offerData = {
        offerId: parseInt(id),
        customerId: parseInt(selectedCustomer),
        userId: 1, // Current user ID (should be dynamic in a real app)
        offerDate: new Date(offerDate).toISOString(),
        validUntil: new Date(validUntil).toISOString(),
        exchangeRate: parseFloat(exchangeRate),
        notes: notes,
        totalAmountUSD: totalAmountUSD,
        totalAmountTRY: totalAmountTRY,
        status: status,
        offerItems: offerItems.filter(item => item.productId).map(item => ({
          offerItemId: item.offerItemId || 0,
          offerId: parseInt(id),
          productId: parseInt(item.productId),
          quantity: parseInt(item.quantity),
          unitPriceUSD: parseFloat(item.unitPriceUSD),
          totalPriceUSD: parseFloat(item.totalUSD),
          totalPriceTRY: parseFloat(item.totalTRY)
        }))
      };

      await offerService.updateOffer(offerData);
      toast.success('Teklif başarıyla güncellendi');
      navigate('/offers');
    } catch (error) {
      toast.error(error.message || 'Teklif güncellenirken bir hata oluştu');
    } finally {
      setSubmitting(false);
    }
  };

  const handleExchangeRateChange = (e) => {
    const newRate = parseFloat(e.target.value);
    if (!isNaN(newRate) && newRate > 0) {
      setExchangeRate(newRate);
    }
  };

  const handleProfitMarginChange = (e) => {
    const newMargin = parseFloat(e.target.value);
    if (!isNaN(newMargin) && newMargin >= 0) {
      setProfitMargin(newMargin);
    }
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

  return (
    <div className="container-fluid mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Teklif Düzenle #{id}</h2>
        <Link to="/offers" className="btn btn-secondary">
          <FaArrowLeft className="me-2" /> Tekliflere Dön
        </Link>
      </div>

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Card className="mb-4">
              <Card.Header>
                <h5>Müşteri Bilgileri</h5>
              </Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Müşteri</Form.Label>
                  <Form.Select 
                    value={selectedCustomer} 
                    onChange={handleCustomerChange}
                    required
                  >
                    <option value="">Müşteri Seçin</option>
                    {customers.map(customer => (
                      <option key={customer.customerId} value={customer.customerId}>
                        {customer.fullname} - {customer.phone}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Kurulum Adresi</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={installationAddress}
                    onChange={(e) => setInstallationAddress(e.target.value)}
                  />
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="mb-4">
              <Card.Header>
                <h5>Teklif Detayları</h5>
              </Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Referans Numarası</Form.Label>
                  <Form.Control
                    type="text"
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                    readOnly
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Teklif Tarihi</Form.Label>
                  <Form.Control
                    type="date"
                    value={offerDate}
                    onChange={(e) => setOfferDate(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Geçerlilik Tarihi</Form.Label>
                  <Form.Control
                    type="date"
                    value={validUntil}
                    onChange={(e) => setValidUntil(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Döviz Kuru (USD to TRY)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    value={exchangeRate}
                    onChange={handleExchangeRateChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Kar Oranı (%)</Form.Label>
                  <Form.Control
                    type="number"
                    step="1"
                    min="0"
                    value={profitMargin}
                    onChange={handleProfitMarginChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Durum</Form.Label>
                  <Form.Select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    required
                  >
                    <option value="Beklemede">Beklemede</option>
                    <option value="Onaylandı">Onaylandı</option>
                    <option value="Reddedildi">Reddedildi</option>
                    <option value="Tamamlandı">Tamamlandı</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Notlar</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Notlar girin..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Card className="mb-4">
          <Card.Header>
            <h5>Teklif Kalemleri</h5>
          </Card.Header>
          <Card.Body>
            <div className="mb-3">
              <Form.Group>
                <Form.Label>Kategori Seçin</Form.Label>
                <Form.Select
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  style={{ maxWidth: '300px' }}
                >
                  <option value="">Tüm Kategoriler</option>
                  {categories.map(category => (
                    <option key={category.categoryId} value={category.categoryId}>
                      {category.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </div>
            
            <Table responsive striped bordered>
              <thead>
                <tr>
                  <th>Ürün</th>
                  <th>Miktar</th>
                  <th>Birim</th>
                  <th>Marka</th>
                  <th>Birim Fiyat (USD)</th>
                  <th>Toplam (USD)</th>
                  <th>Toplam (TRY)</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {offerItems.map(item => (
                  <tr key={item.id}>
                    <td>
                      {item.productId ? (
                        item.productName || products.find(p => p.productId.toString() === item.productId.toString())?.name || 'Ürün'
                      ) : (
                        <Form.Select
                          value={item.productId || ''}
                          onChange={(e) => {
                            const productId = e.target.value;
                            if (!productId) return;
                            
                            // Tüm ürünler içinden seçilen ürünü bul
                            const product = products.find(p => p.productId.toString() === productId);
                            if (product) {
                              console.log("Seçilen ürün:", product);
                              console.log("Güncellenecek satır ID:", item.id);
                              
                              // Ürünün listede olup olmadığını kontrol et
                              const existingItemIndex = offerItems.findIndex(
                                existingItem => existingItem.productId === productId && existingItem.id !== item.id
                              );
                              
                              if (existingItemIndex !== -1) {
                                // Ürün zaten listede var, miktarını artır
                                const updatedItems = offerItems.map((offerItem, index) => {
                                  if (index === existingItemIndex) {
                                    const newQuantity = offerItem.quantity + 1;
                                    const totalUSD = newQuantity * offerItem.unitPriceUSD;
                                    return {
                                      ...offerItem,
                                      quantity: newQuantity,
                                      totalUSD: totalUSD,
                                      totalTRY: calculateTRYAmount(totalUSD)
                                    };
                                  }
                                  return offerItem;
                                });
                                
                                // Boş satırı kaldır
                                const filteredItems = updatedItems.filter(offerItem => 
                                  offerItem.id !== item.id || offerItem.productId
                                );
                                
                                console.log("Güncellenmiş satırlar:", filteredItems);
                                setOfferItems(filteredItems);
                              } else {
                                // Ürün listede yok, normal şekilde ekle
                                const updatedItems = offerItems.map(offerItem => {
                                  if (offerItem.id === item.id) {
                                    return {
                                      ...offerItem,
                                      productId: productId,
                                      productName: product.name,
                                      unitPriceUSD: product.priceUSD || 0,
                                      brand: product.brand || 'SANEL SOLAR',
                                      unit: product.unit || 'Adet',
                                      totalUSD: offerItem.quantity * (product.priceUSD || 0),
                                      totalTRY: calculateTRYAmount(offerItem.quantity * (product.priceUSD || 0))
                                    };
                                  }
                                  return offerItem;
                                });
                                
                                console.log("Güncellenmiş satırlar:", updatedItems);
                                setOfferItems(updatedItems);
                              }
                            }
                          }}
                        >
                          <option value="">Ürün Seçin</option>
                          {filteredProducts.map(product => (
                            <option key={product.productId} value={product.productId}>
                              {product.name} - ${product.priceUSD?.toFixed(2) || '0.00'}
                            </option>
                          ))}
                        </Form.Select>
                      )}
                    </td>
                    <td>
                      <Form.Control
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => {
                          const quantity = parseInt(e.target.value) || 1;
                          
                          // State'i doğrudan güncelle
                          const updatedItems = offerItems.map(offerItem => {
                            if (offerItem.id === item.id) {
                              const totalUSD = quantity * offerItem.unitPriceUSD;
                              const totalTRY = calculateTRYAmount(totalUSD);
                              
                              return {
                                ...offerItem,
                                quantity: quantity,
                                totalUSD: totalUSD,
                                totalTRY: totalTRY
                              };
                            }
                            return offerItem;
                          });
                          
                          setOfferItems(updatedItems);
                        }}
                      />
                    </td>
                    <td>{item.unit || 'Adet'}</td>
                    <td>{item.brand || 'SANEL SOLAR'}</td>
                    <td>
                      <InputGroup>
                        <InputGroup.Text>$</InputGroup.Text>
                        <Form.Control
                          type="number"
                          step="0.01"
                          value={item.unitPriceUSD}
                          onChange={(e) => {
                            const unitPriceUSD = parseFloat(e.target.value) || 0;
                            
                            // State'i doğrudan güncelle
                            const updatedItems = offerItems.map(offerItem => {
                              if (offerItem.id === item.id) {
                                const totalUSD = offerItem.quantity * unitPriceUSD;
                                const totalTRY = calculateTRYAmount(totalUSD);
                                
                                return {
                                  ...offerItem,
                                  unitPriceUSD: unitPriceUSD,
                                  totalUSD: totalUSD,
                                  totalTRY: totalTRY
                                };
                              }
                              return offerItem;
                            });
                            
                            setOfferItems(updatedItems);
                          }}
                        />
                      </InputGroup>
                    </td>
                    <td>${(item.totalUSD || 0).toFixed(2)}</td>
                    <td>₺{(item.totalTRY || 0).toFixed(2)}</td>
                    <td>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))}
                <tr className="table-active fw-bold">
                  <td colSpan="5" className="text-end">Toplam:</td>
                  <td>${totalAmountUSD.toFixed(2)}</td>
                  <td>₺{totalAmountTRY.toFixed(2)}</td>
                  <td></td>
                </tr>
              </tbody>
            </Table>
            
            <div className="mt-3 d-flex justify-content-end">
              <Button 
                variant="success" 
                onClick={() => {
                  // Yeni boş kalem ekle - ürün seçildiğinde zaten var olan ürünleri kontrol edecek
                  const newItem = { 
                    id: Date.now(), 
                    productId: '', 
                    quantity: 1, 
                    unitPriceUSD: 0, 
                    totalUSD: 0, 
                    totalTRY: 0 
                  };
                  setOfferItems([...offerItems, newItem]);
                }}
                style={{ padding: '8px 16px' }}
              >
                <FaPlus className="me-2" /> Yeni Kalem Ekle
              </Button>
            </div>
          </Card.Body>
        </Card>

        <div className="d-flex justify-content-end mb-4">
          <Button 
            variant="secondary" 
            className="me-2" 
            onClick={() => navigate('/offers')}
          >
            İptal
          </Button>
          <Button 
            variant="primary" 
            type="submit" 
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Kaydediliyor...
              </>
            ) : (
              <>
                <FaSave className="me-2" /> Değişiklikleri Kaydet
              </>
            )}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default EditOffer; 