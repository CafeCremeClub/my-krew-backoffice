import { GetConsultantsResponse } from '@/types/consultant/GetConsultantsResponse';
import { GetConsultantsParams } from '@/types/consultant/GetConsultantsParams';
import axiosInstance from '@/config/axiosInstance';
import { CreateConsultantPayload } from '@/types/consultant/CreateConsultantPayload';
import { UpdateConsultantRolePayload } from '@/types/consultant/UpdateConsultantRolePayload';
import { CreateConsultantResponse } from '@/types/consultant/CreateConsultantResponse';
import { CreateCSVConsultantsPayload } from '@/types/consultant/CreateCSVConsultantsPayload';

export const getConsultants = async (
  params?: GetConsultantsParams
): Promise<GetConsultantsResponse> => {
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

    const url = `/consultants/admin${queryString ? `?${queryString}` : ''}`;
    const response = await axiosInstance.get<GetConsultantsResponse>(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createConsultant = async (
  payload: CreateConsultantPayload
): Promise<CreateConsultantResponse> => {
  try {
    const response = await axiosInstance.post<CreateConsultantResponse>(
      '/users/register',
      payload
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createCSVConsultants = async (
  payload: CreateCSVConsultantsPayload
): Promise<CreateConsultantResponse[]> => {
  try {
    const response = await axiosInstance.post<CreateConsultantResponse[]>(
      '/users/register/batch',
      payload
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateConsultantRole = async (
  payload: UpdateConsultantRolePayload
): Promise<void> => {
  try {
    await axiosInstance.patch(`/consultants/role/${payload.id}`, {
      role: payload.role,
    });
  } catch (error) {
    throw error;
  }
};

export const deleteConsultant = async (id: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/users/${id}`);
  } catch (error) {
    throw error;
  }
};
