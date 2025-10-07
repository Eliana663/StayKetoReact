import { useState } from 'react';
import illustration from '../../assets/figura.png'; 

export default function BodyMeasurementsForm() {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Medidas ingresadas:', measurements);
    
  };

  return (
    <div className="container mt-4">
      <div className="row">
        {/* Imagen con marcas */}
        <div className="col-md-6 position-relative">
          <img src={illustration} alt="Figura femenina" className="img-fluid" />

          {/* Puntos y etiquetas */}
          <span className="badge bg-white text-dark position-absolute" style={{ top: '24%', left: '20%' }}>Brazo</span>
          <span className="badge bg-white text-dark position-absolute" style={{ top: '26%', left: '30%' }}>Pecho</span>
          <span className="badge bg-white text-dark position-absolute" style={{ top: '32%', left: '25%' }}>Bajo Pecho</span>
          <span className="badge bg-white text-dark position-absolute" style={{ top: '37%', left: '29%' }}>Cintura</span>
          <span className="badge bg-white text-dark position-absolute" style={{ top: '45%', left: '25%' }}>Cadera</span>
          <span className="badge bg-white text-dark position-absolute" style={{ top: '60%', left: '25%' }}>Muslo</span>
          
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
