import { TransactionType } from '@/types/transaction/TransactionType';
import { TransactionStatus } from '@/types/transaction/TransactionStatus';

export interface CreateTransactionPayload {
  consultantId: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  date: string;
  comment?: string;
}
