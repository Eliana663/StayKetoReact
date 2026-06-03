import React from 'react';
import avocadoImg from '@/assets/avocado.png';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "./AuthContext";
import { useTranslation } from 'react-i18next';
import '../i18n';

export default function TopNavbar() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation(); // Extraemos t e i18n correctamente

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/home");
  };

  return (
    <nav className="navbar navbar-expand-lg bg-success border-bottom mb-1">
      <div className="container-fluid">
        <Link
          to="/home"
          className="navbar-brand d-flex align-items-center fw-bold text-white fs-3"
          style={{ textDecoration: 'none' }}
        >
          <img
            src={avocadoImg}
            alt="Aguacate"
            style={{ width: '40px', height: '40px', marginRight: '10px' }}
          />
          StayKeto
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-between" id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 fs-5">
            <li className="nav-item">
              <Link className="nav-link text-white" to="/ketoDiet">
                {t('nav.keto_diet')}
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/allowedFoods">
                {t('nav.allowed_foods')}
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/KetoRecipes">
                {t('nav.recipes')}
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/landing">
                {t('nav.login')}
              </Link>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-2 me-4">
            {/* Botón Español */}
            <button 
              onClick={() => i18n.changeLanguage('es')}
              className="btn shadow d-flex align-items-center px-3 py-2"
              style={{ 
                backgroundColor: '#FFD700', 
                border: '2px solid #D4AF37', 
                borderRadius: '10px',
                color: '#000',
                fontWeight: '700',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <span style={{ fontSize: '1.4rem', marginRight: '8px' }}>🇪🇸</span>
              {t('lang.es')}
            </button>

            {/* Botón English */}
            <button 
              onClick={() => i18n.changeLanguage('en')}
              className="btn shadow d-flex align-items-center px-3 py-2"
              style={{ 
                backgroundColor: '#FFD700', 
                border: '2px solid #D4AF37', 
                borderRadius: '10px',
                color: '#000',
                fontWeight: '700',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <span style={{ fontSize: '1.4rem', marginRight: '8px' }}>🇺🇸</span>
              {t('lang.en')}
            </button>
          </div>

          <div className="d-flex align-items-center ms-auto position-relative">
            <div className="dropdown">
              <button
                className="btn btn-outline-light dropdown-toggle fs-5 px-4 py-2"
                type="button"
                id="userMenuButton"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                🥑 {t('user_menu.user')}
              </button>
              <ul
                className="dropdown-menu dropdown-menu-end fs-6"
                aria-labelledby="userMenuButton"
                style={{ minWidth: '220px' }}
              >
                <li>
                  <Link className="dropdown-item py-3 d-flex align-items-center gap-3 text-success" to="/profile">
                    <span style={{ fontSize: '1.5rem' }}>👤</span> {t('user_menu.account')}
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item py-3 d-flex align-items-center gap-3 text-success" to="/panelPersonal">
                    <span style={{ fontSize: '1.5rem' }}>📋</span> {t('user_menu.panel')}
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item py-3 d-flex align-items-center gap-3 text-success" to="/calculadoraKeto">
                    <span style={{ fontSize: '1.5rem' }}>🧮</span> {t('user_menu.calculator')}
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item py-3 d-flex align-items-center gap-3 text-success" to="/foodDiary">
                    <span style={{ fontSize: '1.5rem' }}>🗒️</span> {t('user_menu.diary')}
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item py-3 d-flex align-items-center gap-3 text-success" to="/progresoGraficos">
                    <span style={{ fontSize: '1.5rem' }}>📈</span> {t('user_menu.progress')}
                  </Link>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="dropdown-item py-3 d-flex align-items-center gap-3 text-danger fw-semibold"
                    style={{ background: "none", border: "none", width: "100%", textAlign: "left" }}
                  >
                    <span style={{ fontSize: '1.5rem' }}>🚪</span> {t('user_menu.logout')}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}