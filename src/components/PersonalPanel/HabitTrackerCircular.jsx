import React from "react";

const colors = ["#e63946", "#f1c40f", "#2ecc71", "#3498db", "#9b59b6", "#fd7e14", "#1abc9c"];

const HabitTrackerCircular = ({ habits = [], registroMensual = [] }) => {
  const radius = 140;
  const center = 240;
  const numDays = 31;
  const anglePerDay = 360 / numDays;
  const habitCircleRadius = 10;
  const habitSpacing = 20;
  const svgSize = center * 2;

  const degToRad = (deg) => (deg * Math.PI) / 180;

  // Obtener nombre del mes dinámico en español
  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  const currentMonthName = monthNames[new Date().getMonth()];

  return (
    <svg width={svgSize} height={svgSize} viewBox={`0 0 ${svgSize} ${svgSize}`}>
      {/* Fondo círculo grande */}
      <circle cx={center} cy={center} r={radius} fill="#fafafa" stroke="#ccc" />

      {/* Título mes */}
      <text
        x={center}
        y={30}
        fontSize="24"
        fill="#333"
        textAnchor="middle"
        fontWeight="bold"

      >
       Mes: {currentMonthName}
      </text>

      {Array.from({ length: numDays }).map((_, dayIndex) => {
        const day = dayIndex + 1;
        const dayAngle = dayIndex * anglePerDay - 90;
        const habitosDia = registroMensual.find((r) => r.dia === day)?.habitosCumplidos || [];

        const angleRad = degToRad(dayAngle);
        const labelRadius = radius + 25; // fuera del anillo para los números
        const labelX = center + labelRadius * Math.cos(angleRad);
        const labelY = center + labelRadius * Math.sin(angleRad) + 5;

        return (
          <React.Fragment key={day}>
            {/* Grupo rotado para círculos */}
            <g transform={`translate(${center},${center}) rotate(${dayAngle})`}>
              {habitosDia.map((habitoId, i) => {
                const habitIndex = habits.findIndex((h) => h.id === habitoId);
                const color = habitIndex >= 0 ? colors[habitIndex % colors.length] : "#999";
                const cx = radius - (i * habitSpacing) - habitCircleRadius;
                const cy = 0;

                return (
                  <circle
                    key={i}
                    cx={cx}
                    cy={cy}
                    r={habitCircleRadius}
                    fill={color}
                    stroke="white"
                    strokeWidth={1}
                  />
                );
              })}
            </g>

            {/* Número del día, sin rotar */}
            <text
              x={labelX}
              y={labelY}
              fontSize="10"
              fill="#444"
              textAnchor="middle"
              alignmentBaseline="middle"
            >
              {day}
            </text>
          </React.Fragment>
        );
      })}
    </svg>
  );
};

export default HabitTrackerCircular;