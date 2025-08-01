import React from "react";

const colors = ["#e63946", "#f1c40f", "#2ecc71", "#3498db", "#9b59b6", "#fd7e14", "#1abc9c"];

const HabitTrackerCircular = ({ habits = [], registroMensual = [] }) => {
  const radius = 120;
  const center = 150;
  const numDays = 31;
  const anglePerDay = 360 / numDays;
  const habitCircleRadius = 6;
  const habitSpacing = 15; // distancia radial entre círculos de hábitos dentro de segmento

  // Helper para convertir grados a radianes
  const degToRad = (deg) => (deg * Math.PI) / 180;

  return (
    <svg width={300} height={300} viewBox="0 0 300 300">
      <circle cx={center} cy={center} r={radius} fill="#f0f0f0" stroke="#ccc" />

      {/* Para cada día */}
      {Array.from({ length: numDays }).map((_, dayIndex) => {
        const day = dayIndex + 1;
        const dayAngle = dayIndex * anglePerDay - 90; // Empezamos en vertical arriba

        // Busca el registro para este día (o [] si no hay)
        const habitosDia = registroMensual.find((r) => r.dia === day)?.habitosCumplidos || [];

        return (
          <g key={day} transform={`translate(${center},${center}) rotate(${dayAngle})`}>
            {/* Mini círculos para cada hábito cumplido */}
            {habitosDia.map((habitoId, i) => {
              // Color según hábito
              const habitIndex = habits.findIndex((h) => h.id === habitoId);
              const color = habitIndex >= 0 ? colors[habitIndex % colors.length] : "#999";

              // Posición radial del mini círculo dentro del segmento (de afuera hacia adentro)
              const cx = radius - (i * habitSpacing) - habitCircleRadius;
              const cy = 0;

              return <circle key={i} cx={cx} cy={cy} r={habitCircleRadius} fill={color} />;
            })}
          </g>
        );
      })}
    </svg>
  );
};

export default HabitTrackerCircular;