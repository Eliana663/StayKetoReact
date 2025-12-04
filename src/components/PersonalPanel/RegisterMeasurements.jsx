import { useState } from 'react';
import illustration from '../../assets/figura.png'; 
import { useUser } from '../AuthContext';
import { api } from "../../api";

export default function BodyMeasurementsForm() {

  const { user } = useUser();
  const [measurements, setMeasurements] = useState({
    brazo: '',
    pecho: '',
    bajoPecho: '',
    cintura: '',
    cadera: '',
    pierna: '',
    
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMeasurements(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Usuario no disponible");
      return;
    }
    
     const dto = {
        userId: user.id, 
        arm: parseInt(measurements.brazo),
        chest: parseInt(measurements.pecho),
        underBust: parseInt(measurements.bajoPecho),
        waist: parseInt(measurements.cintura),
        belly: parseInt(measurements.cadera),
        leg: parseInt(measurements.pierna),
        date: new Date().toISOString().split("T")[0]
      };

  try {
    const res = await api.post(
      "/api/daily-measurements",
      dto
    );
    console.log("Medidas guardadas:", res.data);
    alert("Medidas guardadas correctamente");
  } catch (error) {
    console.error(error);
    alert("Error guardando medidas");
  }

  };

  return (
    <div className="container mt-4">
      <div className="row">
        {/* Imagen con marcas */}
        <div className="col-md-6 position-relative">
          <img src={illustration} alt="Figura femenina" className="img-fluid" />

          {/* Puntos y etiquetas */}
          <span className="badge bg-white text-dark position-absolute" style={{ top: '23%', left: '15%' }}>Brazo</span>
          <span className="badge bg-white text-dark position-absolute" style={{ top: '23%', left: '59%' }}>Pecho</span>
          <span className="badge bg-white text-dark position-absolute" style={{ top: '27%', left: '25%' }}>Bajo Pecho</span>
          <span className="badge bg-white text-dark position-absolute" style={{ top: '31%', left: '29%' }}>Cintura</span>
          <span className="badge bg-white text-dark position-absolute" style={{ top: '39%', left: '25%' }}>Cadera</span>
          <span className="badge bg-white text-dark position-absolute" style={{ top: '50%', left: '25%' }}>Pierna</span>
          
        </div>

        {/* Formulario */}
        <div className="col-md-6">
          <form onSubmit={handleSubmit}>
            {Object.keys(measurements).map(key => (
              <div className="mb-3" key={key}>
                <label className="form-label">{key.replace(/([A-Z])/g, ' $1').toUpperCase()}</label>
                <input
                  type="number"
                  name={key}
                  value={measurements[key]}
                  onChange={handleChange}
                  placeholder="cm"
                  className="form-control"
                />
              </div>
            ))}
            <button type="submit" className="btn btn-primary">Guardar Medidas</button>
          </form>
        </div>
      </div>
    </div>
  );
}
