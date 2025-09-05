import React, { useEffect, useState } from "react";
import axios from "axios";
import ProfilePhotoWithEdit from "../components/ProfilePhotoWithEdit";
import { useUser } from './AuthContext';

export default function ProfilePage() {
  const { user, setUser } = useUser();
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const [quote, setQuote] = useState("");

  const formatDateForInput = (dateStr) => {
    if (!dateStr) return "";
    const [day, month, year] = dateStr.split("/");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
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
      await axios.put(`http://localhost:8081/api/users/${user.id}`, user);
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
              userId={user.id}
              onPhotoUploaded={handlePhotoUploaded}
            />
          </div>
        </div>

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
            <strong>Cumpleaños 🎂:</strong> {user.birthDate}
          </li>
          <li className="list-group-item">
            <strong>Edad:</strong> {user.age}
          </li>
          <li className="list-group-item">
            <strong>Género:</strong> {user.gender}
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
            <strong>Altura:</strong> {user.height} cm
          </li>
          <li className="list-group-item">
            <strong>Nivel de actividad 🏃:</strong> {user.activityLevel}
          </li>
          <li className="list-group-item">
            <strong>Objetivo 🎯:</strong> {user.goal}
          </li>
          <li className="list-group-item">
            <strong>¿Embarazada? 🤰</strong> {user.pregnant ? "Sí" : "No"}
          </li>
        </ul>
      </div>

      {/* Modal para editar perfil */}
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
              {/* Nombre */}
              <div className="mb-3">
                <label>Nombre</label>
                <input
                  type="text"
                  className="form-control"
                  value={user.name || ""}
                  onChange={(e) =>
                    setUser({ ...user, name: e.target.value })
                  }
                />
              </div>

              {/* Apellidos */}
              <div className="mb-3">
                <label>Apellidos</label>
                <input
                  type="text"
                  className="form-control"
                  value={user.lastName || ""}
                  onChange={(e) =>
                    setUser({ ...user, lastName: e.target.value })
                  }
                />
              </div>

              {/* Fecha de nacimiento */}
              <div className="mb-3">
                <label>Fecha de nacimiento</label>
                <input
                type="date"
                className="form-control"
                value={formatDateForInput(user.birthDate)}
                onChange={(e) =>
                  setUser({ ...user, birthDate: e.target.value }) // guardar en ISO o formatear según backend
                }
              />
              </div>

              {/* Edad */}
              <div className="mb-3">
                <label>Edad</label>
                <input
                  type="number"
                  className="form-control"
                  value={user.age || ""}
                  onChange={(e) =>
                    setUser({ ...user, age: e.target.value })
                  }
                />
              </div>

              {/* Género */}
              <div className="mb-3">
                <label>Género</label>
                <select
                  className="form-control"
                  value={user.gender || ""}
                  onChange={(e) =>
                    setUser({ ...user, gender: e.target.value })
                  }
                >
                  <option value="">Selecciona</option>
                  <option value="female">Femenino</option>
                  <option value="male">Masculino</option>
                </select>
              </div>

              {/* Email */}
              <div className="mb-3">
                <label>Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={user.email || ""}
                  onChange={(e) =>
                    setUser({ ...user, email: e.target.value })
                  }
                />
              </div>

              {/* Peso actual */}
              <div className="mb-3">
                <label>Peso actual (kg)</label>
                <input
                  type="number"
                  className="form-control"
                  value={user.currentWeight || ""}
                  onChange={(e) =>
                    setUser({ ...user, currentWeight: e.target.value })
                  }
                />
              </div>

              {/* Peso meta */}
              <div className="mb-3">
                <label>Peso meta (kg)</label>
                <input
                  type="number"
                  className="form-control"
                  value={user.targetWeight || ""}
                  onChange={(e) =>
                    setUser({ ...user, targetWeight: e.target.value })
                  }
                />
              </div>

              {/* Altura */}
              <div className="mb-3">
                <label>Altura (cm)</label>
                <input
                  type="number"
                  className="form-control"
                  value={user.height || ""}
                  onChange={(e) =>
                    setUser({ ...user, height: e.target.value })
                  }
                />
              </div>

              {/* Nivel de actividad */}
              <div className="mb-3">
                <label>Nivel de actividad</label>
                <select
                  className="form-control"
                  value={user.activityLevel || ""}
                  onChange={(e) =>
                    setUser({ ...user, activityLevel: e.target.value })
                  }
                >
                  <option value="">Selecciona</option>
                  <option value="sedentary">Sedentario</option>
                  <option value="light">Ligero</option>
                  <option value="moderate">Moderado</option>
                  <option value="active">Activo</option>
                </select>
              </div>

              {/* Objetivo */}
              <div className="mb-3">
                <label>Objetivo</label>
                <select
                  className="form-control"
                  value={user.goal || ""}
                  onChange={(e) => setUser({ ...user, goal: e.target.value })}
                >
                  <option value="">Selecciona</option>
                  <option value="Perder Peso">Perder peso</option>
                  <option value="Mantener">Mantener</option>
                  <option value="Ganar Músculo">Ganar músculo</option>
                </select>
              </div>

              {/* Embarazo */}
              <div className="mb-3 form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={user.pregnant || false}
                  onChange={(e) =>
                    setUser({ ...user, pregnant: e.target.checked })
                  }
                />
                <label className="form-check-label">Embarazada</label>
              </div>
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
