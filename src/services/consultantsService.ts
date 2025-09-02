import {GetConsultantsResponse} from "@/types/consultant/GetConsultantsResponse";
import {GetConsultantsParams} from "@/types/consultant/GetConsultantsParams";
import axiosInstance from "@/config/axiosInstance";

export const getConsultants = async (params?: GetConsultantsParams): Promise<GetConsultantsResponse> => {
    try {
        const urlParams = new URLSearchParams();
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (Array.isArray(value)) {
                    value.forEach((item) => {
                        if (item) urlParams.append(key, item);
                    });
                } else if (value) {
                    urlParams.append(key, value);
                }
            });
        }
        const queryString = urlParams.toString();

        const url = `/consultants/admin${queryString ? `?${queryString}` : ''}`
        const response = await axiosInstance.get<GetConsultantsResponse>(url);
        return response.data;
    } catch (error) {
        throw error;
    }
}
