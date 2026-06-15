import { GetTransactionsParams } from '@/types/transaction/GetTransactionsParams';
import { GetTransactionsResponse } from '@/types/transaction/GetTransactionsResponse';
import { CreateTransactionPayload } from '@/types/transaction/CreateTransactionPayload';
import { Transaction } from '@/types/transaction/Transaction';
import axiosInstance from '@/config/axiosInstance';
import { CreateCSVTransactionsPayload } from '@/types/transaction/CreateCSVTransactionsPayload';
import { CreateCSVTransactionsResponse } from '@/types/transaction/CreateCSVTransactionsResponse';
import { UpdateTransactionPayload } from '@/types/transaction/UpdateTransactionPayload';

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

const EXPORT_PER_PAGE: number = 100;

/**
 * Récupère l'intégralité des transactions (toutes les pages) en suivant la
 * pagination de l'API. Respecte la recherche active si `search` est fourni.
 * Utilisé par l'export CSV pour couvrir tout le jeu de données, pas seulement
 * la page courante.
 */
export const getAllTransactions = async (
  search?: string
): Promise<Transaction[]> => {
  try {
    const all: Transaction[] = [];
    let page = 1;

    while (true) {
      const response = await getTransactions({
        page,
        perPage: EXPORT_PER_PAGE,
        search,
      });

      all.push(...response.data);

      const totalPages = Math.ceil(response.count / response.perPage);
      if (page >= totalPages || response.data.length === 0) break;
      page += 1;
    }

    return all;
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
        amount: payload.amount,
        type: payload.type,
        status: payload.status,
        date: payload.date,
        comment: payload.comment,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createCSVTransactions = async (
  payload: CreateCSVTransactionsPayload
): Promise<CreateCSVTransactionsResponse> => {
  try {
    const response = await axiosInstance.post<CreateCSVTransactionsResponse>(
      '/transactions/batch',
      payload
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateTransaction = async (
  payload: UpdateTransactionPayload
): Promise<Transaction> => {
  try {
    const { id, ...data } = payload;
    const response = await axiosInstance.patch<Transaction>(
      `/transactions/${id}`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteTransaction = async (id: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/transactions/${id}`);
  } catch (error) {
    throw error;
  }
};
