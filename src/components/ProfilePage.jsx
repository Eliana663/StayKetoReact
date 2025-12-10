import React, { useEffect, useState } from "react";
import axios from "axios";
import ProfilePhotoWithEdit from "../components/ProfilePhotoWithEdit";
import { useAuth } from "./AuthContext";
import Quote from "./Quote";

function ProfilePage() {
  const { user, setUser } = useAuth();
  const [reloadTrigger, setReloadTrigger] = useState(0);

  const formatDateForInput = (dateStr) => {
  if (!dateStr) return "";

  if (dateStr.includes("-")) return dateStr;

  const [day, month, year] = dateStr.split("/");
  return `${year}-${month}-${day}`;
};


  const handlePhotoUploaded = () => {
    setReloadTrigger((prev) => prev + 1);
  };

const handleSave = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No hay token disponible. Inicia sesión de nuevo.");
      return;
    }

     const payload = {
      name: user.name,
      lastName: user.lastName,
      birthDate: user.birthDate,
      age: user.age,
      gender: user.gender,
      currentWeight: user.currentWeight,
      targetWeight: user.targetWeight,
      height: user.height,
      activityLevel: user.activityLevel,
      goal: user.goal,
      pregnant: user.pregnant,
      email: user.email,
    };

     
    const res = await axios.put(
      `http://localhost:8081/api/users/${user.id}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`, // 🔑 aquí está el header
        },
      }
    );

    console.log("Respuesta del servidor:", res.data);
    alert("Datos guardados correctamente");

   
    if (setReloadTrigger) {
      setReloadTrigger((prev) => prev + 1);
    }

  } catch (err) {
    console.error("Error al guardar los cambios:", err.response?.data || err.message);
    alert("Error al guardar los cambios: revisa la consola para más detalles");
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
        {user?.name
          ? user.gender === "male"
            ? `Bienvenido, ${user.name}`
            : user.gender === "female"
            ? `Bienvenida, ${user.name}`
            : `${user.name}`
          : "Bienvenido/a"}{" "}
        <span>👋</span>
      </h3>
          <Quote />
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
            data-testid="edit-profile-btn"
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
                <label htmlFor="nameInput">Nombre</label>
                <input
                  id="nameInput"
                  type="text"
                  className="form-control"
                  value={user.name || ""}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                />
              </div>

              {/* Apellidos */}
              <div className="mb-3">
                <label htmlFor="lastNameInput">Apellidos</label>
                <input
                  id="lastNameInput"
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
                <label htmlFor="birthDateInput">Fecha de nacimiento</label>
                <input
                  id="birthDateInput"
                  type="date"
                  className="form-control"
                  value={formatDateForInput(user.birthDate)}
                  onChange={(e) =>
                    setUser({ ...user, birthDate: e.target.value })
                    
                  }
                />
              </div>

              {/* Edad */}
              <div className="mb-3">
                <label htmlFor="ageInput">Edad</label>
                <input
                  id="ageInput"
                  type="number"
                  className="form-control"
                  value={user.age || ""}
                  onChange={(e) => setUser({ ...user, age: e.target.value })}
                />
              </div>

              {/* Género */}
              <div className="mb-3">
                <label htmlFor="genderInput">Género</label>
                <select
                  id="genderInput"
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
                <label htmlFor="emailInput">Email</label>
                <input
                  id="emailInput"
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
                <label htmlFor="currentWeightInput">Peso actual (kg)</label>
                <input
                  id="currentWeightInput"
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
                <label htmlFor="targetWeightInput">Peso meta (kg)</label>
                <input
                  id="targetWeightInput"
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
                <label htmlFor="heightInput">Altura (cm)</label>
                <input
                  id="heightInput"
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
                <label htmlFor="activityLevelInput">Nivel de actividad</label>
                <select
                  id="activityLevelInput"
                  className="form-control"
                  value={user.activityLevel || ""}
                  onChange={(e) =>
                    setUser({ ...user, activityLevel: e.target.value })
                  }
                >
                  <option value="">Selecciona</option>
                  <option value="Sedentario">Sedentario</option>
                  <option value="Ligero">Ligero</option>
                  <option value="Moderado">Moderado</option>
                  <option value="Activo">Activo</option>
                </select>
              </div>

              {/* Objetivo */}
              <div className="mb-3">
                <label htmlFor="goalInput">Objetivo</label>
                <select
                  id="goalInput"
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
                  id="pregnantInput"
                  type="checkbox"
                  className="form-check-input"
                  checked={user.pregnant || false}
                  onChange={(e) =>
                    setUser({ ...user, pregnant: e.target.checked })
                  }
                />
                <label htmlFor="pregnantInput" className="form-check-label">
                  Embarazada
                </label>
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
                  onClick={() => {
                  document.activeElement.blur(); // quita el foco del botón
                  handleSave();                  // guarda los cambios
                }}
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

export default ProfilePage;
