import React, { useState, useEffect } from "react";
import axios from "axios";

const userId = 1; // o pasa como prop si quieres

const defaultHabits = [
  { id: 1, name: "Ejercicio", done: false },
  { id: 2, name: "Tomar agua", done: false },
  { id: 3, name: "Dormir 8 horas", done: false },
  { id: 4, name: "Ayuno", done: false },
];

export default function PersonalPanel() {
  const [user, setUser] = useState(null);
  const [habits, setHabits] = useState(defaultHabits);
  const [newHabit, setNewHabit] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const motivationalMessage =
    "Sigue adelante, ¡estás haciendo un gran trabajo! 💪";

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:8081/api/users/${userId}`)
      .then((res) => {
        setUser(res.data);
        if (res.data.habits && res.data.habits.length > 0) {
          setHabits(res.data.habits);
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
  };

  const addHabit = () => {
    if (newHabit.trim() === "") return;
    setHabits((prev) => [
      ...prev,
      { id: Date.now(), name: newHabit.trim(), done: false },
    ]);
    setNewHabit("");
  };

  const saveHabits = () => {
    if (!user) return;
    setSaving(true);
    axios
      .put(`http://localhost:8081/api/users/${userId}`, {
        ...user,
        habits,
      })
      .then(() => alert("Hábitos guardados correctamente"))
      .catch(() => alert("Error al guardar hábitos"))
      .finally(() => setSaving(false));
  };

  const handleRegisterWeight = () => {
    alert("Función para registrar peso hoy (a implementar)");
  };

  const handleCheckKetosis = () => {
    alert("Función para revisar si estás en cetosis (a implementar)");
  };

  if (loading) return <p>Cargando datos...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ maxWidth: 600, margin: "auto" }}>
      <h2>Bienvenido{user?.name ? `, ${user.name}` : ""} 👋</h2>
      <p style={{ fontStyle: "italic", color: "#2a9d8f" }}>
        {motivationalMessage}
      </p>

      <h4>Mis hábitos</h4>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {habits.map(({ id, name, done }) => (
          <button
            key={id}
            onClick={() => toggleHabit(id)}
            style={{
              width: 100,
              height: 100,
              borderRadius: "50%",
              border: done ? "3px solid #28a745" : "3px solid #ccc",
              backgroundColor: done ? "#28a745" : "transparent",
              color: done ? "white" : "black",
              cursor: "pointer",
              fontWeight: "bold",
              userSelect: "none",
            }}
            title={name}
          >
            {name}
          </button>
        ))}
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

      <div style={{ marginTop: "1rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
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
    </div>
  );
}