import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Table, Button, Card, Badge, Modal, Spinner } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaStar, FaRegStar } from 'react-icons/fa';
import { toast } from 'react-toastify';
import offerTemplateService from '../services/offerTemplateService';

const OfferTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const data = await offerTemplateService.getAllTemplates();
      setTemplates(data);
    } catch (error) {
      toast.error(error.message || 'Şablonlar yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!templateToDelete) return;

    try {
      await offerTemplateService.deleteTemplate(templateToDelete.templateId);
      toast.success('Şablon başarıyla silindi');
      fetchTemplates();
    } catch (error) {
      toast.error(error.message || 'Şablon silinirken bir hata oluştu');
    } finally {
      setShowDeleteModal(false);
      setTemplateToDelete(null);
    }
  };

  const handleSetAsDefault = async (templateId) => {
    try {
      await offerTemplateService.setAsDefault(templateId);
      toast.success('Şablon varsayılan olarak ayarlandı');
      fetchTemplates();
    } catch (error) {
      toast.error(error.message || 'Şablon varsayılan olarak ayarlanırken bir hata oluştu');
    }
  };

  const confirmDelete = (template) => {
    setTemplateToDelete(template);
    setShowDeleteModal(true);
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Teklif Şablonları</h1>
        <Link to="/offer-templates/create">
          <Button variant="success">
            <FaPlus className="me-2" /> Yeni Şablon
          </Button>
        </Link>
      </div>

      <Card>
        <Card.Body>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">Şablonlar yükleniyor...</p>
            </div>
          ) : templates.length === 0 ? (
            <div className="alert alert-info">
              Henüz bir teklif şablonu oluşturulmamış. Yeni bir şablon oluşturmak için "Yeni Şablon" butonuna tıklayın.
            </div>
          ) : (
            <div className="table-responsive">
              <Table striped hover>
                <thead>
                  <tr>
                    <th style={{ width: '40px' }}>#</th>
                    <th>Adı</th>
                    <th>Açıklama</th>
                    <th>Durum</th>
                    <th style={{ width: '150px' }}>İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {templates.map((template) => (
                    <tr key={template.templateId}>
                      <td>{template.templateId}</td>
                      <td>{template.name}</td>
                      <td>{template.description}</td>
                      <td>
                        {template.isDefault ? (
                          <Badge bg="success">Varsayılan</Badge>
                        ) : (
                          <Badge bg="secondary">Normal</Badge>
                        )}
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <Link to={`/offer-templates/edit/${template.templateId}`}>
                            <Button variant="primary" size="sm">
                              <FaEdit />
                            </Button>
                          </Link>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => confirmDelete(template)}
                          >
                            <FaTrash />
                          </Button>
                          {!template.isDefault && (
                            <Button
                              variant="warning"
                              size="sm"
                              onClick={() => handleSetAsDefault(template.templateId)}
                              title="Varsayılan Yap"
                            >
                              <FaStar />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Şablonu Sil</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {templateToDelete && (
            <p>
              <strong>{templateToDelete.name}</strong> isimli şablonu silmek istediğinize emin misiniz?
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

export default OfferTemplates; 