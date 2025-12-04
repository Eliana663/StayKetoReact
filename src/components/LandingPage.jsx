import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "./AuthContext";
import { api } from "../api";

export default function LandingPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Login con el backend en Render
      const res = await api.post("/api/auth/login", { email, password });
      console.log("Login response:", res.data);
      const jwt = res.data.token;
      console.log("JWT token:", jwt);
      localStorage.setItem("token", jwt);

      // Obtener datos del usuario autenticado
      const userRes = await api.get("/api/users/me", {
        headers: { Authorization: `Bearer ${jwt}` },
      });

      setUser(userRes.data);
      navigate("/profile");
    } catch (err) {
      console.error(err);
      alert("Email o contraseña incorrectos");
    }
  };

  const handleUseTestCredentials = () => {
    setEmail("alejandro@gmail.com");
    setPassword("MiContra123");
  };

  return (
    <div style={{
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      display: "flex", flexDirection: "column", minHeight: "100vh",
      justifyContent: "center", alignItems: "center",
      background: "linear-gradient(135deg, #1e8e61ff 0%, #99c499ff 100%)",
      color: "#333", padding: "2rem"
    }}>
      <h1 style={{ fontStyle: "italic", fontSize: "4rem", marginBottom: "0.5rem", color: "#fff", textShadow: "0 0 5px #000" }}>
        Stay Keto
      </h1>
      <h2 style={{ textAlign: "center", fontSize: "3rem", marginBottom: "0.5rem", color: "#fff", textShadow: "0 0 5px #000" }}>
        Tu web para mantenerte en cetosis
      </h2>

      <div style={{
        backgroundColor: "rgba(255,255,255,0.95)",
        padding: "2rem",
        borderRadius: "12px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
        width: "100%",
        maxWidth: 400
      }}>

        {/* Credenciales de prueba */}
        <div style={{
          backgroundColor: "#fffae6",
          padding: "1.5rem",
          borderRadius: "12px",
          marginBottom: "1.5rem",
          textAlign: "center",
          boxShadow: "0 5px 20px rgba(0,0,0,0.15)",
          border: "2px dashed #f59e0b",
        }}>
          <h3 style={{ marginBottom: "0.5rem", color: "#b45309" }}>¡Prueba de login!</h3>
          <p>Email: <b>alejandro@gmail.com</b></p>
          <p>Contraseña: <b>MiContra123</b></p>
          <button
            onClick={handleUseTestCredentials}
            style={{
              marginTop: "0.5rem",
              padding: "0.6rem 1.2rem",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#f59e0b",
              color: "#fff",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Usar credenciales de prueba
          </button>
        </div>

        {/* Formulario de login / registro */}
        {isLogin ? (
          <>
            <h2 style={{ marginBottom: "1rem", textAlign: "center" }}>Iniciar sesión</h2>
            <form onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: "100%", padding: "0.8rem", marginBottom: "1rem", borderRadius: "6px", border: "1px solid #ccc", fontSize: "1rem" }}
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: "100%", padding: "0.8rem", marginBottom: "1rem", borderRadius: "6px", border: "1px solid #ccc", fontSize: "1rem" }}
              />
              <button
                type="submit"
                style={{ width: "100%", backgroundColor: "#3b82f6", color: "white", padding: "0.8rem", border: "none", borderRadius: "8px", fontSize: "1.1rem", cursor: "pointer", fontWeight: "bold" }}
              >
                Iniciar sesión
              </button>
            </form>
            <p style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.9rem" }}>
              ¿No tienes cuenta?{" "}
              <button
                onClick={() => setIsLogin(false)}
                style={{ background: "none", border: "none", color: "#3b82f6", cursor: "pointer", fontWeight: "bold", textDecoration: "underline", padding: 0, fontSize: "0.9rem" }}
              >
                Crear cuenta
              </button>
            </p>
          </>
        ) : (
          <h2 style={{ marginBottom: "1rem", textAlign: "center" }}>Crear cuenta</h2>
        )}
      </div>
    </div>
  );
}
