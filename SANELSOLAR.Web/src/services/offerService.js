import api from "./api";

// Helper function to handle API errors
const handleError = (error) => {
  console.error("API Error:", error);
  if (error.response && error.response.data) {
    if (error.response.data.message) {
      return new Error(error.response.data.message);
    } else if (typeof error.response.data === 'string') {
      return new Error(error.response.data);
    }
  }
  return new Error("Bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
};

const offerService = {
  getAllOffers: async (filters = {}) => {
    try {
      const { customerId, userId, startDate, endDate, status } = filters;
      const params = {};
      
      // Add filters to params if they exist
      if (customerId) params.customerId = customerId;
      if (userId) params.userId = userId;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      if (status) params.status = status;
      
      const response = await api.get("/offers", { params });
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

  // These methods are now deprecated and use the unified getAllOffers method
  getOffersByCustomer: async (customerId) => {
    return offerService.getAllOffers({ customerId });
  },

  getOffersByUser: async (userId) => {
    return offerService.getAllOffers({ userId });
  },

  getOffersByDateRange: async (startDate, endDate) => {
    return offerService.getAllOffers({ startDate, endDate });
  },

  getOffersByStatus: async (status) => {
    return offerService.getAllOffers({ status });
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

  // Helper function to get next sequential number for reference number
  getNextSequentialNumber: async (datePrefix) => {
    try {
      // Get all offers
      const offers = await offerService.getAllOffers();
      
      // Filter offers with reference numbers that match the date prefix
      const matchingOffers = offers.filter(offer => 
        offer.referenceNumber && offer.referenceNumber.startsWith(`ST-${datePrefix}`)
      );
      
      if (matchingOffers.length === 0) {
        return '0001'; // Start with 0001 if no matching offers
      }
      
      // Extract the sequential numbers and find the highest
      const sequentialNumbers = matchingOffers.map(offer => {
        const match = offer.referenceNumber.match(/ST-\d{6}(\d{4})/);
        return match ? parseInt(match[1], 10) : 0;
      });
      
      const highestNumber = Math.max(...sequentialNumbers);
      
      // Return the next number, padded to 4 digits
      return (highestNumber + 1).toString().padStart(4, '0');
    } catch (error) {
      console.warn("Error getting next sequential number:", error);
      return '0001'; // Default to 0001 if there's an error
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

export default offerService;