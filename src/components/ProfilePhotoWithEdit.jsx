import React, { useRef } from "react";
import axios from "axios";

export default function ProfilePhotoWithEdit({ profilePhoto, userId, onPhotoUploaded }) {
  const fileInputRef = useRef();

  const handleClickEdit = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    if (e.target.files.length === 0) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(`http://localhost:8081/api/users/${userId}/upload-photo`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Foto subida con éxito");
      onPhotoUploaded();
    } catch (error) {
      alert("Error al subir la foto");
      console.error(error);
    }
  };

  return (
    <div style={{ position: "relative", width: "120px", margin: "0 auto 1rem auto" }}>
      {profilePhoto ? (
        <img
          src={`http://localhost:8081/uploads/${profilePhoto}`}
          alt="Foto de perfil"
          className="rounded-circle img-thumbnail"
          style={{ width: "120px", height: "120px", objectFit: "cover" }}
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