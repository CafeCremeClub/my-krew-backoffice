import axiosInstance from '@/config/axiosInstance';
import { SigninPayload } from '@/types/auth/SigninPayload';
import { SigninResponse } from '@/types/auth/SigninResponse';
import { UpdateUserDetailsPayload } from '@/types/auth/UpdateUserDetailsPayload';
import { User } from '@/types/User';

export const getMe = async (): Promise<User> => {
  try {
    const response = await axiosInstance.get<User>('/users/me');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const sendOtp = async (email: string): Promise<void> => {
  try {
    await axiosInstance.post('/users/otp', {
      email: email,
    });
  } catch (error) {
    throw error;
  }
};

export const signup = async (
  payload: SigninPayload
): Promise<SigninResponse> => {
  try {
    const response = await axiosInstance.post('/users', payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUserDetails = async (
  payload: UpdateUserDetailsPayload
): Promise<void> => {
  try {
    await axiosInstance.patch('/users/update', payload);
  } catch (error) {
    throw error;
  }
};
