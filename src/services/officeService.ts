import { Office } from '@/types/office/Office';
import { CreateOfficePayload } from '@/types/office/CreateOfficePayload';
import { UpdateOfficePayload } from '@/types/office/UpdateOfficePayload';
import axiosInstance from '@/config/axiosInstance';

export const getOffices = async (): Promise<Office[]> => {
  try {
    const response = await axiosInstance.get<Office[]>('/offices/all');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createOffice = async (
  payload: CreateOfficePayload
): Promise<Office> => {
  try {
    const response = await axiosInstance.post<Office>('/offices', payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateOffice = async (
  payload: UpdateOfficePayload
): Promise<Office> => {
  try {
    const { id, ...data } = payload;
    const response = await axiosInstance.patch<Office>(`/offices/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteOffice = async (id: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/offices/${id}`);
  } catch (error) {
    throw error;
  }
};
