import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const KetoDietIntro = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(); 

  const handleStart = () => {
    navigate("/landing"); 
  };

  return (
    <section className="bg-light min-vh-100 d-flex flex-column justify-content-center align-items-center text-center p-4">
      <div className="container">
        <h1 className="display-3 fw-bold text-success mb-4" data-testid="main-heading">
          {t('intro.welcome')} <span className="text-warning">StayKeto</span>
        </h1>
        <p className="lead text-secondary mb-4">
          {t('intro.description_1')}
        </p>
        <p className="mb-5 text-secondary">
          {t('intro.description_2')}
        </p>

        <div className="row mb-5">
          <div className="col-md-4 mb-3">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <div className="fs-1 mb-3">🍳</div>
                <h5 className="card-title fw-bold" data-testid="card-macros">
                  {t('intro.card_macros_title')}
                </h5>
                <p className="card-text">
                  {t('intro.card_macros_text')}
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <div className="fs-1 mb-3">⚡</div>
                <h5 className="card-title fw-bold" data-testid="card-cetosis">
                  {t('intro.card_cetosis_title')}
                </h5>
                <p className="card-text">
                  {t('intro.card_cetosis_text')}
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <div className="fs-1 mb-3">📊</div>
                <h5 className="card-title fw-bold" data-testid="card-progreso">
                  {t('intro.card_progress_title')}
                </h5>
                <p className="card-text">
                  {t('intro.card_progress_text')}
                </p>
              </div>
            </div>
          </div>
        </div>

        <button 
          onClick={handleStart} 
          className="btn btn-success btn-lg px-5 py-3 shadow-sm"
        >
          {t('intro.btn_start')}
        </button>
      </div>
    </section>
  );
};

export default KetoDietIntro;