
import ReactDOM from 'react-dom/client';
import React, { useState, useEffect } from "react";
import axios from "axios";
import EditWeights from "@/components/PersonalPanel/EditWeights";

export default function AddWeigh({ onClose }) { 
  const userId = 1;
  const [weight, setWeight] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [time] = useState(new Date().toLocaleTimeString()); 
  const [user, setUser] = useState({ targetWeight: "", currentWeight: "" });

  
  useEffect(() => {
    axios.get(`http://localhost:8081/api/users/${userId}`)
      .then((res) => setUser(res.data))
      .catch((err) => console.error(err));
  }, [userId]);

  
  const openGoalWeight = () => {
    const nuevaVentana = window.open('', '_blank', 'width=400,height=300,left=500,top=200');
    if (!nuevaVentana) return;

    const root = ReactDOM.createRoot(nuevaVentana.document.body);

    root.render(
      <EditWeights
        initialTargetWeight={user.targetWeight}
        initialCurrentWeight={user.currentWeight}
        onSave={async ({ targetWeight: newTarget, currentWeight: newCurrent }) => {
          try {
            // Guardar peso actual en historial
            await axios.post(
              `http://localhost:8081/api/graphics/users/${user.id}/daily-weight`,
              { weight: newCurrent }
            );

            // Guardar peso meta
            await axios.put(
              `http://localhost:8081/api/graphics/users/${user.id}/goal-weight`,
              { targetWeight: newTarget }
            );

            // Actualizar estados locales
            setUser({
              ...user,
              targetWeight: newTarget,
              currentWeight: newCurrent
            });
            setWeight(newCurrent);

            // Cerrar ventana
            nuevaVentana.close();
          } catch (err) {
            console.error(err);
            alert("Ocurrió un error al guardar el peso");
          }
        }}
      />
    );
  };

  // Guardar peso desde la ventana modal principal
  const handleSave = async () => {
    if (!user.id) {
      alert("Usuario no cargado todavía");
      return;
    }

    try {
      await axios.post(`http://localhost:8081/api/graphics/users/${user.id}/daily-weight`, {
        weight: parseFloat(weight)
      });

      // Actualizar estado local
      setUser(prev => ({
        ...prev,
        currentWeight: parseFloat(weight)
      }));

      alert("Peso guardado correctamente");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error al guardar el peso");
    }
  };

  return (
    <div 
      className="modal d-flex align-items-center justify-content-center show" 
      style={{
        display: "block", 
        backgroundColor: "rgba(0,0,0,0.7)", 
        backdropFilter: "blur(3px)",          
        zIndex: 1050
      }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content shadow-lg rounded-4">
          <div className="modal-header bg-success text-white rounded-top-4">
            <h4 className="modal-title">📊 Registra tu peso</h4>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <div className="modal-body p-4">
            <form>
              <div className="mb-3">
                <label className="form-label fw-bold">Fecha</label>
                <input 
                  type="date" 
                  className="form-control form-control-lg" 
                  value={date} 
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold">Hora</label>
                <input 
                  type="text" 
                  className="form-control form-control-lg" 
                  value={time} 
                  readOnly
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold">Peso (kg)</label>
                <input 
                  type="number" 
                  className="form-control form-control-lg" 
                  value={weight} 
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="Ej: 58.3"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-gray-800 font-semibold">
                  🎯 Peso meta: {user.targetWeight} kg
                </span>
                <button 
                  type="button"
                  onClick={openGoalWeight} 
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: '#0d8920ff', 
                    textDecoration: 'underline', 
                    cursor: 'pointer', 
                    marginLeft: '10px' 
                  }}
                >
                  Editar peso meta
                </button>
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary btn-lg" onClick={onClose}>
              Cancelar
            </button>
            <button type="button" className="btn btn-success btn-lg fw-bold" onClick={handleSave}>
              Guardar peso
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
