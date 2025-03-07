import api from "./api";

const customerService = {
  getAllCustomers: async () => {
    try {
      const response = await api.get("/customers");
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  getCustomerById: async (id) => {
    try {
      const response = await api.get(`/customers/${id}`);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  searchCustomers: async (term) => {
    try {
      const response = await api.get("/customers/search", {
        params: { term },
      });
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  createCustomer: async (customerData) => {
    try {
      const response = await api.post("/customers", customerData);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  updateCustomer: async (customerData) => {
    try {
      const response = await api.put("/customers", customerData);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  deleteCustomer: async (id) => {
    try {
      const response = await api.delete(`/customers/${id}`);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },
};

// Hata işleme yardımcı fonksiyonu
const handleError = (error) => {
  if (error.response) {
    // Sunucu yanıtı ile dönen hata
    if (error.response.data && error.response.data.validationErrors) {
      // Doğrulama hataları
      return {
        isError: true,
        validationErrors: error.response.data.validationErrors,
        message: "Doğrulama hatası oluştu.",
      };
    }
    return {
      isError: true,
      message: error.response.data.message || "Bir hata oluştu.",
      status: error.response.status,
    };
  } else if (error.request) {
    // İstek yapıldı ama yanıt alınamadı
    return {
      isError: true,
      message: "Sunucuya ulaşılamıyor. Lütfen internet bağlantınızı kontrol edin.",
    };
  } else {
    // İstek oluşturulurken bir şeyler yanlış gitti
    return {
      isError: true,
      message: error.message || "Bir hata oluştu.",
    };
  }
};

export default customerService; 