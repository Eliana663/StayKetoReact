import React, { useEffect, useState } from "react";

const HabitRing = ({ habits }) => {
  const radius = 60;
  const strokeWidth = 20;
  const gap = 2;
  const colors = ["#e63946", "#f1c40f", "#2ecc71", "#3498db", "#9b59b6", "#fd7e14", "#1abc9c"];

  const totalHabits = habits.length;
  const completedHabits = habits.filter((h) => h.done).length;
  const finalPercentage = totalHabits === 0 ? 0 : Math.round((completedHabits / totalHabits) * 100);

  const [animatedPercentage, setAnimatedPercentage] = useState(0);

  useEffect(() => {
    const duration = 800;
    const startTime = performance.now();

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.round(progress * finalPercentage);
      setAnimatedPercentage(value);
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [finalPercentage]);

  const anglePerHabit = 360 / totalHabits;
  const circumference = 2 * Math.PI * radius;

  return (
    <div
      style={{
        width: 180,
        height: 180,
        borderRadius: "50%",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        backgroundColor: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg width="160" height="160" viewBox="0 0 160 160">
        {habits.map((habit, index) => {
          const startAngle = index * anglePerHabit;
          const endAngle = startAngle + anglePerHabit - gap;
          const largeArc = endAngle - startAngle > 180 ? 1 : 0;

          const x1 = 80 + radius * Math.cos((Math.PI / 180) * startAngle);
          const y1 = 80 + radius * Math.sin((Math.PI / 180) * startAngle);
          const x2 = 80 + radius * Math.cos((Math.PI / 180) * endAngle);
          const y2 = 80 + radius * Math.sin((Math.PI / 180) * endAngle);

          return (
            <path
              key={habit.id}
              d={`M${x1},${y1} A${radius},${radius} 0 ${largeArc} 1 ${x2},${y2}`}
              stroke={colors[index % colors.length]}
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="round"
              opacity={habit.done ? 1 : 0.2}
            />
          );
        })}

        <text
          x="80"
          y="85"
          textAnchor="middle"
          fontSize="20"
          fontWeight="bold"
          fill="#333"
        >
          {animatedPercentage}%
        </text>
      </svg>
    </div>
  );
};

export default HabitRing;