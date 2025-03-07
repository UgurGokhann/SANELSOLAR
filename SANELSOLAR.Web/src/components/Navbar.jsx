import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Get user's full name or username as fallback
  const getUserDisplayName = () => {
    if (!user) return "";
    
    // If firstName and lastName exist, use them
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    
    // Otherwise, use username as fallback
    return user.username;
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo">
          SANEL SOLAR
        </Link>

        <button className="navbar-toggle" onClick={toggleMenu}>
          <span className="navbar-toggle-icon"></span>
        </button>

        <div className={`navbar-menu ${isMenuOpen ? "active" : ""}`}>
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link
                to="/"
                className="nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                Ana Sayfa
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/products"
                className="nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                Ürünler
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/categories"
                className="nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                Kategoriler
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/customers"
                className="nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                Müşteriler
              </Link>
            </li>
          </ul>

          <div className="navbar-auth">
            {isAuthenticated ? (
              <>
                <span className="navbar-username">
                  Merhaba, {getUserDisplayName()}
                </span>
                <Link
                  to="/profile"
                  className="nav-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profil
                </Link>
                <button className="btn btn-secondary" onClick={handleLogout}>
                  Çıkış
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="nav-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Giriş
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Kayıt Ol
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
