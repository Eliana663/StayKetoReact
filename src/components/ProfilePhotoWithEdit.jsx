import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from '../constants';

import defaultPhoto from "../assets/default-user.jpg"; 

export default function ProfilePhotoWithEdit({ profilePhoto, userId, onPhotoUploaded }) {
  const fileInputRef = useRef();
  const [photo, setPhoto] = useState(profilePhoto);

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
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        `${API_BASE_URL}/api/users/${userId}/upload-photo`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

   
      setPhoto(data.photoUrl);
      if (onPhotoUploaded) onPhotoUploaded(); 
      alert("Foto actualizada correctamente en el servidor");
    } catch (error) {
      console.error("Error al subir:", error);
      alert("Error al subir la foto al backend");
    }
  };


  return (
    <div style={{ position: "relative", width: "120px", margin: "0 auto 1rem auto" }}>
      
      <img
        
        src={photo ? `${API_BASE_URL}/uploads/${photo}` : defaultPhoto} 
        alt="Foto de perfil"
        className="rounded-circle img-thumbnail"
        style={{ width: "120px", height: "120px", objectFit: "cover", border: "3px solid #28a745" }}
        onError={(e) => {
          
          e.target.onerror = null; 
          e.target.src = defaultPhoto; 
        }}
      />

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