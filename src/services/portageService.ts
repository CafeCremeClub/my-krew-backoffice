import { Portage } from '@/types/portage/Portage';
import { CreatePortagePayload } from '@/types/portage/CreatePortagePayload';
import axiosInstance from '@/config/axiosInstance';

export const getPortages = async (): Promise<Portage[]> => {
  try {
    const response = await axiosInstance.get<Portage[]>('/portages/all');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createPortage = async (
  payload: CreatePortagePayload
): Promise<Portage> => {
  try {
    const response = await axiosInstance.post<Portage>('/portages', payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};
