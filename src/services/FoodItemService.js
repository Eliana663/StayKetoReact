import axios from "axios";

const baseUrl = 'http://localhost:8081/listar';

export const findAll = async () => { 
    try {
        const response = await axios.get(baseUrl);
        return response.data;
    } catch (error) {
        console.error("Error fetching food items:", error);
        return [];
    }
}