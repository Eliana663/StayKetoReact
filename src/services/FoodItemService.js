import { api } from "../api";

export const findAll = async () => { 
  try {
    const response = await api.get("/listar"); // ya apunta a baseURL
    return response.data;
  } catch (error) {
    console.error("Error fetching food items:", error);
    return [];
  }
};
