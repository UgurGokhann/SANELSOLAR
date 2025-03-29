import api from './api';

const getAllTemplates = async () => {
  try {
    const response = await api.get('/OfferTemplates');
    return response.data;
  } catch (error) {
    console.error('Error fetching offer templates:', error);
    throw new Error(error.response?.data?.message || 'Teklif şablonları alınırken bir hata oluştu');
  }
};

const getTemplateById = async (id) => {
  try {
    const response = await api.get(`/OfferTemplates/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching offer template with id ${id}:`, error);
    throw new Error(error.response?.data?.message || 'Teklif şablonu alınırken bir hata oluştu');
  }
};

const getDefaultTemplate = async () => {
  try {
    const response = await api.get('/OfferTemplates/default');
    return response.data;
  } catch (error) {
    console.error('Error fetching default offer template:', error);
    throw new Error(error.response?.data?.message || 'Varsayılan teklif şablonu alınırken bir hata oluştu');
  }
};

const createTemplate = async (template) => {
  try {
    const response = await api.post('/OfferTemplates', template);
    return response.data;
  } catch (error) {
    console.error('Error creating offer template:', error);
    throw new Error(error.response?.data?.message || 'Teklif şablonu oluşturulurken bir hata oluştu');
  }
};

const updateTemplate = async (id, template) => {
  try {
    const response = await api.put(`/OfferTemplates/${id}`, template);
    return response.data;
  } catch (error) {
    console.error(`Error updating offer template with id ${id}:`, error);
    throw new Error(error.response?.data?.message || 'Teklif şablonu güncellenirken bir hata oluştu');
  }
};

const deleteTemplate = async (id) => {
  try {
    await api.delete(`/OfferTemplates/${id}`);
    return true;
  } catch (error) {
    console.error(`Error deleting offer template with id ${id}:`, error);
    throw new Error(error.response?.data?.message || 'Teklif şablonu silinirken bir hata oluştu');
  }
};

const setAsDefault = async (id) => {
  try {
    await api.put(`/OfferTemplates/${id}/set-default`);
    return true;
  } catch (error) {
    console.error(`Error setting offer template ${id} as default:`, error);
    throw new Error(error.response?.data?.message || 'Teklif şablonu varsayılan olarak ayarlanırken bir hata oluştu');
  }
};

const offerTemplateService = {
  getAllTemplates,
  getTemplateById,
  getDefaultTemplate,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  setAsDefault
};

export default offerTemplateService; 