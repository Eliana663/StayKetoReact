import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { API_BASE_URL } from '../constants';
import { useTranslation } from 'react-i18next'; 

export default function LandingPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const { t } = useTranslation(); 

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
      const jwt = res.data.token;
      localStorage.setItem("token", jwt);

      const userRes = await axios.get(`${ API_BASE_URL }/api/users/me`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });

      setUser(userRes.data); 
      navigate("/profile");   
    } catch (err) {
      console.error(err);
      alert(t("landing.alert_error")); 
    }
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
      <h1 style={{ textAlign: "center", fontSize: "3rem", marginBottom: "0.5rem", color: "#fff", textShadow: "0 0 5px #000" }}>
        {t("landing.subtitle")}
      </h1>

      <div style={{ 
        backgroundColor: "rgba(255,255,255,0.95)", padding: "2rem", borderRadius: "12px", 
        boxShadow: "0 10px 30px rgba(0,0,0,0.2)", width: "100%", maxWidth: 400 
      }}>

        {/* CUADRO DE CREDENCIALES DE PRUEBA */}
        <div style={{
          backgroundColor: "#fffae6",
          padding: "1.5rem",
          borderRadius: "12px",
          marginBottom: "1.5rem",
          textAlign: "center",
          boxShadow: "0 5px 20px rgba(0,0,0,0.15)",
          border: "2px dashed #f59e0b",
        }}>
          <h3 style={{ marginBottom: "0.5rem", color: "#b45309" }}>{t("landing.demo_title")}</h3>
          <p style={{ marginBottom: "0.25rem" }}>{t("landing.demo_lead")}</p>
          <p>{t("landing.demo_email")} <b>alejandro@gmail.com</b></p>
          <p>{t("landing.demo_password")} <b>MiContra123</b></p>
          <button
            onClick={() => { setEmail("alejandro@gmail.com"); setPassword("MiContra123"); }}
            style={{
              marginTop: "0.5rem",
              padding: "0.6rem 1.2rem",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#f59e0b",
              color: "#fff",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "0.2s",
            }}
            onMouseOver={e => e.currentTarget.style.backgroundColor = "#d97706"}
            onMouseOut={e => e.currentTarget.style.backgroundColor = "#f59e0b"}
          >
            {t("landing.demo_btn")}
          </button>
          <p style={{ marginTop: "0.5rem", fontSize: "0.85rem", color: "#92400e" }}>
            {t("landing.demo_footer")}
          </p>
        </div>

        {/* FORMULARIO DE LOGIN / CREAR CUENTA */}
        {isLogin ? (
          <>
            <h2 style={{ marginBottom: "1rem", textAlign: "center" }}>{t("landing.login_title")}</h2>
            <form onSubmit={handleLogin}>
              <input 
                type="email" placeholder={t("landing.placeholder_email")} value={email} 
                onChange={(e) => setEmail(e.target.value)} required 
                style={{ width: "100%", padding: "0.8rem", marginBottom: "1rem", borderRadius: "6px", border: "1px solid #ccc", fontSize: "1rem" }} 
              />
              <input 
                type="password" placeholder={t("landing.placeholder_password")} value={password} 
                onChange={(e) => setPassword(e.target.value)} required 
                style={{ width: "100%", padding: "0.8rem", marginBottom: "1rem", borderRadius: "6px", border: "1px solid #ccc", fontSize: "1rem" }} 
              />
              <button type="submit" style={{ width: "100%", backgroundColor: "#3b82f6", color: "white", padding: "0.8rem", border: "none", borderRadius: "8px", fontSize: "1.1rem", cursor: "pointer", fontWeight: "bold" }}>
                {t("landing.login_title")}
              </button>
            </form>
            <p style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.9rem" }}>
              {t("landing.no_account")}{" "}
              <button onClick={() => setIsLogin(false)} style={{ background: "none", border: "none", color: "#3b82f6", cursor: "pointer", fontWeight: "bold", textDecoration: "underline", padding: 0, fontSize: "0.9rem" }}>
                {t("landing.register_title")}
              </button>
            </p>
          </>
        ) : (
          <>
            <h2 style={{ marginBottom: "1rem", textAlign: "center" }}>{t("landing.register_title")}</h2>
           
            <p style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.9rem" }}>
              <button onClick={() => setIsLogin(true)} style={{ background: "none", border: "none", color: "#3b82f6", cursor: "pointer", fontWeight: "bold", textDecoration: "underline", padding: 0, fontSize: "0.9rem" }}>
                {t("landing.login_title")}
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}