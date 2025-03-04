import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

const Profile = () => {
  const { user, updateProfile, changePassword, loading, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("profile");

  const [profileData, setProfileData] = useState({
    userId: "",
    username: "",
    email: "",
    phone: "",
    address: "",
  });

  const [passwordData, setPasswordData] = useState({
    userId: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [profileErrors, setProfileErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    setProfileData({
      userId: user.userId,
      username: user.username || "",
      email: user.email || "",
      phone: user.phone || "",
      address: user.address || "",
    });

    setPasswordData({
      userId: user.userId,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  }, [user, navigate]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
    if (profileErrors[name]) {
      setProfileErrors({ ...profileErrors, [name]: "" });
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
    if (passwordErrors[name]) {
      setPasswordErrors({ ...passwordErrors, [name]: "" });
    }
  };

  const validateProfileForm = () => {
    const newErrors = {};
    if (!profileData.username.trim()) {
      newErrors.username = "Kullanıcı adı gereklidir";
    }
    if (!profileData.email.trim()) {
      newErrors.email = "E-posta gereklidir";
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      newErrors.email = "Geçerli bir e-posta adresi giriniz";
    }
    setProfileErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = () => {
    const newErrors = {};
    if (!passwordData.currentPassword) {
      newErrors.currentPassword = "Mevcut şifre gereklidir";
    }
    if (!passwordData.newPassword) {
      newErrors.newPassword = "Yeni şifre gereklidir";
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = "Şifre en az 6 karakter olmalıdır";
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Şifreler eşleşmiyor";
    }
    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitSuccess("");

    if (!validateProfileForm()) {
      return;
    }

    try {
      await updateProfile(profileData);
      setSubmitSuccess("Profil başarıyla güncellendi");
    } catch (error) {
      setSubmitError(error.message || "Profil güncellenirken bir hata oluştu");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitSuccess("");

    if (!validatePasswordForm()) {
      return;
    }

    try {
      await changePassword(passwordData);
      setSubmitSuccess("Şifre başarıyla değiştirildi");
      setPasswordData({
        ...passwordData,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      setSubmitError(error.message || "Şifre değiştirilirken bir hata oluştu");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) {
    return <div className="loading">Yükleniyor...</div>;
  }

  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-card">
          <h1 className="auth-title">Profil</h1>

          <div
            style={{
              display: "flex",
              marginBottom: "1.5rem",
              borderBottom: "1px solid var(--border-color)",
            }}
          >
            <button
              className={`btn ${
                activeTab === "profile" ? "btn-primary" : "btn-secondary"
              }`}
              onClick={() => setActiveTab("profile")}
              style={{ borderRadius: "0.25rem 0 0 0", flex: 1 }}
            >
              Profil Bilgileri
            </button>
            <button
              className={`btn ${
                activeTab === "password" ? "btn-primary" : "btn-secondary"
              }`}
              onClick={() => setActiveTab("password")}
              style={{ borderRadius: "0 0.25rem 0 0", flex: 1 }}
            >
              Şifre Değiştir
            </button>
          </div>

          {submitError && <div className="error-message">{submitError}</div>}
          {submitSuccess && (
            <div className="success-message">{submitSuccess}</div>
          )}

          {activeTab === "profile" && (
            <form className="auth-form" onSubmit={handleProfileSubmit}>
              <div className="form-group">
                <label htmlFor="username">Kullanıcı Adı</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  className="form-control"
                  value={profileData.username}
                  onChange={handleProfileChange}
                />
                {profileErrors.username && (
                  <div className="error-message">{profileErrors.username}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="email">E-posta</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-control"
                  value={profileData.email}
                  onChange={handleProfileChange}
                />
                {profileErrors.email && (
                  <div className="error-message">{profileErrors.email}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="phone">Telefon</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="form-control"
                  value={profileData.phone}
                  onChange={handleProfileChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="address">Adres</label>
                <textarea
                  id="address"
                  name="address"
                  className="form-control"
                  value={profileData.address}
                  onChange={handleProfileChange}
                  rows="3"
                ></textarea>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={loading}
              >
                {loading ? "Güncelleniyor..." : "Profili Güncelle"}
              </button>
            </form>
          )}

          {activeTab === "password" && (
            <form className="auth-form" onSubmit={handlePasswordSubmit}>
              <div className="form-group">
                <label htmlFor="currentPassword">Mevcut Şifre</label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  className="form-control"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                />
                {passwordErrors.currentPassword && (
                  <div className="error-message">
                    {passwordErrors.currentPassword}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="newPassword">Yeni Şifre</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  className="form-control"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                />
                {passwordErrors.newPassword && (
                  <div className="error-message">
                    {passwordErrors.newPassword}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Yeni Şifre Tekrar</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className="form-control"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                />
                {passwordErrors.confirmPassword && (
                  <div className="error-message">
                    {passwordErrors.confirmPassword}
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={loading}
              >
                {loading ? "Değiştiriliyor..." : "Şifreyi Değiştir"}
              </button>
            </form>
          )}

          <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
            <button onClick={handleLogout} className="btn btn-secondary">
              Çıkış Yap
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
