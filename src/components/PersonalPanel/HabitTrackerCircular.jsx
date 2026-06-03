import React from "react";

const HabitTrackerCircular = ({ monthlyHabits = [] }) => {
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
      <circle cx={center} cy={center} r={radius} fill="#fafafa" stroke="#ccc" />

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

        const dayData = (monthlyHabits || []).find(d => d.dia === day);
        const rawDayHabits = dayData?.dayHabits || [];

        const uniqueHabitsMap = new Map();
        rawDayHabits.forEach(h => {
          if (h.nombreHábito) {
            uniqueHabitsMap.set(h.nombreHábito, h);
          } else if (h.color) {
            uniqueHabitsMap.set(h.color, h); 
          }
        });
        
        const dayHabits = Array.from(uniqueHabitsMap.values());

        const angleRad = degToRad(dayAngle);
        const labelRadius = radius + 25;
        const labelX = center + labelRadius * Math.cos(angleRad);
        const labelY = center + labelRadius * Math.sin(angleRad) + 5;

        return (
          <React.Fragment key={day}>
            <g transform={`translate(${center},${center}) rotate(${dayAngle})`}>
              {dayHabits.map((habitObj, index) => {
                const circleColor = habitObj.color || "#ccc";
               
                const cx = radius - index * habitSpacing - habitCircleRadius;
                
                return (
                  <circle
                    key={`${day}-${habitObj.nombreHábito || index}`}
                    cx={cx}
                    cy={0}
                    r={habitCircleRadius}
                    fill={circleColor}
                    stroke="white"
                    strokeWidth={1}
                  />
                );
              })}
            </g>

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