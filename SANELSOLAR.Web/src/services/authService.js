import api from "./api";

const authService = {
  login: async (credentials) => {
    try {
      const response = await api.post("/users/login", credentials);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post("/users/register", userData);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  getCurrentUser: async () => {
    try {
      // Token'dan kullanıcı adını çıkar (JWT decode)
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token bulunamadı");

      // Token'ı decode et ve kullanıcı bilgilerini al
      // Not: Gerçek uygulamada JWT decode işlemi yapılmalı
      // Şimdilik basit bir çözüm olarak kullanıcı adını token'dan çıkarıyoruz
      const username = parseJwt(token).sub;

      const response = await api.get(`/users/by-username/${username}`);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  updateProfile: async (userData) => {
    try {
      const response = await api.put(`/users/${userData.userId}`, userData);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  changePassword: async (passwordData) => {
    try {
      const response = await api.put("/users/change-password", passwordData);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  checkUserExists: async (username, email) => {
    try {
      const response = await api.get("/users/check-exists", {
        params: { username, email },
      });
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },
};

// JWT token'ı decode et
function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Token decode hatası:", e);
    return {};
  }
}

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

export default authService;
