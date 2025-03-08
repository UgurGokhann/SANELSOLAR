import api from "./api";

const offerService = {
  getAllOffers: async () => {
    try {
      const response = await api.get("/offers");
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  getOfferById: async (id) => {
    try {
      const response = await api.get(`/offers/${id}`);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  getOffersByCustomer: async (customerId) => {
    try {
      const response = await api.get(`/offers/customer/${customerId}`);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  getOffersByUser: async (userId) => {
    try {
      const response = await api.get(`/offers/user/${userId}`);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  getOffersByDateRange: async (startDate, endDate) => {
    try {
      const response = await api.get("/offers/daterange", {
        params: { startDate, endDate },
      });
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  getOffersByStatus: async (status) => {
    try {
      const response = await api.get(`/offers/status/${status}`);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  createOffer: async (offerData) => {
    try {
      const response = await api.post("/offers", offerData);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  updateOffer: async (offerData) => {
    try {
      const response = await api.put("/offers", offerData);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  updateOfferStatus: async (id, status) => {
    try {
      const response = await api.put(`/offers/status/${id}`, JSON.stringify(status), {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  deleteOffer: async (id) => {
    try {
      const response = await api.delete(`/offers/${id}`);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  calculateTotal: async (id) => {
    try {
      const response = await api.get(`/offers/calculate-total/${id}`);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  // Helper function to get current exchange rate
  getCurrentExchangeRate: async () => {
    try {
      // First try to get USD rate specifically
      try {
        const response = await api.get("/exchangerate/USD");
        return { rate: response.data.rate };
      } catch (specificError) {
        // If USD specific rate fails, get all rates and find USD
        const response = await api.get("/exchangerate");
        const usdRate = response.data.find(rate => rate.currencyCode === "USD");
        if (usdRate) {
          return { rate: usdRate.rate };
        }
        
        // If no USD rate found, return a default value
        return { rate: 36.5 };
      }
    } catch (error) {
      console.warn("Failed to get exchange rate, using default value:", error);
      return { rate: 36.5 }; // Default fallback value
    }
  }
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

export default offerService; 