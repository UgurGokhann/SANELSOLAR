import React, { useRef } from 'react';
import { Button } from 'react-bootstrap';
import { FaFilePdf } from 'react-icons/fa';
import './OfferPDF.css';

const OfferPDF = ({ offer, customer, offerItems, products }) => {
  const printRef = useRef();

  const handlePrint = () => {
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
        color: #0099cc;
      }
      .logo .solar {
        color: #ffa500;
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
        color: #0099cc;
      }
      .company-info .solar {
        color: #ffa500;
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
          <title>SANEL SOLAR - Teklif #${offer?.offerId || ''}</title>
          <meta charset="utf-8">
        </head>
        <body>
          <div class="offer-pdf">
            <div class="offer-header">
              <div class="logo">
                <h1>SANEL<span class="solar">SOLAR</span></h1>
                <p>ENERJİ TEKNOLOJİLERİ</p>
              </div>
              <div class="offer-type">
                <h2>Ticari Teklif</h2>
                <h3>LiFePO₄ Batarya</h3>
              </div>
            </div>

            <div class="offer-info">
              <div class="customer-info">
                <h4>Müşteri Bilgileri</h4>
                <p><strong>Sayın ${customer?.fullname || ''}</strong></p>
                <p>${customer?.phone || ''}</p>
                <p>${customer?.address || ''}</p>
                <p>Ürünlerin teslim süresi siparişten itibaren 7-10 iş günüdür.</p>
              </div>
              <div class="offer-details">
                <h4>Teklif Bilgileri</h4>
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

            <p class="offer-note">Teklifimize işçilik, montaj, devreye alma dahildir.</p>

            <div class="offer-items">
              <table>
                <thead>
                  <tr>
                    <th>Ürün / Hizmet Adı</th>
                    <th>Miktar</th>
                    <th>Birim</th>
                    <th>Marka</th>
                  </tr>
                </thead>
                <tbody>
                  ${offerItems?.map((item, index) => {
                    const product = products?.find(p => p.productId === item.productId);
                    return `
                      <tr>
                        <td>${product?.name || ''}</td>
                        <td>${item.quantity || ''}</td>
                        <td>${product?.unit || ''}</td>
                        <td>${product?.brand || ''}</td>
                      </tr>
                    `;
                  }).join('') || ''}
                </tbody>
              </table>
            </div>

            <div class="offer-total">
              <p>KDV HARİÇ TOP. FİYAT: <strong>₺${offer?.totalAmountTRY?.toFixed(2) || '0.00'}</strong></p>
            </div>

            <div class="offer-terms">
              <p>ÖDEME İLE BİRLİKTE SİPARİŞ İŞLEME ALINACAKTIR.</p>
              <p>KREDİ KARTI İLE ÖDEMELERDE 12 AYA VARAN TAKSİT İMKANIMIZ BULUNMAKTADIR.</p>
              <p>KREDİ KARTI İLE OLAN ÖDEMELERDE KOMİSYON FARKI UYGULANMAKTADIR.</p>
              <p>OPSİYON SÜRESİ İÇERİSİNDE DÖNÜŞÜ OLMAYAN TEKLİFLERİMİZ İÇİN FİYAT REVİZE HAKKIMIZ SAKLIDIR</p>
            </div>

            <div class="offer-footer">
              <div class="company-info">
                <h2>SANEL<span class="solar">SOLAR</span></h2>
                <p>ENERJİ TEKNOLOJİLERİ</p>
                <p>Adres: YAVUZ SULTAN MAHALLESİ HÜRRİYET CADDESİ NO:349</p>
                <p>DERİNCE / KOCAELİ</p>
                <p>0 532 420 91 21</p>
                <p>DERİNCE V.D. / 336 056 4577</p>
                <p>www.sanelsolar.com.tr | info@sanelsolar.com.tr</p>
              </div>
              <div class="partners">
                <div class="partner">LEXRON</div>
                <div class="partner">solinv</div>
                <div class="partner">MOTECH</div>
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

  return (
    <div>
      <Button variant="primary" onClick={handlePrint} className="mb-3">
        <FaFilePdf className="me-2" /> PDF Çıktısı Al
      </Button>

      <div ref={printRef} className="offer-pdf">
        <div className="offer-header">
          <div className="logo">
            <h1>SANEL<span className="solar">SOLAR</span></h1>
            <p>ENERJİ TEKNOLOJİLERİ</p>
          </div>
          <div className="offer-type">
            <h2>Ticari Teklif</h2>
            <h3>LiFePO₄ Batarya</h3>
          </div>
        </div>

        <div className="offer-info">
          <div className="customer-info">
            <h4>Müşteri Bilgileri</h4>
            <p><strong>Sayın {customer?.fullname}</strong></p>
            <p>{customer?.phone}</p>
            <p>{offer?.installationAddress}</p>
            <p>Ürünlerin teslim süresi siparişten itibaren 7-10 iş günüdür.</p>
          </div>
          <div className="offer-details">
            <h4>Teklif Bilgileri</h4>
            <table>
              <tbody>
                <tr>
                  <td>Tarih</td>
                  <td>{formatDate(offer?.offerDate)}</td>
                </tr>
                <tr>
                  <td>Referans No</td>
                  <td>{offer?.referenceNumber}</td>
                </tr>
                <tr>
                  <td>Opsiyon</td>
                  <td>{formatDate(offer?.validUntil)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <p className="offer-note">Teklifimize işçilik, montaj, devreye alma dahildir.</p>

        <div className="offer-items">
          <table>
            <thead>
              <tr>
                <th>Ürün / Hizmet Adı</th>
                <th>Miktar</th>
                <th>Birim</th>
                <th>Marka</th>
              </tr>
            </thead>
            <tbody>
              {offerItems?.map((item, index) => {
                const product = products?.find(p => p.productId === item.productId);
                return (
                  <tr key={index}>
                    <td>{product?.name}</td>
                    <td>{item.quantity}</td>
                    <td>{product?.unit}</td>
                    <td>{product?.brand}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="offer-total">
          <p>KDV HARİÇ TOP. FİYAT: <strong>₺{offer?.totalAmountTRY?.toFixed(2)}</strong></p>
        </div>

        <div className="offer-terms">
          <p>ÖDEME İLE BİRLİKTE SİPARİŞ İŞLEME ALINACAKTIR.</p>
          <p>KREDİ KARTI İLE ÖDEMELERDE 12 AYA VARAN TAKSİT İMKANIMIZ BULUNMAKTADIR.</p>
          <p>KREDİ KARTI İLE OLAN ÖDEMELERDE KOMİSYON FARKI UYGULANMAKTADIR.</p>
          <p>OPSİYON SÜRESİ İÇERİSİNDE DÖNÜŞÜ OLMAYAN TEKLİFLERİMİZ İÇİN FİYAT REVİZE HAKKIMIZ SAKLIDIR</p>
        </div>

        <div className="offer-footer">
          <div className="company-info">
            <h2>SANEL<span className="solar">SOLAR</span></h2>
            <p>ENERJİ TEKNOLOJİLERİ</p>
            <p>Adres: YAVUZ SULTAN MAHALLESİ HÜRRİYET CADDESİ NO:349</p>
            <p>DERİNCE / KOCAELİ</p>
            <p>0 532 420 91 21</p>
            <p>DERİNCE V.D. / 336 056 4577</p>
            <p>www.sanelsolar.com.tr | info@sanelsolar.com.tr</p>
          </div>
          <div className="partners">
            <div className="partner">LEXRON</div>
            <div className="partner">solinv</div>
            <div className="partner">MOTECH</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferPDF; 