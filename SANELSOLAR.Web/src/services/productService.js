import api from "./api";

const productService = {
  getAllProducts: async () => {
    try {
      const response = await api.get("/products");
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  getProductById: async (id) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  getProductsByCategory: async (categoryId) => {
    try {
      const response = await api.get(`/products/by-category/${categoryId}`);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  searchProducts: async (term) => {
    try {
      const response = await api.get("/products/search", {
        params: { term },
      });
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  createProduct: async (productData) => {
    try {
      const response = await api.post("/products", productData);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  updateProduct: async (productData) => {
    try {
      const response = await api.put(
        `/products/${productData.productId}`,
        productData
      );
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  updateProductCategories: async (productId, categoryIds) => {
    try {
      const response = await api.put(
        `/products/${productId}/categories`,
        categoryIds
      );
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  deleteProduct: async (id) => {
    try {
      await api.delete(`/products/${id}`);
      return true;
    } catch (error) {
      throw handleError(error);
    }
  },
};

// Hata işleme
function handleError(error) {
  if (error.response) {
    // Sunucu yanıtı ile dönen hata
    if (error.response.data.message) {
      return new Error(error.response.data.message);
    } else if (error.response.data.ValidationErrors) {
      // Doğrulama hataları
      const validationErrors = error.response.data.ValidationErrors;
      const errorMessage = Object.values(validationErrors).join(", ");
      return new Error(errorMessage);
    }
    return new Error(`Sunucu hatası: ${error.response.status}`);
  } else if (error.request) {
    // İstek yapıldı ama yanıt alınamadı
    return new Error(
      "Sunucuya ulaşılamıyor. Lütfen internet bağlantınızı kontrol edin."
    );
  } else {
    // İstek oluşturulurken bir hata oluştu
    return new Error("İstek hatası: " + error.message);
  }
}

export default productService;
