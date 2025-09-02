import React, { useEffect, useState } from "react";
import axios from "axios";
import ProfilePhotoWithEdit from "../components/ProfilePhotoWithEdit";


export default function ProfilePage() {
  const userId = 1;
  const [user, setUser] = useState({
    age: "",
    height: "",
  });
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const [quote, setQuote] = useState("");

  useEffect(() => {
    axios.get(`http://localhost:8081/api/users/${userId}`).then((res) => {
      setUser(res.data);
          });

    
    axios
      .get("https://api.quotable.io/random?tags=inspirational|motivational")
      .then((res) => setQuote(res.data.content))
      .catch(() =>
        setQuote("Sigue adelante, lo estás haciendo muy bien. ¡Tú puedes!")
      );
  }, [reloadTrigger]);

  const handlePhotoUploaded = () => {
    setReloadTrigger((prev) => prev + 1);
  };

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:8081/api/users/${userId}`, user);
      alert("Datos guardados correctamente");
      setReloadTrigger((prev) => prev + 1);
    } catch (err) {
      alert("Error al guardar los cambios");
    }
  };

  if (!user)
    return (
      <p className="text-center mt-5" style={{ fontSize: "1.2rem" }}>
        Cargando perfil...
      </p>
    );

  return (
    <>
      <div className="card shadow p-4 mx-auto" style={{ maxWidth: "600px" }}>
        <div className="text-center">
          <h3 className="mb-1">
            Bienvenida, {user.name} <span>👋</span>
          </h3>
          <p className="text-muted mb-3 fst-italic">"{quote}"</p>

          <div className="text-center mb-3">
            <ProfilePhotoWithEdit
              profilePhoto={user.profilePhoto}
              userId={userId}
              onPhotoUploaded={handlePhotoUploaded}
            />
          </div>
        </div>

        {/* Datos con botón editar */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">Datos del perfil</h5>
          <button
            className="btn btn-sm btn-outline-primary"
            data-bs-toggle="modal"
            data-bs-target="#editProfileModal"
          >
            <i className="bi bi-pencil-fill me-1"></i> Editar
          </button>
        </div>

        <ul className="list-group mb-3">
          <li className="list-group-item">
            <strong>Nombre:</strong> {user.name}
          </li>
          <li className="list-group-item">
            <strong>Apellidos:</strong> {user.lastName}
          </li>
          <li className="list-group-item">
            <strong>Cumpleaños 🎂</strong> {user.birthDate}
          </li>
          <li className="list-group-item">
            <strong>Edad</strong> {user.age}
          </li>
          <li className="list-group-item">
            <strong>Género: </strong> {user.gender}
          </li>
          <li className="list-group-item">
            <strong>Email:</strong> {user.email}
          </li>
          <li className="list-group-item">
            <strong>Peso actual:</strong> {user.currentWeight} kg
          </li>
          <li className="list-group-item">
            <strong>Peso meta:</strong> {user.targetWeight} kg
          </li>
          <li className="list-group-item">
            <strong>Altura:</strong> {user.height} kg
          </li>
          <li className="list-group-item">
            <strong>Nivel de actividad 🏃 </strong> {user.activityLevel}
          </li>
          <li className="list-group-item">
            <strong>¿Embarazada? 🤰</strong> {user.pregnant ? "Sí" : "No"}
          </li>
        </ul>
      </div>

      {/* Modal para editar */}
      <div
        className="modal fade"
        id="editProfileModal"
        tabIndex="-1"
        aria-labelledby="editProfileModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="editProfileModalLabel">
                Editar perfil
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Cerrar"
              ></button>
            </div>
            <div className="modal-body">
              {/* Inputs para editar perfil */}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-success"
                onClick={handleSave}
                data-bs-dismiss="modal"
              >
                Guardar cambios
              </button>
            </div>
          </div>
        </div>
      </div>

      
      
    </>
  );
}
