import { TransactionType } from '@/types/transaction/TransactionType';
import { TransactionStatus } from '@/types/transaction/TransactionStatus';

export interface CreateCSVTransactionsPayload {
  transactions: {
    email: string;
    amount: number;
    type: TransactionType;
    status: TransactionStatus;
    date: string; //format 2025-09-02
    comment?: string;
  }[];
}
