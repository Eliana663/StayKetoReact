import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const [isLogin, setIsLogin] = useState(true);

  // Estados login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(null);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8081/auth/login", {
        email,
        password,
      });

      const jwt = res.data.token;

      setToken(jwt);
      localStorage.setItem("jwt", jwt);

      alert("Login exitoso!");

      // 👉 aquí te vas al perfil
      navigate("/profile");

    } catch (err) {
      alert("Error al iniciar sesión");
      console.error(err);
    }
  };

  const getPrivateData = async () => {
    const jwt = token || localStorage.getItem("jwt");
    if (!jwt) {
      alert("No hay token, haz login primero.");
      return;
    }
    try {
      const res = await axios.get("http://localhost:8081/api/users/1", {
        headers: { Authorization: "Bearer " + jwt },
      });
      alert("Datos privados: " + JSON.stringify(res.data));
    } catch (err) {
      alert("No se pudo acceder a los datos privados");
      console.error(err);
    }
  };


  return (
    <div
      style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        justifyContent: "center",
        alignItems: "center",
        background:
          "linear-gradient(135deg, #1e8e61ff 0%, #99c499ff 100%)",
        color: "#333",
        padding: "2rem",
      }}
    >
      <h1 style={{ fontStyle: "italic", fontSize: "4rem", marginBottom: "0.5rem", color: "#fff", textShadow: "0 0 5px #000" }}>Stay Keto</h1>
      <h1 style={{ textAlign: "center", fontSize: "3rem", marginBottom: "0.5rem", color: "#fff", textShadow: "0 0 5px #000" }}>
        Tu web para mantenerte en cetosis
      </h1>

      <p
        style={{
          maxWidth: 500,
          fontSize: "1.2rem",
          marginBottom: "3rem",
          color: "#f0f9ff",
          textAlign: "center",
          textShadow: "0 0 3px #000",
        }}
      >
        Lleva el control de tus hábitos, progreso y estado de cetosis con una
        plataforma fácil, intuitiva y adaptada a ti.
      </p>

      <div
        style={{
          backgroundColor: "rgba(255,255,255,0.95)",
          padding: "2rem",
          borderRadius: "12px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
          width: "100%",
          maxWidth: 400,
        }}
      >
        {isLogin ? (
          <>
            <h2 style={{ marginBottom: "1rem", textAlign: "center" }}>
              Iniciar sesión
            </h2>
            <form onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "0.8rem",
                  marginBottom: "1rem",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  fontSize: "1rem",
                }}
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "0.8rem",
                  marginBottom: "0.5rem",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  fontSize: "1rem",
                }}
              />
              <div
                style={{
                  textAlign: "right",
                  marginBottom: "1rem",
                }}
              >
                <a href="#" style={{ fontSize: "0.9rem", color: "#3b82f6", textDecoration: "none" }}>
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              <button
                type="submit"
                style={{
                  width: "100%",
                  backgroundColor: "#3b82f6",
                  color: "white",
                  padding: "0.8rem",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "1.1rem",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Iniciar sesión
              </button>
            </form>

            <button 
              onClick={getPrivateData} 
              style={{ marginTop: "1rem", width: "100%", padding: "0.6rem", fontWeight: "bold", cursor: "pointer" }}
            >
              Probar endpoint privado
            </button>

            <p style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.9rem" }}>
              ¿No tienes cuenta?{" "}
              <button
                onClick={() => setIsLogin(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#3b82f6",
                  cursor: "pointer",
                  fontWeight: "bold",
                  textDecoration: "underline",
                  padding: 0,
                  fontSize: "0.9rem",
                }}
              >
                Crear cuenta
              </button>
            </p>
          </>
        ) : (
          <>
            <h2 style={{ marginBottom: "1rem", textAlign: "center" }}>
              Crear cuenta
            </h2>
            <form>
              <input
                type="text"
                placeholder="Nombre completo"
                required
                style={{
                  width: "100%",
                  padding: "0.8rem",
                  marginBottom: "1rem",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  fontSize: "1rem",
                }}
              />
              <input
                type="email"
                placeholder="Correo electrónico"
                required
                style={{
                  width: "100%",
                  padding: "0.8rem",
                  marginBottom: "1rem",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  fontSize: "1rem",
                }}
              />
              <input
                type="password"
                placeholder="Contraseña"
                required
                style={{
                  width: "100%",
                  padding: "0.8rem",
                  marginBottom: "1.5rem",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  fontSize: "1rem",
                }}
              />
              <button
                type="submit"
                style={{
                  width: "100%",
                  backgroundColor: "#3b82f6",
                  color: "white",
                  padding: "0.8rem",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "1.1rem",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Crear cuenta
              </button>
            </form>
            <p style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.9rem" }}>
              ¿Ya tienes cuenta?{" "}
              <button
                onClick={() => setIsLogin(true)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#3b82f6",
                  cursor: "pointer",
                  fontWeight: "bold",
                  textDecoration: "underline",
                  padding: 0,
                  fontSize: "0.9rem",
                }}
              >
                Iniciar sesión
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
