import React, { useState, useEffect } from "react";
import axios from "axios";
import HabitTrackerCircular from '@/components/PersonalPanel/HabitTrackerCircular';
import AddWeight from "@/components/PersonalPanel/AddWeight";
import CheckKetosis from "@/components/PersonalPanel/CheckKetosis"
import BodyMeasurementsForm from "@/components/PersonalPanel/RegisterMeasurements";
import Quote from "../Quote";
import { useUser } from "../AuthContext";



const defaultHabits = [
  { id: 1, name: "Ejercicio", done: false },
  { id: 2, name: "Tomar agua", done: false },
  { id: 3, name: "Dormir 8 horas", done: false },
  { id: 4, name: "Ayuno", done: false },
];


export default function PersonalPanel({ profilePhoto }) {
 const { user, setUser } = useUser();
  // --- State ---
  const [habits, setHabits] = useState(defaultHabits); // current habits
  const [newHabit, setNewHabit] = useState("");         
  const [monthlyHabits, setMonthlyHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCheckKetosis, setShowCheckKetosis] = useState(false);
  const [showBodyMeasurements, setShowBodyMeasurements] = useState(false);
  const token = localStorage.getItem("token"); 
  const config = { headers: { Authorization: `Bearer ${token}` } };

  //Personal Panel buttons functions
  const [showAddWeight, setShowAddWeight] = useState(false);

  // Assign colors
  const colors = ["#e63946", "#f1c40f", "#2ecc71", "#3498db", "#9b59b6", "#fd7e14"];
  const habitColor = getRandomColor(habits); 
    

  //Edit panel
  const [showEditPanel, setShowEditPanel] = useState(false);
  const [editingHabitId, setEditingHabitId] = useState(null);
  const [editingHabitName, setEditingHabitName] = useState("");


  // Get Random color from palette
  function getRandomHexColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
  }
  function getRandomColor(habits) {
  
  const usedColors = habits.map(h => h.color);
  const availableColors = colors.filter(c => !usedColors.includes(c));

  if (availableColors.length > 0) {
    
    return availableColors[Math.floor(Math.random() * availableColors.length)];
  } else {
   
    let newColor;
    do {
      newColor = getRandomHexColor();
    } while (usedColors.includes(newColor)); 
    return newColor;
  }
}
   //Load user and monthly habits
 useEffect(() => {
  if (!user) return; // si no hay user, no hacemos nada
  setLoading(true);

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;

  Promise.all([
  axios.get(`http://localhost:8081/api/users/${user.id}`, config),
  axios.get(`http://localhost:8081/api/habit/user/${user.id}`, config),
  axios.get(`http://localhost:8081/api/habit/tracker/month?userId=${user.id}&year=${year}&month=${month}`, config)
])
  .then(([userRes, habitsRes, monthlyRes]) => {
    setUser(userRes.data);
    setHabits(habitsRes.data);

    const monthly = monthlyRes.data.monthlyTracker.map(d => ({
      dia: new Date(d.date).getDate(),
      dayHabits: d.completedHabits.map(h => ({
        trackerId: h.id,
        done: true,
        name: h.name,
        color: h.color
      }))
    }));
    setMonthlyHabits(monthly);
  })
  .catch(() => setError("Error al cargar datos del usuario o hábitos"))
  .finally(() => setLoading(false));
}, [user?.id]); 




  // --- Add new habit ---
  const addHabit = () => {
    const trimmed = newHabit.trim();
    if (!trimmed) return;

    if (habits.some(h => h.name.toLowerCase() === trimmed.toLowerCase())) {
      return alert("Ya existe un hábito con ese nombre");
    }

   if (habits.length >= 6) {
    return alert("No puedes agregar más de 6 hábitos");
  }

  const habitObj = {name: newHabit, userId: user.id, color: habitColor};

  
    axios.post('http://localhost:8081/api/habit/new-habit', habitObj)
      .then(res => {
        const saved = res.data;
        setHabits(prev => [
          ...prev, saved]);
        setNewHabit(""); // clear input
      })
      .catch(err => console.error("Error al agregar hábito:", err));
  };

  // --- Toggle habit ---
  const toggleHabit = (id) => {
  const habit = habits.find(h => h.id === id);
  if (!habit) return;

  const newDone = !habit.done;
  const today = new Date().getDate();

  
  setHabits(prev => prev.map(h => h.id === id ? { ...h, done: newDone } : h));


      setMonthlyHabits(prev => {
        const existingDay = prev.find(d => d.dia === today);
        const newDayHabit = { trackerId: habit.id, done: newDone, name: habit.name, color: habit.color };


        if (existingDay) {
          const dayHabitsFiltered = existingDay.dayHabits.filter(hb => hb.trackerId !== habit.id);
          const updatedDay = { 
            ...existingDay, 
            dayHabits: newDone ? [...dayHabitsFiltered, newDayHabit] : dayHabitsFiltered
          };
          return [...prev.filter(d => d.dia !== today), updatedDay];
        } else {
          return [...prev, { dia: today, dayHabits: [newDayHabit] }];
        }
      });

    
      const todayStr = new Date().toISOString().split('T')[0];
      axios.post('http://localhost:8081/api/habit/tracker/bulk-habits', {
        userId: user.id,
        date: todayStr,
        habit: { id: habit.id, name: habit.name },
        completed: newDone
      }).catch(err => console.error("Error updating habit:", err));
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

          
          setMonthlyHabits((prev) =>
            prev.map((day) => ({
              ...day,
              dayHabits: (day.dayHabits || []).filter(h => h.trackerId !== id),
              completedHabits: (day.completedHabits || []).filter((h) => h.trackerId !== id),
            }))
           );
          if (editingHabitId === id) cancelEditing();

         

          axios.delete(`http://localhost:8081/api/habit/delete/${id}`)
          .then(() => {
            setHabits(prev => prev.filter(h => h.id !==id));
          })

        }
      };

      const handleRegisterWeight = () => {
        setShowAddWeight(true);
      };

      const handleCloseModal = () => {
        setShowAddWeight(false);
      };


      const handleCheckKetosis = () => { 
        setShowCheckKetosis(true);
      };

      
      const handleToggleMeasurements = () => {
      setShowBodyMeasurements(prev => !prev);
    };

      const handleCloseMeasurements = () => {
        setShowBodyMeasurements(false);
      };

      if (loading) return <p>Cargando datos...</p>;
      if (error) return <p style={{ color: "red" }}>{error}</p>;

      // --- Prepare monthly habits for circular tracker ---
        const filteredMonthlyHabits = monthlyHabits.map(day => ({
          ...day,
          dayHabits: day.dayHabits.map(h => {
            const master = habits.find(m => m.trackerId ? m.trackerId === h.trackerId : m.id === h.id);
            return { ...h, done: master?.done ?? false };
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
       <Quote />

      <h4 style={{ margin: "40px 10px" }}>Mis hábitos cumplidos hoy:</h4>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {habits.map((habit) => {
          return (
            <button
              key={habit.id}
              onClick={() => toggleHabit(habit.id)}
              style={{
                width: 100,
                height: 100,
                borderRadius: "50%",
                border: habit.done ? `3px solid ${habit.color}` : "3px solid #ccc",
                backgroundColor: habit.done ? habit.color : "transparent",
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

        {showAddWeight && <AddWeight onClose={handleCloseModal} />}

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
          onClick={handleToggleMeasurements}
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


{showBodyMeasurements && <BodyMeasurementsForm onClose={handleCloseMeasurements} />}
      </div>
        {showCheckKetosis && (
          <div style={{ marginTop: "1rem", border: "1px solid #ccc", borderRadius: "10px", padding: "1rem" }}>
            <CheckKetosis onClose={() => setShowCheckKetosis(false)} />
          </div>
        )}


      <div style={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center" }}>
        <h2 style={{ marginTop: "40px", marginBottom: "20px" }}>Registro de hábitos mensual</h2>
        <HabitTrackerCircular monthlyHabits={filteredMonthlyHabits} />
      </div>
    </div>
  );
}