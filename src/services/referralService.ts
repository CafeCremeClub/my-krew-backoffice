import { GetReferralsResponse } from '@/types/referral/GetReferralsResponse';
import { GetReferralsParams } from '@/types/referral/GetReferralsParams';
import axiosInstance from '@/config/axiosInstance';
import { CreateReferralPayload } from '@/types/referral/CreateReferralPayload';
import { UpdateReferralPayload } from '@/types/referral/UpdateReferralPayload';
import { Referral } from '@/types/referral/Referral';

export const getReferrals = async (
  params?: GetReferralsParams
): Promise<GetReferralsResponse> => {
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

    const url = `/referrals/admin${queryString ? `?${queryString}` : ''}`;
    const response = await axiosInstance.get<GetReferralsResponse>(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createReferral = async (
  payload: CreateReferralPayload
): Promise<Referral> => {
  try {
    const response = await axiosInstance.post<Referral>('/referrals', payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateReferral = async (
  payload: UpdateReferralPayload
): Promise<Referral> => {
  try {
    const { id, ...data } = payload;
    const response = await axiosInstance.patch<Referral>(
      `/referrals/${id}`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteReferral = async (id: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/referrals/${id}`);
  } catch (error) {
    throw error;
  }
};
