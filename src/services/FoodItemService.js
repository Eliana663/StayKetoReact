import axios from "axios";
import { API_BASE_URL } from '../constants'; // O '@/constants' si usas el alias

const baseUrl = `${API_BASE_URL}/listar`;

export const findAll = async () => { 
    try {
        const response = await axios.get(baseUrl);
        return response.data;
    } catch (error) {
        console.error("Error fetching food items:", error);
        return [];
    }
}