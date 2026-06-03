import React from 'react';
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

export default function KetoDiet() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div
      style={{
        fontFamily: "'Poppins', sans-serif",
        maxWidth: '700px',
        margin: '40px auto',
        padding: '20px',
        backgroundColor: '#f9f9f9',
        borderRadius: '10px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
        textAlign: 'justify',
      }}
    >
      <h1 style={{ textAlign: 'center', color: '#2c3e50' }}>
        {t('keto_diet_info.title')}
      </h1>

      <p style={{ lineHeight: '1.6', color: '#34495e' }}>
        {t('keto_diet_info.paragraph_1')}
      </p>

      <p style={{ lineHeight: '1.6', color: '#34495e' }}>
        {t('keto_diet_info.paragraph_2')}
      </p>

      <p style={{ lineHeight: '1.6', color: '#34495e' }}>
        {t('keto_diet_info.paragraph_3')}
      </p>

      <p style={{ color: '#34495e', fontWeight: 'bold' }}>
        {t('keto_diet_info.app_help_lead', { appName: 'KetoDiet' })}
      </p>

      <ul style={{ color: '#34495e', lineHeight: '1.6' }}>
        <li>{t('keto_diet_info.benefit_list_1')}</li>
        <li>{t('keto_diet_info.benefit_list_2')}</li>
        <li>{t('keto_diet_info.benefit_list_3')}</li>
      </ul>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px' }}>
        <div style={{
          backgroundColor: '#e8f5e9',
          padding: '15px',
          borderRadius: '8px',
          borderLeft: '5px solid #4CAF50',
        }}>
          {t('keto_diet_info.box_fat')}
        </div>
        <div style={{
          backgroundColor: '#e3f2fd',
          padding: '15px',
          borderRadius: '8px',
          borderLeft: '5px solid #2196F3',
        }}>
          {t('keto_diet_info.box_diabetes')}
        </div>
        <div style={{
          backgroundColor: '#fff3e0',
          padding: '15px',
          borderRadius: '8px',
          borderLeft: '5px solid #FF9800',
        }}>
          {t('keto_diet_info.box_energy')}
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '30px' }}>
        <button
          onClick={() => navigate("/landing")}
          style={{
            padding: '12px 30px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
          }}
        >
          {t('keto_diet_info.btn_start')}
        </button>
      </div>
    </div>
  );
}