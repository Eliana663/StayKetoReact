import React, { useState, useEffect } from "react";
import axios from "axios";
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
  const [newHabit, setNewHabit] = useState("");         
  const [monthlyHabits, setMonthlyHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const motivationalMessage = "Sigue adelante, ¡estás haciendo un gran trabajo! 💪";
  const colors = ["#e63946", "#f1c40f", "#2ecc71", "#3498db", "#9b59b6", "#fd7e14", "#1abc9c"];
  const habitColors = {};

  //Edit panel

  const [showEditPanel, setShowEditPanel] = useState(false);
  const [editingHabitId, setEditingHabitId] = useState(null);
  const [editingHabitName, setEditingHabitName] = useState("");

    defaultHabits.forEach((h, index) => {
    habitColors[h.name] = colors[index % colors.length];
      });

    defaultHabits.forEach((h, index) => {
    habitColors[h.name] = colors[index % colors.length];
  });



  // --- Load user and monthly habits ---
  useEffect(() => {
    setLoading(true);

    // Traer info del usuario
    axios.get(`http://localhost:8081/api/users/${userId}`)
      .then(res => setUser(res.data))
      .catch(() => setError("Error al cargar datos del usuario"));

    // Traer hábitos del mes
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    

    axios.get(`http://localhost:8081/api/habit-tracker/month?userId=${userId}&year=${year}&month=${month}`)
      .then(res => {
        const monthly = res.data.monthlyTracker.map(d => ({
          dia: new Date(d.date).getDate(),
          dayHabits: d.completedHabits.map(h => ({
            trackerId: h.id,
            done: true,
            name: h.name
          }))
        }));
        setMonthlyHabits(monthly);

        // Marcar los hábitos de hoy como completados
        const todayDay = today.getDate();
        const todayHabits = monthly.find(d => d.dia === todayDay)?.dayHabits || [];

       setHabits(prev =>
          prev.map(h => {
            const completedToday = todayHabits.find(th => th.name === h.name);
            return {
              ...h,
              done: !!completedToday,         
              trackerId: completedToday?.id || h.trackerId 
            };
          })
        );
        
      })
      .catch(() => setError("Error al cargar hábitos mensuales"))
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
    const habitObj = { userId, habit: trimmed, completed: false, date: todayStr };

    axios.post('http://localhost:8081/api/habit-tracker/bulk-habits', [habitObj])
      .then(res => {
        const saved = res.data[0];
        setHabits(prev => [
          ...prev,
          { id: saved.id, name: saved.habit, done: saved.completed, trackerId: saved.id }
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

    setHabits(prev => prev.map(h => h.id === id ? { ...h, done: newDone } : h));

    axios.post('http://localhost:8081/api/habit-tracker/bulk-habits', {
      userId,
      date: todayStr,
      habit: {id: habit.id, name: habit.name},
      completed: newDone
    })
    .then(res => {
      const updatedHabit = res.data[0];
      if (!updatedHabit?.id) return;

      setHabits(prev => prev.map(h => h.id === id 
        ? { ...h, trackerId: updatedHabit.id, done: updatedHabit.completed } 
        : h
      ));

      const today = new Date().getDate();
      setMonthlyHabits(prev => {
        
        const existingDay = prev.find(d => d.dia === today);
        const newDayHabit = { trackerId: updatedHabit.id, done: updatedHabit.completed, name: habit.name };

        if (existingDay) {
          const dayHabitsFiltered = existingDay.dayHabits.filter(hb => hb.trackerId !== updatedHabit.id);
          const newDayHabits = updatedHabit.completed ? [...dayHabitsFiltered, newDayHabit] : dayHabitsFiltered;
          return prev.map(d =>
            d.dia === today
              ? { ...d, dayHabits: [...dayHabitsFiltered, newDayHabit] }
              : d
          );
        } else {
          return [...prev, { dia: today, dayHabits: [newDayHabit] }];
        }
      });

    })
    .catch(err => console.error("Error updating habit:", err));
  };

   const startEditingHabit = (id) => {
    const habit = habits.find((h) => h.id === id);
    if (habit) {
      setEditingHabitId(id);
      setEditingHabitName(habit.name);
    }
  };

  const saveEditedHabit = () => {
    if (editingHabitName.trim() === "") {
      alert("El nombre del hábito no puede estar vacío.");
      return;
    }
    setHabits((prev) =>
      prev.map((h) =>
        h.id === editingHabitId ? { ...h, name: editingHabitName.trim() } : h
      )
    );
    setEditingHabitId(null);
    setEditingHabitName("");
  };

  const cancelEditing = () => {
    setEditingHabitId(null);
    setEditingHabitName("");
  };

  const deleteHabit = (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este hábito?")) {
      setHabits((prev) => prev.filter((h) => h.id !== id));
      setRegistroMensual((prev) =>
        prev.map((r) => ({
          ...r,
          habitosCumplidos: r.habitosCumplidos.filter((hid) => hid !== id),
        }))
      );
      if (editingHabitId === id) {
        cancelEditing();
      }
    }
  };

  
  const handleRegisterWeight = () => alert("Función para registrar peso hoy (a implementar)");
  const handleCheckKetosis = () => alert("Función para revisar si estás en cetosis (a implementar)");

  if (loading) return <p>Cargando datos...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  // --- Prepare monthly habits for circular tracker ---
  const filteredMonthlyHabits = monthlyHabits.map(day => {
    const dayHabitsArray = day.dayHabits || [];
    return {
      ...day,
      dayHabits: dayHabitsArray.map(h => {
        const master = habits.find(m => m.trackerId === h.trackerId || m.id === h.trackerId);
        return { ...h, done: master?.done ?? true };
      })
    };
  });

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

{/* Botón para abrir/cerrar panel edición */}
      <div style={{ marginTop: "1rem", textAlign: "center" }}>
        <button
          onClick={() => setShowEditPanel(!showEditPanel)}
          style={{
            padding: "0.6rem 1.5rem",
            fontWeight: "bold",
            cursor: "pointer",
            borderRadius: "20px",
            border: "1px solid #2a9d8f",
            backgroundColor: showEditPanel ? "#2a9d8f" : "transparent",
            color: showEditPanel ? "white" : "#2a9d8f",
            transition: "all 0.3s",
          }}
        >
          {showEditPanel ? "Cerrar edición de hábitos" : "Editar / Eliminar hábitos"}
        </button>
      </div>

      {/* Panel de edición */}
      {showEditPanel && (
        <div
          style={{
            marginTop: "1rem",
            border: "1px solid #ccc",
            borderRadius: "10px",
            padding: "1rem",
            maxHeight: 300,
            overflowY: "auto",
          }}
        >
          {habits.length === 0 && <p>No hay hábitos para editar.</p>}

          {habits.map((habit) => (
            <div
              key={habit.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "0.5rem",
              }}
            >
              {editingHabitId === habit.id ? (
                <>
                  <input
                    type="text"
                    value={editingHabitName}
                    onChange={(e) => setEditingHabitName(e.target.value)}
                    style={{ flexGrow: 1, marginRight: "0.5rem", padding: "0.3rem" }}
                  />
                  <button
                    onClick={saveEditedHabit}
                    style={{ marginRight: "0.3rem", padding: "0.3rem 0.6rem" }}
                  >
                    Guardar
                  </button>
                  <button
                    onClick={cancelEditing}
                    style={{ padding: "0.3rem 0.6rem" }}
                  >
                    Cancelar
                  </button>
                </>
              ) : (
                <>
                  <span>{habit.name}</span>
                  <div>
                    <button
                      onClick={() => startEditingHabit(habit.id)}
                      style={{ marginRight: "0.3rem", padding: "0.3rem 0.6rem" }}
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => deleteHabit(habit.id)}
                      style={{ color: "red", padding: "0.3rem 0.6rem" }}
                    >
                      🗑️
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      <div
        style={{
          marginTop: "1rem",
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
       <button
          onClick={handleRegisterWeight}
          style={{
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            padding: "0.6rem 1.5rem",
            borderRadius: "20px",
            fontWeight: "bold",
            cursor: "pointer",
            flexGrow: 1,
          }}
        >
          Registrar peso hoy
        </button>

        <button
          onClick={handleCheckKetosis}
          style={{
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            padding: "0.6rem 1.5rem",
            borderRadius: "20px",
            fontWeight: "bold",
            cursor: "pointer",
            flexGrow: 1,
          }}
        >
          Revisar si estoy en cetosis
        </button>
         <button
          onClick={handleCheckKetosis}
          style={{
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            padding: "0.6rem 1.5rem",
            borderRadius: "20px",
            fontWeight: "bold",
            cursor: "pointer",
            flexGrow: 1,
          }}
        >
          Registrar medidas hoy
        </button>
      </div>



      <div style={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center" }}>
        <h2 style={{ marginTop: "40px", marginBottom: "20px" }}>Registro de hábitos mensual</h2>
        <HabitTrackerCircular 
        habits={habits} 
        monthlyHabits={filteredMonthlyHabits}
        habitColors={habitColors}  />
      </div>
    </div>
  );
}