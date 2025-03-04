import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div
      className="container"
      style={{ textAlign: "center", padding: "5rem 0" }}
    >
      <h1 style={{ fontSize: "4rem", marginBottom: "1rem" }}>404</h1>
      <h2 style={{ marginBottom: "2rem" }}>Sayfa Bulunamadı</h2>
      <p style={{ marginBottom: "2rem" }}>
        Aradığınız sayfa mevcut değil veya taşınmış olabilir.
      </p>
      <Link to="/" className="btn btn-primary">
        Ana Sayfaya Dön
      </Link>
    </div>
  );
};

export default NotFound;
