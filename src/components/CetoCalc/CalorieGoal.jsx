import React, { useState, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import axios from "axios";
import { useUser } from "../AuthContext"; 

function CalorieChart() {
  const { user } = useUser();
  const [goalValues, setGoalValues] = useState({
    loseWeight: 0,
    maintain: 0,
    gainMuscle: 0,
    goal: "",
  });
  const [selectedGoal, setSelectedGoal] = useState("");
  const [currentCalories, setCurrentCalories] = useState(0);

  const goalOptions = ["Perder peso", "Mantener", "Ganar musculo"];
  const maxCalories = 3000; 

  useEffect(() => {
    if (!user) return; 

    axios
      .get(`http://localhost:8081/api/calories/user/${user.id}`)
      .then((res) => {
        const data = res.data;
        setGoalValues(data);
        setSelectedGoal(data.goal); 
        
        if (data.goal === "Perder peso") setCurrentCalories(data.loseWeightCalories);
        else if (data.goal === "Mantener") setCurrentCalories(data.maintenanceCalories);
        else setCurrentCalories(data.gainMuscleCalories);
      })
      .catch((err) => console.error(err));
  }, [user]);

  // Manejar click en los botones
  const handleGoalClick = (goal) => {
    setSelectedGoal(goal);
    if (goal === "Perder peso") setCurrentCalories(goalValues.loseWeightCalories);
    else if (goal === "Mantener") setCurrentCalories(goalValues.maintenanceCalories);
    else setCurrentCalories(goalValues.gainMuscleCalories);
  };

  const percentage = Math.min(currentCalories / maxCalories, 1);

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
              [percentage, "#16a34a"],
              [1, "#e5e7eb"],
            ],
          },
        },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        detail: {
          valueAnimation: true,
          formatter: function () {
            return `${currentCalories.toFixed(0)} kcal\nObjetivo diario`;
          },
          fontSize: 20,
          lineHeight: 30,
          offsetCenter: [0, "30%"],
        },
        data: [{ value: percentage }],
      },
    ],
    animationDuration: 500,
  };

  return (
    <div style={{ width: "100%", maxWidth: "500px", margin: "0 auto", textAlign: "center" }}>
      <h2 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "70px" }}>
        Mis Objetivos de Calorías
      </h2>

      {/* Select goal buttons */}
      <div style={{ display: "flex", justifyContent: "center", gap: "16px", marginBottom: "24px" }}>
        {goalOptions.map((goal) => {
          const isActive = selectedGoal === goal;
          return (
            <button
              key={goal}
              onClick={() => handleGoalClick(goal)}
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
              {goal}
            </button>
          );
        })}
      </div>

      {/* Gauge */}
      <div style={{ width: "100%", height: "600px" }}>
        <ReactECharts option={option} style={{ width: "100%", height: "100%" }} />
      </div>
    </div>
  );
}

export default CalorieChart;
