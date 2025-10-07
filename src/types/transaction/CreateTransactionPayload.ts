import { TransactionType } from '@/types/transaction/TransactionType';
import { TransactionStatus } from '@/types/transaction/TransactionStatus';

export interface CreateTransactionPayload {
  consultantId: string;
  gross: number;
  net: number;
  type: TransactionType;
  status: TransactionStatus;
  date: string; //format 2025-09-02
}
