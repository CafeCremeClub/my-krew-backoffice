import { GetTransactionsParams } from '@/types/transaction/GetTransactionsParams';
import { GetTransactionsResponse } from '@/types/transaction/GetTransactionsResponse';
import { CreateTransactionPayload } from '@/types/transaction/CreateTransactionPayload';
import { Transaction } from '@/types/transaction/Transaction';
import axiosInstance from '@/config/axiosInstance';
import { CreateCSVTransactionsPayload } from '@/types/transaction/CreateCSVTransactionsPayload';

export const getTransactions = async (
  params?: GetTransactionsParams
): Promise<GetTransactionsResponse> => {
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

    const url = `/transactions/admin${queryString ? `?${queryString}` : ''}`;
    const response = await axiosInstance.get<GetTransactionsResponse>(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createTransaction = async (
  payload: CreateTransactionPayload
): Promise<Transaction> => {
  try {
    const response = await axiosInstance.post<Transaction>(
      `/transactions/${payload.consultantId}`,
      {
        gross: payload.gross,
        net: payload.net,
        type: payload.type,
        status: payload.status,
        date: payload.date,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createCSVTransactions = async (
  payload: CreateCSVTransactionsPayload
): Promise<Transaction[]> => {
  try {
    const response = await axiosInstance.post<Transaction[]>(
      '/transactions/batch',
      payload
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
