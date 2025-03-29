import React, { useRef, useState, useEffect } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { FaFilePdf } from 'react-icons/fa';
import './OfferPDF.css';
import offerTemplateService from '../services/offerTemplateService';
import { toast } from 'react-toastify';

const OfferPDF = ({ offer, customer, offerItems, products }) => {
  const printRef = useRef();
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        setLoading(true);
        const templateData = await offerTemplateService.getDefaultTemplate();
        setTemplate(templateData);
      } catch (error) {
        toast.error(error.message || 'Şablon yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, []);

  const handlePrint = () => {
    if (!template) {
      toast.error('Şablon yüklenemedi. Lütfen tekrar deneyin.');
      return;
    }

    // Yeni bir iframe oluştur
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    
    // iframe içeriğini hazırla
    const iframeWindow = iframe.contentWindow;
    const iframeDocument = iframeWindow.document;
    
    // CSS stillerini ekle
    const style = document.createElement('style');
    style.textContent = `
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 20px;
      }
      .offer-pdf {
        max-width: 210mm;
        margin: 0 auto;
        background-color: white;
      }
      .offer-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        padding-bottom: 10px;
        border-bottom: 2px solid #f0f0f0;
      }
      .logo h1 {
        font-size: 28px;
        font-weight: bold;
        margin: 0;
        color: ${template.primaryColor || '#0099cc'};
      }
      .logo .solar {
        color: ${template.secondaryColor || '#ffa500'};
      }
      .logo p {
        margin: 0;
        font-size: 12px;
        color: #666;
      }
      .offer-type {
        text-align: right;
      }
      .offer-type h2 {
        font-size: 20px;
        margin: 0;
        color: #333;
      }
      .offer-type h3 {
        font-size: 16px;
        margin: 5px 0 0;
        color: #666;
      }
      .offer-info {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
      }
      .customer-info, .offer-details {
        width: 48%;
      }
      .customer-info h4, .offer-details h4 {
        font-size: 16px;
        margin-top: 0;
        margin-bottom: 10px;
        padding-bottom: 5px;
        border-bottom: 1px solid #eee;
      }
      .customer-info p {
        margin: 5px 0;
        font-size: 14px;
      }
      .offer-details table {
        width: 100%;
        border-collapse: collapse;
      }
      .offer-details td {
        padding: 5px;
        font-size: 14px;
      }
      .offer-details td:first-child {
        font-weight: bold;
        width: 40%;
      }
      .offer-note {
        font-style: italic;
        margin: 15px 0;
        font-size: 14px;
      }
      .offer-items table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
      }
      .offer-items th {
        background-color: #f8f8f8;
        padding: 10px;
        text-align: left;
        font-size: 14px;
        border: 1px solid #ddd;
      }
      .offer-items td {
        padding: 10px;
        font-size: 14px;
        border: 1px solid #ddd;
      }
      .offer-total {
        text-align: right;
        margin: 20px 0;
        font-size: 16px;
      }
      .offer-total strong {
        font-size: 18px;
      }
      .offer-terms {
        margin: 20px 0;
        padding: 15px 0;
        border-top: 1px solid #eee;
        border-bottom: 1px solid #eee;
      }
      .offer-terms p {
        margin: 5px 0;
        font-size: 12px;
        text-align: center;
      }
      .offer-footer {
        margin-top: 30px;
        text-align: center;
      }
      .company-info h2 {
        font-size: 20px;
        margin: 0;
        color: ${template.primaryColor || '#0099cc'};
      }
      .company-info .solar {
        color: ${template.secondaryColor || '#ffa500'};
      }
      .company-info p {
        margin: 3px 0;
        font-size: 12px;
        color: #666;
      }
      .partners {
        display: flex;
        justify-content: space-around;
        margin-top: 20px;
      }
      .partner {
        font-size: 16px;
        font-weight: bold;
      }
    `;
    
    // Format date to Turkish locale
    const formatDate = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('tr-TR');
    };
    
    // HTML içeriğini oluştur
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${template.companyName || 'SANEL SOLAR'} - Teklif #${offer?.offerId || ''}</title>
          <meta charset="utf-8">
        </head>
        <body>
          <div class="offer-pdf">
            <div class="offer-header" style="background-color: ${template.headerBgColor || '#ffffff'}">
              <div class="logo">
                <h1>${template.companyName?.split(' ')[0] || 'SANEL'}<span class="solar">${template.companyName?.split(' ').slice(1).join(' ') || 'SOLAR'}</span></h1>
                <p>${template.companyTagline || 'ENERJİ TEKNOLOJİLERİ'}</p>
              </div>
              <div class="offer-type">
                <h2>${template.offerTitle || 'Ticari Teklif'}</h2>
                <h3>${template.offerSubtitle || 'LiFePO₄ Batarya'}</h3>
              </div>
            </div>

            <div class="offer-info">
              <div class="customer-info">
                <h4>${template.customerTitle || 'Müşteri Bilgileri'}</h4>
                <p><strong>Sayın ${customer?.fullname || ''}</strong></p>
                ${template.showCustomerPhone ? `<p>${customer?.phone || ''}</p>` : ''}
                ${template.showCustomerAddress ? `<p>${customer?.address || ''}</p>` : ''}
                <p>${template.deliveryTimeText || 'Ürünlerin teslim süresi siparişten itibaren 7-10 iş günüdür.'}</p>
              </div>
              <div class="offer-details">
                <h4>${template.offerInfoTitle || 'Teklif Bilgileri'}</h4>
                <table>
                  <tbody>
                    <tr>
                      <td>Tarih</td>
                      <td>${formatDate(offer?.offerDate)}</td>
                    </tr>
                    <tr>
                      <td>Referans No</td>
                      <td>${offer?.referenceNumber || ''}</td>
                    </tr>
                    <tr>
                      <td>Opsiyon</td>
                      <td>${formatDate(offer?.validUntil)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <p class="offer-note">${template.offerNoteText || 'Teklifimize işçilik, montaj, devreye alma dahildir.'}</p>

            <div class="offer-items">
              <table>
                <thead>
                  <tr>
                    <th>Ürün / Hizmet Adı</th>
                    <th>Miktar</th>
                    ${template.showUnitPrices ? '<th>Birim</th>' : ''}
                    <th>Marka</th>
                    ${template.showUnitPrices ? '<th>Birim Fiyat (USD)</th>' : ''}
                    ${template.showTotalPrices ? '<th>Toplam (USD)</th>' : ''}
                  </tr>
                </thead>
                <tbody>
                  ${offerItems?.map((item, index) => {
                    const product = products?.find(p => p.productId === item.productId);
                    return `
                      <tr>
                        <td>${product?.name || ''}</td>
                        <td>${item.quantity || ''}</td>
                        ${template.showUnitPrices ? `<td>${product?.unit || ''}</td>` : ''}
                        <td>${product?.brand || ''}</td>
                        ${template.showUnitPrices ? `<td>$${item.unitPriceUSD?.toFixed(2) || '0.00'}</td>` : ''}
                        ${template.showTotalPrices ? `<td>$${item.totalUSD?.toFixed(2) || '0.00'}</td>` : ''}
                      </tr>
                    `;
                  }).join('') || ''}
                </tbody>
              </table>
            </div>

            ${template.showTotalPrices ? `
            <div class="offer-total">
              <p>KDV HARİÇ TOP. FİYAT: <strong>₺${offer?.totalAmountTRY?.toFixed(2) || '0.00'}</strong></p>
            </div>
            ` : ''}

            <div class="offer-terms">
              ${template.termsAndConditions?.map(term => `<p>${term}</p>`).join('') || `
                <p>ÖDEME İLE BİRLİKTE SİPARİŞ İŞLEME ALINACAKTIR.</p>
                <p>KREDİ KARTI İLE ÖDEMELERDE 12 AYA VARAN TAKSİT İMKANIMIZ BULUNMAKTADIR.</p>
                <p>KREDİ KARTI İLE OLAN ÖDEMELERDE KOMİSYON FARKI UYGULANMAKTADIR.</p>
                <p>OPSİYON SÜRESİ İÇERİSİNDE DÖNÜŞÜ OLMAYAN TEKLİFLERİMİZ İÇİN FİYAT REVİZE HAKKIMIZ SAKLIDIR</p>
              `}
            </div>

            <div class="offer-footer" style="background-color: ${template.footerBgColor || '#ffffff'}">
              <div class="company-info">
                <h2>${template.footerCompanyName?.split(' ')[0] || 'SANEL'}<span class="solar">${template.footerCompanyName?.split(' ').slice(1).join(' ') || 'SOLAR'}</span></h2>
                <p>${template.footerCompanyTagline || 'ENERJİ TEKNOLOJİLERİ'}</p>
                <p>Adres: ${template.footerAddress || 'YAVUZ SULTAN MAHALLESİ HÜRRİYET CADDESİ NO:349'}</p>
                <p>${template.footerCity || 'DERİNCE / KOCAELİ'}</p>
                <p>${template.footerPhone || '0 532 420 91 21'}</p>
                <p>${template.footerTaxInfo || 'DERİNCE V.D. / 336 056 4577'}</p>
                <p>${template.footerWebsite || 'www.sanelsolar.com.tr'} | ${template.footerEmail || 'info@sanelsolar.com.tr'}</p>
              </div>
              <div class="partners">
                ${template.partners?.map(partner => `<div class="partner">${partner.partnerName}</div>`).join('') || `
                  <div class="partner">LEXRON</div>
                  <div class="partner">solinv</div>
                  <div class="partner">MOTECH</div>
                `}
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
    
    // iframe içeriğini ayarla
    iframeDocument.open();
    iframeDocument.write(html);
    iframeDocument.head.appendChild(style);
    iframeDocument.close();
    
    // Yazdırma işlemini başlat
    setTimeout(() => {
      iframeWindow.focus();
      iframeWindow.print();
      
      // Yazdırma işlemi tamamlandıktan sonra iframe'i kaldır
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 500);
    }, 500);
  };

  // Format date to Turkish locale
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR');
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center my-3">
        <Spinner animation="border" variant="primary" />
        <span className="ms-2">Şablon yükleniyor...</span>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="alert alert-warning">
        Teklif şablonu yüklenemedi. Lütfen daha sonra tekrar deneyin.
      </div>
    );
  }

  return (
    <div>
      <Button variant="primary" onClick={handlePrint} className="mb-3">
        <FaFilePdf className="me-2" /> PDF Çıktısı Al
      </Button>

      <div ref={printRef} className="offer-pdf d-none">
        {/* Bu div sadece referans için tutulacak, asıl içerik iframe içerisinde oluşturulacak */}
      </div>
    </div>
  );
};

export default OfferPDF; 