import { useState } from 'react';
import illustration from '../../assets/figura.png'; 
import { useAuth } from '../AuthContext';
import axios from "axios";
import { API_BASE_URL } from '../../constants';
import { useTranslation } from 'react-i18next';

export default function BodyMeasurementsForm() {
  const { user } = useAuth();
  const { t } = useTranslation();
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
      alert(t("measurements.alert_no_user"));
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
      const res = await axios.post(
        `${ API_BASE_URL }/api/daily-measurements`,
        dto
      );
      console.log("Medidas guardadas:", res.data);
      alert(t("measurements.alert_success"));
    } catch (error) {
      console.error(error);
      alert(t("measurements.alert_error"));
    }
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-6 position-relative">
          <img src={illustration} alt={t("measurements.alt_img")} className="img-fluid" />

          <span className="badge bg-white text-dark position-absolute" style={{ top: '23%', left: '15%' }}>
            {t("measurements.labels.brazo")}
          </span>
          <span className="badge bg-white text-dark position-absolute" style={{ top: '23%', left: '59%' }}>
            {t("measurements.labels.pecho")}
          </span>
          <span className="badge bg-white text-dark position-absolute" style={{ top: '27%', left: '25%' }}>
            {t("measurements.labels.bajoPecho")}
          </span>
          <span className="badge bg-white text-dark position-absolute" style={{ top: '31%', left: '29%' }}>
            {t("measurements.labels.cintura")}
          </span>
          <span className="badge bg-white text-dark position-absolute" style={{ top: '39%', left: '25%' }}>
            {t("measurements.labels.cadera")}
          </span>
          <span className="badge bg-white text-dark position-absolute" style={{ top: '50%', left: '25%' }}>
            {t("measurements.labels.pierna")}
          </span>
        </div>

        <div className="col-md-6">
          <form onSubmit={handleSubmit}>
            {Object.keys(measurements).map(key => (
              <div className="mb-3" key={key}>
                <label className="form-label">
                  {t(`measurements.labels.${key}`)}
                </label>
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
            <button type="submit" className="btn btn-primary">
              {t("measurements.btn_save")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}