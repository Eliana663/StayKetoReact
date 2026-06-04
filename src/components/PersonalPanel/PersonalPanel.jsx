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
import { useTranslation } from 'react-i18next'; 

export default function PersonalPanel() {
  const { user, setUser } = useAuth();
  const { t } = useTranslation(); 

  const defaultHabits = [
    { id: 1, key: "exercise", done: true, color: "#e63946" },
    { id: 2, key: "water", done: true, color: "#3498db" },
    { id: 3, key: "sleep", done: false, color: "#2ecc71" },
    { id: 4, key: "fasting", done: false, color: "#f1c40f" },
  ];
  
  const [habits, setHabits] = useState(() => 
    defaultHabits.map(h => ({ ...h, name: t(`personal_panel.habits.${h.key}`) }))
  ); 
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

  useEffect(() => {
    setHabits(prev => prev.map(h => {
      if (h.key) {
        return { ...h, name: t(`personal_panel.habits.${h.key}`) };
      }
      return h;
    }));
  }, [t]);

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
        dayHabits: defaultHabits.map(h => ({
          trackerId: h.id,
          name: t(`personal_panel.habits.${h.key}`),
          color: h.color
        }))
      }];
      setMonthlyHabits(demoMonthly);
      setLoading(false);
      setError(null);
    }, 500);
  }, [user?.id, t]);


  const addHabit = () => {
    const trimmed = newHabit.trim();
    
    if (!trimmed) return;
    if (habits.some(h => h.name.toLowerCase() === trimmed.toLowerCase())) {
      return alert(t("personal_panel.alert_exists"));
    }
    if (habits.length >= 6) {
      return alert(t("personal_panel.alert_max_habits"));
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
    setHabits(prev => prev.map(h => h.id === editingHabitId ? { ...h, name: editingHabitName.trim(), key: null } : h)); 
    setEditingHabitId(null);
  };

  const deleteHabit = (id) => {
    if (window.confirm(t("personal_panel.confirm_delete"))) {
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

  if (loading) return <p>{t("personal_panel.loading")}</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: "20px" }}>
      
      {/* INTEGRACIÓN DEL COMPONENTE DE FOTO */}
      <ProfilePhotoWithEdit 
          profilePhoto={user?.profilePhoto} 
          userId={user?.id} 
          onPhotoUploaded={() => {}} 
      />

      <h2 style={{ textAlign: "center" }}>
        {user?.name ? t("personal_panel.welcome", { name: user.name }) : t("personal_panel.welcome_default")} 👋
      </h2>
      <Quote />

      <h4 style={{ margin: "40px 10px 20px", textAlign: "center" }}>{t("personal_panel.habits_today")}</h4>
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

      <div style={{ marginTop: "2rem", textAlign: "center" }}>
        <input
          type="text" 
          placeholder={t("personal_panel.placeholder_new_habit")} 
          value={newHabit}
          onChange={e => setNewHabit(e.target.value)}
          style={{ padding: "0.5rem", borderRadius: "5px", border: "1px solid #ccc" }}
        />
        <button onClick={addHabit} style={{ padding: "0.5rem 1rem", marginLeft: "5px" }}>{t("personal_panel.btn_add")}</button>
      </div>

      <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
        <button onClick={() => setShowEditPanel(!showEditPanel)} style={{ padding: "0.6rem 1.5rem", borderRadius: "20px", cursor: "pointer" }}>
          {showEditPanel ? t("personal_panel.btn_close_edit") : t("personal_panel.btn_open_edit")}
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
        <button onClick={() => setShowAddWeight(true)} style={{ flex: 1, padding: "10px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "10px" }}>{t("personal_panel.btn_register_weight")}</button>
        <button onClick={() => setShowCheckKetosis(true)} style={{ flex: 1, padding: "10px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "10px" }}>{t("personal_panel.btn_check_ketosis")}</button>
        <button onClick={() => setShowBodyMeasurements(!showBodyMeasurements)} style={{ flex: 1, padding: "10px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "10px" }}>{t("personal_panel.btn_measurements")}</button>
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
          {t("personal_panel.monthly_record")}
        </h2>
        
        <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <HabitTrackerCircular monthlyHabits={filteredMonthlyHabits} />
        </div>
      </div>
    </div>
  );
}