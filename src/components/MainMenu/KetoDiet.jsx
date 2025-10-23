import React from 'react';
import { useNavigate } from "react-router-dom";

export default function KetoDiet() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        fontFamily: "'Poppins', sans-serif", // Fuente más llamativa
        maxWidth: '700px',
        margin: '40px auto',
        padding: '20px',
        backgroundColor: '#f9f9f9',
        borderRadius: '10px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
        textAlign: 'justify', // Justifica el texto
      }}
    >
      <h1 style={{ textAlign: 'center', color: '#2c3e50' }}>
        🥓 Descubre la Dieta Keto
      </h1>

      <p style={{ lineHeight: '1.6', color: '#34495e' }}>
        La dieta cetogénica (Keto) es un plan de alimentación bajo en carbohidratos y alto en grasas
        saludables que ayuda a tu cuerpo a entrar en cetosis, un estado en el que quema grasa
        como fuente principal de energía.
      </p>

      <p style={{ lineHeight: '1.6', color: '#34495e' }}>
        Tiene muchos beneficios comprobados para la pérdida de peso, la salud y el rendimiento, respaldados por más de 50 estudios. Por eso, cada vez más médicos y profesionales de la salud la recomiendan.
      </p>

      <p style={{ lineHeight: '1.6', color: '#34495e' }}>
        Una dieta cetogénica puede ayudarte a quemar el exceso de grasa corporal sin pasar hambre, 
        como así también a mejorar la diabetes tipo 2 y el síndrome metabólico.
      </p>

      <p style={{ color: '#34495e', fontWeight: 'bold' }}>
        Nuestra app <strong>KetoDiet</strong> te ayuda a:
      </p>

      <ul style={{ color: '#34495e', lineHeight: '1.6' }}>
        <li>📋 Registrar tus comidas y mantener un balance keto correcto.</li>
        <li>📊 Seguir tu progreso con gráficos de cetosis y peso.</li>
        <li>💡 Recibir consejos personalizados según tus objetivos.</li>
      </ul>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px' }}>
        <div style={{
          backgroundColor: '#e8f5e9',
          padding: '15px',
          borderRadius: '8px',
          borderLeft: '5px solid #4CAF50',
        }}>
          🔥 Quemar grasa corporal sin pasar hambre
        </div>
        <div style={{
          backgroundColor: '#e3f2fd',
          padding: '15px',
          borderRadius: '8px',
          borderLeft: '5px solid #2196F3',
        }}>
          💉 Mejorar la diabetes tipo 2 y el síndrome metabólico
        </div>
        <div style={{
          backgroundColor: '#fff3e0',
          padding: '15px',
          borderRadius: '8px',
          borderLeft: '5px solid #FF9800',
        }}>
          🧠 Aumentar energía y concentración
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
          Empezar ahora 🚀
        </button>
      </div>
    </div>
  );
}
