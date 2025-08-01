const HabitRing = ({ habits }) => {
  const radius = 60;
  const strokeWidth = 20;
  const circumference = 2 * Math.PI * radius;
  const gap = 2; // Separación entre segmentos
  const colors = ["#e63946", "#f1c40f", "#2ecc71", "#3498db", "#9b59b6", "#fd7e14", "#1abc9c"];

  const numHabits = habits.length;
  const anglePerHabit = 360 / numHabits;

  return (
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
    </svg>
    
  );
};

export default HabitRing;