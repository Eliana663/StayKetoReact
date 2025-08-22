import React from "react";


const HabitTrackerCircular = ({ habits = [], monthlyHabits = [], habitColors }) => {

  console.log("Render HabitTrackerCircular", { monthlyHabits });
  const radius = 250;
  const center = 380;
  const numDays = 31;
  const anglePerDay = 360 / numDays;
  const habitCircleRadius = 10;
  const habitSpacing = 25;
  const svgSize = center * 2;

  const degToRad = (deg) => (deg * Math.PI) / 180;

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  const currentMonthName = monthNames[new Date().getMonth()];

  return (
    <svg width={svgSize} height={svgSize} viewBox={`0 0 ${svgSize} ${svgSize}`}>
      {/* Fondo círculo grande */}
      <circle cx={center} cy={center} r={radius} fill="#fafafa" stroke="#ccc" />

      {/* Mes */}
      <text
        x={center}
        y={40}
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

        const dayHabits = (monthlyHabits || []).find(d => d.dia === day)?.dayHabits || [];
        const angleRad = degToRad(dayAngle);
        const labelRadius = radius + 25;
        const labelX = center + labelRadius * Math.cos(angleRad);
        const labelY = center + labelRadius * Math.sin(angleRad) + 5;

        return (
          <React.Fragment key={day}>
            <g transform={`translate(${center},${center}) rotate(${dayAngle})`}>
              {dayHabits.map((habitObj, i) => {
                // Buscamos el hábito completo para obtener el índice
                
                const circleColor = habitColors[habitObj.name] || "#ccc";

                const cx = radius - i * habitSpacing - habitCircleRadius;
                const cy = 0;

                return (
                  <circle
                    key={i}
                    cx={cx}
                    cy={cy}
                    r={habitCircleRadius}
                    fill={circleColor}
                    stroke="white"
                    strokeWidth={1}
                  />
                );
              })}
            </g>

            {/* Número del día */}
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