import React, { useRef, useState, useEffect } from "react";
import axios from "axios";

export default function ProfilePhotoWithEdit({ profilePhoto, userId, onPhotoUploaded }) {
  const fileInputRef = useRef();
  const [photo, setPhoto] = useState(profilePhoto);

  // Si profilePhoto cambia desde afuera, actualizamos el estado interno
  useEffect(() => {
    setPhoto(profilePhoto);
  }, [profilePhoto]);

  const handleClickEdit = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    if (e.target.files.length === 0) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token"); // Asegúrate de tener el token guardado
      const { data } = await axios.post(
        `http://localhost:8081/api/users/${userId}/upload-photo`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // data.photoUrl viene del backend
      setPhoto(data.photoUrl);
      if (onPhotoUploaded) onPhotoUploaded(); 
    } catch (error) {
      console.error(error);
      alert("Error al subir la foto");
    }
  };

  return (
    <div style={{ position: "relative", width: "120px", margin: "0 auto 1rem auto" }}>
      {photo ? (
        <img
          src={`http://localhost:8081/uploads/${photo}`}
          alt="Foto de perfil"
          className="rounded-circle img-thumbnail"
          style={{ width: "120px", height: "120px", objectFit: "cover" }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://via.placeholder.com/120?text=Sin+Foto";
          }}
        />
      ) : (
        <div
          className="bg-secondary rounded-circle d-flex justify-content-center align-items-center text-white"
          style={{ width: "120px", height: "120px", fontSize: "2rem" }}
        >
          ?
        </div>
      )}

      <button
        type="button"
        onClick={handleClickEdit}
        style={{
          position: "absolute",
          bottom: "5px",
          right: "5px",
          backgroundColor: "#0d6efd",
          border: "none",
          borderRadius: "50%",
          padding: "6px",
          cursor: "pointer",
          color: "white",
          boxShadow: "0 0 5px rgba(0,0,0,0.3)",
        }}
        title="Cambiar foto"
      >
        <i className="bi bi-pencil-fill" style={{ fontSize: "1rem" }}></i>
      </button>

      <input
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        ref={fileInputRef}
        onChange={handleFileChange}
      />
    </div>
  );
}

