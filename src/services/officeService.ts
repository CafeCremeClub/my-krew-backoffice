import {Office} from "@/types/office/Office";
import axiosInstance from "@/config/axiosInstance";

export const getOffices = async (): Promise<Office[]> => {
    try {
        const response = await axiosInstance.get<Office[]>("/offices/all");
        return response.data
    } catch (error) {
        throw error;
    }
}