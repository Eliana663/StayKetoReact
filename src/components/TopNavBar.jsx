import React from 'react';
import avocadoImg from '@/assets/avocado.png';
import { Link } from 'react-router-dom';


export default function TopNavbar() {
  return (
    <nav className="navbar navbar-expand-lg bg-success border-bottom mb-1">
      <div className="container-fluid">
        {/* Logo + texto */}
        <a className="navbar-brand d-flex align-items-center fw-bold text-white fs-3" href="#">
          <img
            src={avocadoImg}
            alt="Aguacate"
            style={{ width: '40px', height: '40px', marginRight: '10px' }}
          />
          StayKeto
        </a>

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

        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 fs-5">
            <li className="nav-item">
              <a className="nav-link text-white" href="#">Dieta Cetogénica</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white" href="#">Alimentos permitidos</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white" href="#">Recetas Keto</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white" href="#">Blog</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white" href="#">Iniciar Sesión</a>
            </li>
          </ul>

          <div className="d-flex align-items-center">
            <div className="dropdown">
              <button
                className="btn btn-outline-light dropdown-toggle fs-5 px-4 py-2"
                type="button"
                id="userMenuButton"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                🥑 Usuario
              </button>
              <ul
                className="dropdown-menu dropdown-menu-end fs-5"
                aria-labelledby="userMenuButton"
                style={{ minWidth: '220px' }}
              >
                <li>
                  <Link
                    className="dropdown-item py-3 d-flex align-items-center gap-3 text-success"
                    to="/profile"
                  >
                    <span style={{ fontSize: '1.5rem' }}>👤</span> Mi cuenta
                  </Link>
                </li>
                
                <li>
                  <a className="dropdown-item py-3 d-flex align-items-center gap-3 text-success" href="#">
                    <span style={{ fontSize: '1.5rem' }}>⚙️</span> Configuración
                  </a>
                </li>
                <li>
                  <a className="dropdown-item py-3 d-flex align-items-center gap-3 text-success" href="#">
                    <span style={{ fontSize: '1.5rem' }}>🧮</span> Calculadora Keto
                  </a>
                </li>
                <li>
                  <a className="dropdown-item py-3 d-flex align-items-center gap-3 text-success" href="#">
                    <span style={{ fontSize: '1.5rem' }}>🗒️</span> Diario de Alimentos
                  </a>
                </li>
                <li>
                  <a className="dropdown-item py-3 d-flex align-items-center gap-3 text-success" href="#">
                    <span style={{ fontSize: '1.5rem' }}>📈</span> Gráficos y progreso
                  </a>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <a className="dropdown-item py-3 d-flex align-items-center gap-3 text-danger fw-semibold" href="#">
                    <span style={{ fontSize: '1.5rem' }}>🚪</span> Cerrar sesión
                  </a>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </nav>
  );
}