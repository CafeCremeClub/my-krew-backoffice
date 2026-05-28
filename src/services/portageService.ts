import { Portage } from '@/types/portage/Portage';
import { CreatePortagePayload } from '@/types/portage/CreatePortagePayload';
import { UpdatePortagePayload } from '@/types/portage/UpdatePortagePayload';
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

export const updatePortage = async (
  payload: UpdatePortagePayload
): Promise<Portage> => {
  try {
    const { id, ...data } = payload;
    const response = await axiosInstance.patch<Portage>(
      `/portages/${id}`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deletePortage = async (id: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/portages/${id}`);
  } catch (error) {
    throw error;
  }
};
