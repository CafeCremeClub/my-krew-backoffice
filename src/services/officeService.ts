import {Office} from "@/types/office/Office";
import {CreateOfficePayload} from "@/types/office/CreateOfficePayload";
import axiosInstance from "@/config/axiosInstance";

export const getOffices = async (): Promise<Office[]> => {
    try {
        const response = await axiosInstance.get<Office[]>("/offices/all");
        return response.data
    } catch (error) {
        throw error;
    }
}

export const createOffice = async (payload: CreateOfficePayload): Promise<Office> => {
    try {
        const response = await axiosInstance.post<Office>('/offices', payload);
        return response.data;
    } catch (error) {
        throw error;
    }
}
