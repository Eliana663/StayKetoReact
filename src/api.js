import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL: "https://stayketo.onrender.com", // <- comillas necesarias
});

export const IMAGES_URL = `${api.defaults.baseURL}/images`;
export const UPLOADS_URL = `${api.defaults.baseURL}/uploads`;
