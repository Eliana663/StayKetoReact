import React from "react";
import { useNavigate } from "react-router-dom";

const KetoDietIntro = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/landing"); // Redirige a la página de inicio de sesión
  };

  return (
    <section className="bg-light min-vh-100 d-flex flex-column justify-content-center align-items-center text-center p-4">
      <div className="container">
        <h1 className="display-3 fw-bold text-success mb-4" data-testid="main-heading">
            Bienvenido a <span className="text-warning">StayKeto</span>
        </h1>
        <p className="lead text-secondary mb-4">
          La dieta cetogénica es un estilo de alimentación bajo en carbohidratos y alto en grasas saludables,
          que ayuda a tu cuerpo a entrar en cetosis y usar la grasa como fuente de energía.
        </p>
        <p className="mb-5 text-secondary">
          StayKeto te acompaña en este proceso: registra tus comidas, controla tus macros y sigue tu progreso con gráficos claros y fáciles de entender.
        </p>

        <div className="row mb-5">
          <div className="col-md-4 mb-3">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <div className="fs-1 mb-3">🍳</div>
                <h5 className="card-title fw-bold" data-testid="card-macros">Macros diarios</h5>
                <p className="card-text">Calcula automáticamente tus macros diarios.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <div className="fs-1 mb-3">⚡</div>
                <h5 className="card-title fw-bold" data-testid="card-cetosis">Cetosis</h5>
                <p className="card-text">Mide tu nivel de cetosis fácilmente.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <div className="fs-1 mb-3">📊</div>
                <h5 className="card-title fw-bold" data-testid="card-progreso">Progreso</h5>
                <p className="card-text">Visualiza tu progreso con gráficos claros.</p>
              </div>
            </div>
          </div>
        </div>

        <button 
          onClick={handleStart} 
          className="btn btn-success btn-lg px-5 py-3 shadow-sm"
        >
          Comenzar
        </button>
      </div>
    </section>
  );
};

export default KetoDietIntro;
