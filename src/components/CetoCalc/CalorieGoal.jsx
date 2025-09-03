import React, { useState } from "react";
import ReactECharts from "echarts-for-react";

function CalorieChart() {
  const maxCalories = 3000;

  const goals = {
    LOSE_WEIGHT: { label: "Perder peso", target: 1400 },
    MAINTAIN: { label: "Mantener", target: 1600 },
    GAIN_MUSCLE: { label: "Ganar músculo", target: 2000 },
  };

  const [selectedGoal, setSelectedGoal] = useState("MAINTAIN");
  const [dailyCalories, setDailyCalories] = useState(goals[selectedGoal].target);

  const handleGoalClick = (goalKey) => {
    setSelectedGoal(goalKey);
    setDailyCalories(goals[goalKey].target);
  };

  // Determinar color del semicírculo según objetivo
  let mainColor;
  if (selectedGoal === "LOSE_WEIGHT") {
    mainColor = dailyCalories < 1600 ? "#ef4444" : "#22c55e";
  } else if (selectedGoal === "MAINTAIN") {
    mainColor = Math.abs(dailyCalories - 1600) <= 50 ? "#facc15" : "#22c55e";
  } else {
    mainColor = dailyCalories > 1600 ? "#22c55e" : "#ef4444";
  }

  const percentage = Math.min(dailyCalories / maxCalories, 1);

  const option = {
    series: [
      {
        type: "gauge",
        startAngle: 180,
        endAngle: 0,
        min: 0,
        max: 1,
        pointer: { show: true, length: "80%", width: 8 },
        axisLine: {
          lineStyle: {
            width: 30,
            color: [
              [percentage, mainColor],
              [1, "#e5e7eb"],
            ],
          },
        },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        detail: {
          valueAnimation: true,
          formatter: function (value) {
            return `${dailyCalories} kcal\nObjetivo diario de calorías`;
          },
          fontSize: 20,
          lineHeight: 30,
          offsetCenter: [0, "30%"], // ajusta verticalmente dentro del gauge
        },
        data: [{ value: percentage }],
      },
    ],
    animationDuration: 500,
  };

  return (
    
    <div style={{ width: "100%", maxWidth: "500px", margin: "0 auto", textAlign: "center" }}>
        {/* Título */}
        <h2 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "70px" }}>
            Mis Objetivos de Calorías
        </h2>
      {/* Botones arriba del gauge */}
      <div style={{ display: "flex", justifyContent: "center", gap: "16px", marginBottom: "24px" }}>
        {Object.keys(goals).map((key) => {
          const isActive = selectedGoal === key;
          return (
            <button
              key={key}
              onClick={() => handleGoalClick(key)}
              style={{
                padding: "12px 24px",
                borderRadius: "9999px",
                fontWeight: "800",
                fontSize: "18px",
                color: "white",
                backgroundColor: isActive ? "#16a34a" : "#22c55e",
                boxShadow: isActive ? "0 4px 10px rgba(0,0,0,0.3)" : "none",
                transform: isActive ? "scale(1.1)" : "scale(1)",
                transition: "all 0.3s",
                border: "none",
                cursor: "pointer",
              }}
            >
              {goals[key].label}
            </button>
          );
        })}
      </div>

      {/* Gauge */}
      <div style={{ width: "100%", height: "600px" }}>
        <ReactECharts option={option} style={{ width: "100%", height: "100%" }} />
      </div>

      {/* Slider debajo del gauge */}
      <input
        type="range"
        min={0}
        max={maxCalories}
        value={dailyCalories}
        onChange={(e) => setDailyCalories(Number(e.target.value))}
        style={{
          width: "100%",
          marginTop: "24px",
          height: "6px",
          borderRadius: "3px",
          accentColor: "#16a34a", 
        }}
      />
    </div>
  );
}

export default CalorieChart;
