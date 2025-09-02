import {Portage} from "@/types/portage/Portage";
import axiosInstance from "@/config/axiosInstance";


export const getPortages = async (): Promise<Portage[]> => {
    try {
        const response = await axiosInstance.get<Portage[]>('/portages/all');
        return response.data;
    } catch (error) {
        throw error;
    }
}