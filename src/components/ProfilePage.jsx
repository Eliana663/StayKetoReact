import React, { useEffect, useState } from "react";
import axios from "axios";
import ProfilePhotoWithEdit from "../components/ProfilePhotoWithEdit";
import { useAuth } from "./AuthContext";
import Quote from "./Quote";
import { API_BASE_URL } from '../constants';
import { useTranslation } from 'react-i18next'; 

function ProfilePage() {
  const { user, setUser } = useAuth();
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const { t } = useTranslation(); 

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
        alert(t("profile.alert_no_token"));
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
        `${ API_BASE_URL }/api/users/${user.id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }
      );

      console.log("Respuesta del servidor:", res.data);
      alert(t("profile.alert_success"));

      if (setReloadTrigger) {
        setReloadTrigger((prev) => prev + 1);
      }

    } catch (err) {
      console.error("Error al guardar los cambios:", err.response?.data || err.message);
      alert(t("profile.alert_error"));
    }
  };

  if (!user)
    return (
      <p className="text-center mt-5" style={{ fontSize: "1.2rem" }}>
        {t("profile.loading")}
      </p>
    );

  const getWelcomeMessage = () => {
    if (!user?.name) return t("profile.welcome_default");
    if (user.gender === "male") return t("profile.welcome_male", { name: user.name });
    if (user.gender === "female") return t("profile.welcome_female", { name: user.name });
    return t("profile.welcome_generic", { name: user.name });
  };

  return (
    <>
      <div className="card shadow p-4 mx-auto" style={{ maxWidth: "600px" }}>
        <div className="text-center">
          <h3 className="mb-1">
            {getWelcomeMessage()} <span>👋</span>
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
          <h5 className="mb-0">{t("profile.title_data")}</h5>
          <button
            data-testid="edit-profile-btn"
            className="btn btn-sm btn-outline-primary"
            data-bs-toggle="modal"
            data-bs-target="#editProfileModal"
          >
            <i className="bi bi-pencil-fill me-1"></i> {t("profile.btn_edit")}
          </button>
        </div>

        <ul className="list-group mb-3">
          <li className="list-group-item">
            <strong>{t("profile.label_name")}:</strong> {user.name}
          </li>
          <li className="list-group-item">
            <strong>{t("profile.label_lastname")}:</strong> {user.lastName}
          </li>
          <li className="list-group-item">
            <strong>{t("profile.label_birthday")}:</strong> {user.birthDate}
          </li>
          <li className="list-group-item">
            <strong>{t("profile.label_age")}:</strong> {user.age}
          </li>
          <li className="list-group-item">
            <strong>{t("profile.label_gender")}:</strong> {user.gender}
          </li>
          <li className="list-group-item">
            <strong>{t("profile.label_email")}:</strong> {user.email}
          </li>
          <li className="list-group-item">
            <strong>{t("profile.label_current_weight")}:</strong> {user.currentWeight} kg
          </li>
          <li className="list-group-item">
            <strong>{t("profile.label_target_weight")}:</strong> {user.targetWeight} kg
          </li>
          <li className="list-group-item">
            <strong>{t("profile.label_height")}:</strong> {user.height} cm
          </li>
          <li className="list-group-item">
            <strong>{t("profile.label_activity")}:</strong> {user.activityLevel}
          </li>
          <li className="list-group-item">
            <strong>{t("profile.label_goal")}:</strong> {user.goal}
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
                {t("profile.modal_title")}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label={t("profile.btn_close")}
              ></button>
            </div>
            <div className="modal-body">
              {/* Nombre */}
              <div className="mb-3">
                <label htmlFor="nameInput">{t("profile.label_name")}</label>
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
                <label htmlFor="lastNameInput">{t("profile.label_lastname")}</label>
                <input
                  id="lastNameInput"
                  type="text"
                  className="form-control"
                  value={user.lastName || ""}
                  onChange={(e) => setUser({ ...user, lastName: e.target.value })}
                />
              </div>

              {/* Fecha de nacimiento */}
              <div className="mb-3">
                <label htmlFor="birthDateInput">{t("profile.label_birthday")}</label>
                <input
                  id="birthDateInput"
                  type="date"
                  className="form-control"
                  value={formatDateForInput(user.birthDate)}
                  onChange={(e) => setUser({ ...user, birthDate: e.target.value })}
                />
              </div>

              {/* Edad */}
              <div className="mb-3">
                <label htmlFor="ageInput">{t("profile.label_age")}</label>
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
                <label htmlFor="genderInput">{t("profile.label_gender")}</label>
                <select
                  id="genderInput"
                  className="form-control"
                  value={user.gender || ""}
                  onChange={(e) => setUser({ ...user, gender: e.target.value })}
                >
                  <option value="">{t("profile.select_choose")}</option>
                  <option value="female">{t("profile.gender_female")}</option>
                  <option value="male">{t("profile.gender_male")}</option>
                </select>
              </div>

              {/* Email */}
              <div className="mb-3">
                <label htmlFor="emailInput">{t("profile.label_email")}</label>
                <input
                  id="emailInput"
                  type="email"
                  className="form-control"
                  value={user.email || ""}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                />
              </div>

              {/* Peso actual */}
              <div className="mb-3">
                <label htmlFor="currentWeightInput">{t("profile.label_current_weight")} (kg)</label>
                <input
                  id="currentWeightInput"
                  type="number"
                  className="form-control"
                  value={user.currentWeight || ""}
                  onChange={(e) => setUser({ ...user, currentWeight: e.target.value })}
                />
              </div>

              {/* Peso meta */}
              <div className="mb-3">
                <label htmlFor="targetWeightInput">{t("profile.label_target_weight")} (kg)</label>
                <input
                  id="targetWeightInput"
                  type="number"
                  className="form-control"
                  value={user.targetWeight || ""}
                  onChange={(e) => setUser({ ...user, targetWeight: e.target.value })}
                />
              </div>

              {/* Altura */}
              <div className="mb-3">
                <label htmlFor="heightInput">{t("profile.label_height")} (cm)</label>
                <input
                  id="heightInput"
                  type="number"
                  className="form-control"
                  value={user.height || ""}
                  onChange={(e) => setUser({ ...user, height: e.target.value })}
                />
              </div>

              {/* Nivel de actividad */}
              <div className="mb-3">
                <label htmlFor="activityLevelInput">{t("profile.label_activity")}</label>
                <select
                  id="activityLevelInput"
                  className="form-control"
                  value={user.activityLevel || ""}
                  onChange={(e) => setUser({ ...user, activityLevel: e.target.value })}
                >
                  <option value="">{t("profile.select_choose")}</option>
                  <option value="Sedentario">{t("profile.activity_sedentary")}</option>
                  <option value="Ligero">{t("profile.activity_light")}</option>
                  <option value="Moderado">{t("profile.activity_moderate")}</option>
                  <option value="Activo">{t("profile.activity_active")}</option>
                </select>
              </div>

              {/* Objetivo */}
              <div className="mb-3">
                <label htmlFor="goalInput">{t("profile.label_goal")}</label>
                <select
                  id="goalInput"
                  className="form-control"
                  value={user.goal || ""}
                  onChange={(e) => setUser({ ...user, goal: e.target.value })}
                >
                  <option value="">{t("profile.select_choose")}</option>
                  <option value="Perder Peso">{t("profile.goal_lose")}</option>
                  <option value="Mantener">{t("profile.goal_maintain")}</option>
                  <option value="Ganar Músculo">{t("profile.goal_gain")}</option>
                </select>
              </div>

              {/* Embarazo */}
              <div className="mb-3 form-check">
                <input
                  id="pregnantInput"
                  type="checkbox"
                  className="form-check-input"
                  checked={user.pregnant || false}
                  onChange={(e) => setUser({ ...user, pregnant: e.target.checked })}
                />
                <label htmlFor="pregnantInput" className="form-check-label">
                  {t("profile.label_pregnant")}
                </label>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                {t("profile.btn_cancel")}
              </button>
              <button
                type="button"
                className="btn btn-success"
                onClick={() => {
                  document.activeElement.blur(); 
                  handleSave();                 
                }}
                data-bs-dismiss="modal"
              >
                {t("profile.btn_save")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfilePage;