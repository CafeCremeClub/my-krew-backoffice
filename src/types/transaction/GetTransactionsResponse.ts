import { Transaction } from '@/types/transaction/Transaction';

export interface GetTransactionsResponse {
  page: number;
  perPage: number;
  count: number;
  data: Transaction[];
}
