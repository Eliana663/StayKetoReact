import React, { useState, useEffect } from "react";
import axios from "axios";
import HabitTrackerCircular from '@/components/PersonalPanel/HabitTrackerCircular';
import AddWeight from "@/components/PersonalPanel/AddWeight";
import CheckKetosis from "@/components/PersonalPanel/CheckKetosis"
import BodyMeasurementsForm from "@/components/PersonalPanel/RegisterMeasurements";
import Quote from "../Quote";
import { useAuth } from "../AuthContext";
import { API_BASE_URL } from '../../constants';
import ProfilePhotoWithEdit from "../ProfilePhotoWithEdit";

const defaultHabits = [
  { id: 1, name: "Ejercicio", done: true, color: "#e63946" },
  { id: 2, name: "Tomar agua", done: true, color: "#3498db" },
  { id: 3, name: "Dormir 8 horas", done: false, color: "#2ecc71" },
  { id: 4, name: "Ayuno", done: false, color: "#f1c40f" },
];

export default function PersonalPanel() {
  const { user, setUser } = useAuth();
  
  const [habits, setHabits] = useState(defaultHabits); 
  const [newHabit, setNewHabit] = useState("");         
  const [monthlyHabits, setMonthlyHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCheckKetosis, setShowCheckKetosis] = useState(false);
  const [showBodyMeasurements, setShowBodyMeasurements] = useState(false);
  const [showAddWeight, setShowAddWeight] = useState(false);
  const [showEditPanel, setShowEditPanel] = useState(false);
  const [editingHabitId, setEditingHabitId] = useState(null);
  const [editingHabitName, setEditingHabitName] = useState("");

  const token = localStorage.getItem("token"); 
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const colors = ["#e63946", "#f1c40f", "#2ecc71", "#3498db", "#9b59b6", "#fd7e14"];


  function getRandomHexColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
  }

  function getRandomColor(currentHabits) {
    const usedColors = currentHabits.map(h => h.color);
    const availableColors = colors.filter(c => !usedColors.includes(c));
    if (availableColors.length > 0) {
      return availableColors[Math.floor(Math.random() * availableColors.length)];
    } else {
      let newColor;
      do { newColor = getRandomHexColor(); } while (usedColors.includes(newColor)); 
      return newColor;
    }
  }

  const habitColor = getRandomColor(habits);

  useEffect(() => {
    if (!user) return;
    setLoading(true);

    setTimeout(() => {
      const today = new Date().getDate();
      const demoMonthly = [{
        dia: today,
        dayHabits: [
          { trackerId: 1, name: "Ejercicio", color: "#e63946" },
          { trackerId: 2, name: "Tomar agua", color: "#3498db" },
          { trackerId: 3, name: "Dormir 8 horas", color: "#2ecc71" },
          { trackerId: 4, name: "Ayuno", color: "#f1c40f" }
        ]
      }];
      setMonthlyHabits(demoMonthly);
      setLoading(false);
      setError(null);
    }, 500);
  }, [user?.id]);


  const addHabit = () => {
  const trimmed = newHabit.trim();
  
  if (!trimmed) return;
  if (habits.some(h => h.name.toLowerCase() === trimmed.toLowerCase())) {
    return alert("Este hábito ya existe");
  }
  if (habits.length >= 6) {
    return alert("Por ahora, solo puedes tener 6 hábitos en la demo");
  }

   const newLocalHabit = {
    id: Date.now(), 
    name: trimmed,
    done: false,
    color: habitColor, 
    userId: user?.id || 999
  };


  setHabits(prev => [...prev, newLocalHabit]);
  setNewHabit("");
};

  const toggleHabit = (id) => {
    const habit = habits.find(h => h.id === id);
    if (!habit) return;

    const newDone = !habit.done;
    const today = new Date().getDate();

    setHabits(prev => prev.map(h => h.id === id ? { ...h, done: newDone } : h));

    setMonthlyHabits(prev => {
      const existingDay = prev.find(d => d.dia === today);
      const newDayHabit = { trackerId: habit.id, name: habit.name, color: habit.color };

      if (existingDay) {
        const dayHabitsFiltered = existingDay.dayHabits.filter(hb => hb.trackerId !== habit.id);
        const updatedDay = { 
          ...existingDay, 
          dayHabits: [...dayHabitsFiltered, newDayHabit] 
        };
        return prev.map(d => d.dia === today ? updatedDay : d);
      } else {
        return [...prev, { dia: today, dayHabits: [newDayHabit] }];
      }
    });

    const todayStr = new Date().toISOString().split('T')[0];
    axios.post(`${API_BASE_URL}/api/habit/tracker/bulk-habits`, {
      userId: user.id,
      date: todayStr,
      habit: { id: habit.id, name: habit.name },
      completed: newDone
    }, config).catch(err => console.error(err));
  };

  const startEditingHabit = (id) => {
    const habit = habits.find((h) => h.id === id);
    if (habit) { setEditingHabitId(id); setEditingHabitName(habit.name); }
  };

  const saveEditedHabit = () => {
    if (!editingHabitName.trim()) return;
    setHabits(prev => prev.map(h => h.id === editingHabitId ? { ...h, name: editingHabitName.trim() } : h));
    setEditingHabitId(null);
  };

  const deleteHabit = (id) => {
    if (window.confirm("¿Eliminar hábito?")) {
      setHabits(prev => prev.filter(h => h.id !== id));
      axios.delete(`${API_BASE_URL}/api/habit/delete/${id}`).catch(err => console.error(err));
    }
  };

  const filteredMonthlyHabits = monthlyHabits.map(day => {
    const synchedDayHabits = (day.dayHabits || []).map(h => {
      const master = habits.find(m => m.id === h.trackerId || m.id === h.id);
      return { ...h, done: master ? master.done : false };
    });

    return {
      ...day,
      dayHabits: synchedDayHabits.filter(h => h.done === true)
    };
  });

  if (loading) return <p>Cargando datos...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: "20px" }}>
      
      {/* INTEGRACIÓN DEL COMPONENTE DE FOTO */}
      <ProfilePhotoWithEdit 
          profilePhoto={user?.profilePhoto} 
          userId={user?.id} 
          onPhotoUploaded={() => {
          }} 
      />

      <h2 style={{ textAlign: "center" }}>Bienvenido{user?.name ? `, ${user.name}` : ""} 👋</h2>
      <Quote />

      <h4 style={{ margin: "40px 10px 20px", textAlign: "center" }}>Mis hábitos cumplidos hoy:</h4>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
        {habits.map((habit) => (
          <button
            key={habit.id}
            onClick={() => toggleHabit(habit.id)}
            style={{
              width: 100, height: 100, borderRadius: "50%",
              border: habit.done ? `3px solid ${habit.color}` : "3px solid #ccc",
              backgroundColor: habit.done ? habit.color : "transparent",
              color: habit.done ? "white" : "black",
              cursor: "pointer", fontWeight: "bold", transition: "all 0.3s"
            }}
          >
            {habit.name}
          </button>
        ))}
      </div>

      {/* --- EL RESTO DE TU LÓGICA DE INTERFAZ SE MANTIENE IGUAL --- */}
      <div style={{ marginTop: "2rem", textAlign: "center" }}>
        <input
          type="text" placeholder="Nuevo hábito" value={newHabit}
          onChange={e => setNewHabit(e.target.value)}
          style={{ padding: "0.5rem", borderRadius: "5px", border: "1px solid #ccc" }}
        />
        <button onClick={addHabit} style={{ padding: "0.5rem 1rem", marginLeft: "5px" }}>Añadir</button>
      </div>

      <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
        <button onClick={() => setShowEditPanel(!showEditPanel)} style={{ padding: "0.6rem 1.5rem", borderRadius: "20px", cursor: "pointer" }}>
          {showEditPanel ? "Cerrar edición" : "Editar / Eliminar hábitos"}
        </button>
      </div>

      {showEditPanel && (
        <div style={{ marginTop: "1rem", border: "1px solid #ccc", padding: "1rem", borderRadius: "10px" }}>
          {habits.map(habit => (
            <div key={habit.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
              {editingHabitId === habit.id ? (
                <input value={editingHabitName} onChange={e => setEditingHabitName(e.target.value)} />
              ) : <span>{habit.name}</span>}
              <div>
                <button onClick={() => editingHabitId === habit.id ? saveEditedHabit() : startEditingHabit(habit.id)}>
                  {editingHabitId === habit.id ? "✅" : "✏️"}
                </button>
                <button onClick={() => deleteHabit(habit.id)} style={{ color: "red" }}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: "2rem", display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <button onClick={() => setShowAddWeight(true)} style={{ flex: 1, padding: "10px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "10px" }}>Registrar peso</button>
        <button onClick={() => setShowCheckKetosis(true)} style={{ flex: 1, padding: "10px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "10px" }}>Check Cetosis</button>
        <button onClick={() => setShowBodyMeasurements(!showBodyMeasurements)} style={{ flex: 1, padding: "10px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "10px" }}>Medidas</button>
      </div>

      {showAddWeight && <AddWeight onClose={() => setShowAddWeight(false)} />}
      {showBodyMeasurements && <BodyMeasurementsForm onClose={() => setShowBodyMeasurements(false)} />}
      {showCheckKetosis && <CheckKetosis onClose={() => setShowCheckKetosis(false)} />}

     <div style={{ 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        justifyContent: "center",
        width: "100%",
        marginTop: "40px",
        overflow: "hidden" 
      }}>
        <h2 style={{ marginBottom: "20px", textAlign: "center" }}>
          Registro de hábitos mensual
        </h2>
        
        <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <HabitTrackerCircular monthlyHabits={filteredMonthlyHabits} />
        </div>
      </div>
    </div>
  );
}