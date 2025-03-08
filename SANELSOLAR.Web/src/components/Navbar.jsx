import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Navbar as BootstrapNavbar, Nav, Container, Button } from 'react-bootstrap';
import "./Navbar.css";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

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
    <BootstrapNavbar bg="light" expand="lg" className="custom-navbar">
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/" className="navbar-logo">
          SANEL SOLAR
        </BootstrapNavbar.Brand>
        
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto horizontal-nav">
            <Nav.Link as={Link} to="/" className="nav-link">Ana Sayfa</Nav.Link>
            <Nav.Link as={Link} to="/products" className="nav-link">Ürünler</Nav.Link>
            <Nav.Link as={Link} to="/categories" className="nav-link">Kategoriler</Nav.Link>
            <Nav.Link as={Link} to="/customers" className="nav-link">Müşteriler</Nav.Link>
            <Nav.Link as={Link} to="/offers" className="nav-link">Teklifler</Nav.Link>
          </Nav>
          
          <Nav className="ms-auto">
            {isAuthenticated ? (
              <>
                <span className="navbar-username align-self-center me-2">
                  Merhaba, {getUserDisplayName()}
                </span>
                <Nav.Link as={Link} to="/profile" className="nav-link">Profil</Nav.Link>
                <Button variant="secondary" onClick={handleLogout} className="ms-2">
                  Çıkış
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="nav-link">Giriş</Nav.Link>
                <Nav.Link as={Link} to="/register" className="btn btn-primary ms-2">
                  Kayıt Ol
                </Nav.Link>
              </>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
