import React, { useState, useEffect } from "react";
import axios from "axios";



export default function AddWeigh({onClose}) { 

    const userId = 1;
    const [weight, setWeight] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [time] = useState(new Date().toLocaleTimeString()); 
    const [user, setUser] = useState({ targetWeight: "", });


    
        useEffect(() => {
        axios.get(`http://localhost:8081/api/users/${userId}`)
          .then((res) => setUser(res.data))
          .catch((err) => console.error(err));
        }, [userId]);


    const handleSave = () => {

      //Include Axios posst with userId, date, time and weight
        //aun no he hecho esta llamada en el post 


  
    axios.post("http://localhost:8081/api/weight/add", {
      userId,
      weight: parseFloat(weight)
    })
    .then(() => alert("Peso guardado correctamente"))
    .catch(err => console.error(err));
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
