import api from "./api";

const categoryService = {
  getAllCategories: async () => {
    try {
      const response = await api.get("/categories");
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  getCategoryById: async (id) => {
    try {
      const response = await api.get(`/categories/${id}`);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  getCategoriesWithProducts: async () => {
    try {
      const response = await api.get("/categories/with-products");
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  searchCategories: async (term) => {
    try {
      const response = await api.get("/categories/search", {
        params: { term },
      });
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  createCategory: async (categoryData) => {
    try {
      const response = await api.post("/categories", categoryData);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  updateCategory: async (categoryData) => {
    try {
      const response = await api.put(
        `/categories/${categoryData.categoryId}`,
        categoryData
      );
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  deleteCategory: async (id) => {
    try {
      await api.delete(`/categories/${id}`);
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

export default categoryService;
