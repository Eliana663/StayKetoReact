import React from 'react';
import avocadoImg from '@/assets/avocado.png';
import { Link } from 'react-router-dom';

export default function TopNavbar() {
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
              <Link className="nav-link text-white" to="/ketoDiet">Dieta Cetogénica
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/allowedFoods">
              Alimentos permitidos
              </Link>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white" href="#">Recetas Keto</a>
            </li>
            <li className="nav-item">
                <Link className="nav-link text-white" to="/landing">
                  Iniciar Sesión
                </Link>
              </li>
          </ul>

          
          <div className="d-flex align-items-center ms-auto position-relative">
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
            className="dropdown-menu dropdown-menu-end fs-6"
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
                  <Link
                    className="dropdown-item py-3 d-flex align-items-center gap-3 text-success" 
                    to="/panelPersonal"
                  >
                    <span style={{ fontSize: '1.5rem' }}>📋</span> Panel Personal
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item py-3 d-flex align-items-center gap-3 text-success" to="/calculadoraKeto">
                    <span style={{ fontSize: '1.5rem' }}>🧮</span> Calculadora Keto
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item py-3 d-flex align-items-center gap-3 text-success"
                    to="/foodDiary"
                  >
                    <span style={{ fontSize: '1.5rem' }}>🗒️</span> Diario de Alimentos
                  </Link>
                </li>
                <li>
                  <Link
                   className="dropdown-item py-3 d-flex align-items-center gap-3 text-success" 
                   to="/progresoGraficos"
                   >
                    <span style={{ fontSize: '1.5rem' }}>📈</span> Gráficos y progreso
                  </Link>
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