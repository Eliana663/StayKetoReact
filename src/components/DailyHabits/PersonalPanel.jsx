import React, { useState, useEffect } from "react";
import axios from "axios";
import HabitRing from '@/components/DailyHabits/HabitRing';
import HabitTrackerCircular from '@/components/DailyHabits/HabitTrackerCircular';

const userId = 1;

const defaultHabits = [
  { id: 1, name: "Ejercicio", done: false },
  { id: 2, name: "Tomar agua", done: false },
  { id: 3, name: "Dormir 8 horas", done: false },
  { id: 4, name: "Ayuno", done: false },
];

export default function PersonalPanel({ profilePhoto }) {
  const [user, setUser] = useState(null);
  const [habits, setHabits] = useState(defaultHabits);
  const [newHabit, setNewHabit] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [registroMensual, setRegistroMensual] = useState([]);

  // Edit panel
  const [showEditPanel, setShowEditPanel] = useState(false);
  const [editingHabitId, setEditingHabitId] = useState(null);
  const [editingHabitName, setEditingHabitName] = useState("");

  const colors = ["#e63946", "#f1c40f", "#2ecc71", "#3498db", "#9b59b6", "#fd7e14", "#1abc9c"];
  const motivationalMessage = "Sigue adelante, ¡estás haciendo un gran trabajo! 💪";

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:8081/api/users/${userId}`)
      .then((res) => {
        setUser(res.data);
        if (res.data.habits && res.data.habits.length > 0) {
          setHabits(res.data.habits);
        }
        if (res.data.registroMensual) {
          setRegistroMensual(res.data.registroMensual);
        }
      })
      .catch(() => setError("Error al cargar datos del usuario"))
      .finally(() => setLoading(false));
  }, []);

  const toggleHabit = (id) => {
    setHabits((prev) =>
      prev.map((habit) =>
        habit.id === id ? { ...habit, done: !habit.done } : habit
      )
    );

    const today = new Date().getDate();

    setRegistroMensual((prev) => {
      const registroDia = prev.find((r) => r.dia === today);

      if (registroDia) {
        const habitExists = registroDia.habitosCumplidos.includes(id);
        const nuevosHabitos = habitExists
          ? registroDia.habitosCumplidos.filter((hid) => hid !== id)
          : [...registroDia.habitosCumplidos, id];

        return prev.map((r) =>
          r.dia === today ? { ...r, habitosCumplidos: nuevosHabitos } : r
        );
      } else {
        return [...prev, { dia: today, habitosCumplidos: [id] }];
      }
    });
  };

  const addHabit = () => {
    if (newHabit.trim() === "") return;
    setHabits((prev) => [
      ...prev,
      { id: Date.now(), name: newHabit.trim(), done: false },
    ]);
    setNewHabit("");
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

  const saveHabits = () => {
    if (!user) return;
    setSaving(true);
    axios
      .put(`http://localhost:8081/api/users/${userId}`, {
        ...user,
        habits,
        registroMensual,
      })
      .then(() => alert("Hábitos guardados correctamente"))
      .catch(() => alert("Error al guardar hábitos"))
      .finally(() => setSaving(false));
  };

  const handleRegisterWeight = () => alert("Función para registrar peso hoy (a implementar)");
  const handleCheckKetosis = () => alert("Función para revisar si estás en cetosis (a implementar)");

  if (loading) return <p>Cargando datos...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ maxWidth: 600, margin: "auto" }}>
      {/* Foto de perfil centrada */}
      {user && user.profilePhoto && (
        <img
          src={`http://localhost:8081/uploads/${user.profilePhoto}`}
          alt="Foto de perfil"
          style={{
            width: 120,
            height: 120,
            borderRadius: "50%",
            objectFit: "cover",
            margin: "1rem auto",
            display: "block",
          }}
        />
      )}

      <h2>Bienvenido{user?.name ? `, ${user.name}` : ""} 👋</h2>
      <p style={{ fontStyle: "italic", color: "#2a9d8f", fontSize: "2rem" }}>
        {motivationalMessage}
      </p>

      <h4 style={{ margin: "40px 10px" }}>Mis hábitos cumplidos hoy:</h4>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {habits.map((habit, index) => {
          const { id, name, done } = habit;
          const baseColor = colors[index % colors.length];
          return (
            <button
              key={id}
              onClick={() => toggleHabit(id)}
              style={{
                width: 100,
                height: 100,
                borderRadius: "50%",
                border: done ? `3px solid ${baseColor}` : "3px solid #ccc",
                backgroundColor: done ? baseColor : "transparent",
                color: done ? "white" : "black",
                cursor: "pointer",
                fontWeight: "bold",
                userSelect: "none",
              }}
              title={name}
            >
              {name}
            </button>
          );
        })}
      </div>

      <div style={{ marginTop: "1rem" }}>
        <input
          type="text"
          placeholder="Nuevo hábito"
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
          style={{ padding: "0.4rem", marginRight: "0.5rem" }}
        />
        <button onClick={addHabit} style={{ padding: "0.5rem 1rem" }}>
          Añadir
        </button>
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
          onClick={saveHabits}
          disabled={saving}
          style={{
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            padding: "0.6rem 1.5rem",
            borderRadius: "20px",
            fontWeight: "bold",
            cursor: saving ? "not-allowed" : "pointer",
            flexGrow: 1,
          }}
        >
          {saving ? "Guardando..." : "Guardar hábitos"}
        </button>

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
      </div>

      {/* Anillo y gráfico circular de hábitos */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          margin: "40px 0",
          gap: "3rem",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "3rem",
          }}
        >
          <h2 style={{ marginBottom: "10px", whiteSpace: "nowrap" }}>
            Progreso diario de hábitos
          </h2>
          <HabitRing habits={habits} />
        </div>

        <div style={{ textAlign: "center" }}>
          <h2 style={{ marginBottom: "10px" }}>Registro de hábitos mensual</h2>
          <HabitTrackerCircular habits={habits} registroMensual={registroMensual} />
        </div>
      </div>
    </div>
  );
}
