import React, { useState, useEffect } from "react";
import axios from "axios";
import HabitRing from '@/components/DailyHabits/HabitRing';
import HabitTrackerCircular from '@/components/DailyHabits/HabitTrackerCircular';

const userId = 1;

// Default habits
const defaultHabits = [
  { id: 1, name: "Ejercicio", done: false },
  { id: 2, name: "Tomar agua", done: false },
  { id: 3, name: "Dormir 8 horas", done: false },
  { id: 4, name: "Ayuno", done: false },
];

export default function PersonalPanel({ profilePhoto }) {
  // --- State ---
  const [user, setUser] = useState(null);
  const [habits, setHabits] = useState(defaultHabits); // current habits
  const [newHabit, setNewHabit] = useState("");         // input value
  const [monthlyHabits, setMonthlyHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const colors = ["#e63946", "#f1c40f", "#2ecc71", "#3498db", "#9b59b6", "#fd7e14", "#1abc9c"];
  const motivationalMessage = "Sigue adelante, ¡estás haciendo un gran trabajo! 💪";

  // --- Load user and habits ---
  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:8081/api/users/${userId}`)
      .then(res => {
        setUser(res.data);
        if (res.data.habits?.length) setHabits(res.data.habits);
        if (res.data.monthlyHabits) setMonthlyHabits(res.data.monthlyHabits);
      })
      .catch(() => setError("Error al cargar datos del usuario"))
      .finally(() => setLoading(false));
  }, []);

  // --- Add new habit ---
  const addHabit = () => {
    const trimmed = newHabit.trim();
    if (!trimmed) return;

    if (habits.some(h => h.name.toLowerCase() === trimmed.toLowerCase())) {
      return alert("Ya existe un hábito con ese nombre");
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const habitObj = { userId, habitName: trimmed, completed: false, date: todayStr };

    axios.post('http://localhost:8081/api/habit-tracker/bulk-habits', [habitObj])
      .then(res => {
        const saved = res.data[0];
        setHabits(prev => [
          ...prev,
          { id: saved.id, name: saved.habitName, done: saved.completed, trackerId: saved.id }
        ]);
        setNewHabit(""); // clear input
      })
      .catch(err => console.error("Error al agregar hábito:", err));
  };

  // --- Toggle habit ---
  const toggleHabit = (id) => {
    const habit = habits.find(h => h.id === id);
    if (!habit) return;

    const newDone = !habit.done;
    const todayStr = new Date().toISOString().split('T')[0];

    // Update habit locally
    setHabits(prev => prev.map(h => h.id === id ? { ...h, done: newDone } : h));

    axios.post('http://localhost:8081/api/habit-tracker/bulk-habits', [{
      userId,
      habitName: habit.name,
      completed: newDone,
      date: todayStr
    }])
    .then(res => {
      const trackerId = res.data[0]?.id;
      if (!trackerId) return;
      console.log("Response trackerId:", trackerId);

      // Update trackerId in habits
      setHabits(prev => prev.map(h => h.id === id ? { ...h, trackerId, done: newDone } : h));

      // Update monthlyHabits
      const today = new Date().getDate();
     setMonthlyHabits(prev => {
        const today = new Date().getDate();
        const existingDay = prev.find(d => d.dia === today);
        if (existingDay) {
          const updated = prev.map(d =>
            d.dia === today
              ? { 
                  ...d, 
                  dayHabits: [...d.dayHabits, { trackerId: habit.trackerId || habit.id, done: true }] 
                }
              : d
          );
          return updated;
        } else {
          return [...prev, { dia: today, dayHabits: [{ trackerId: habit.trackerId || habit.id, done: true }] }];
        }
      });
    })
    .catch(err => console.error("Error updating habit:", err));
  };

  // --- Prepare monthly habits for circular tracker ---
  const filteredMonthlyHabits = monthlyHabits.map(day => ({
    ...day,
    dayHabits: day.dayHabits.map(h => {
      const master = habits.find(m => m.id === h.id);
      return { ...h, done: master?.done || false };
    })
  }));

  if (loading) return <p>Cargando datos...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ maxWidth: 600, margin: "auto" }}>
      {user?.profilePhoto && (
        <img
          src={`http://localhost:8081/uploads/${user.profilePhoto}`}
          alt="Foto de perfil"
          style={{ width: 120, height: 120, borderRadius: "50%", objectFit: "cover", margin: "1rem auto", display: "block" }}
        />
      )}

      <h2>Bienvenido{user?.name ? `, ${user.name}` : ""} 👋</h2>
      <p style={{ fontStyle: "italic", color: "#2a9d8f", fontSize: "2rem" }}>{motivationalMessage}</p>

      <h4 style={{ margin: "40px 10px" }}>Mis hábitos cumplidos hoy:</h4>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {habits.map((habit, index) => {
          const baseColor = colors[index % colors.length];
          return (
            <button
              key={habit.id}
              onClick={() => toggleHabit(habit.id)}
              style={{
                width: 100,
                height: 100,
                borderRadius: "50%",
                border: habit.done ? `3px solid ${baseColor}` : "3px solid #ccc",
                backgroundColor: habit.done ? baseColor : "transparent",
                color: habit.done ? "white" : "black",
                cursor: "pointer",
                fontWeight: "bold",
                userSelect: "none",
              }}
              title={habit.name}
            >
              {habit.name}
            </button>
          );
        })}
      </div>

      <div style={{ marginTop: "1rem" }}>
        <input
          type="text"
          placeholder="Nuevo hábito"
          value={newHabit}
          onChange={e => setNewHabit(e.target.value)}
          style={{ padding: "0.4rem", marginRight: "0.5rem" }}
        />
        <button onClick={addHabit} style={{ padding: "0.5rem 1rem" }}>Añadir</button>
      </div>

      <div style={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center" }}>
        <h2 style={{ marginBottom: "10px" }}>Registro de hábitos mensual</h2>
        <HabitTrackerCircular habits={habits} monthlyHabits={filteredMonthlyHabits} />
      </div>
    </div>
  );
}
