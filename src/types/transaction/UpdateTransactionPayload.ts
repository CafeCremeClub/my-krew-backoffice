import { TransactionStatus } from './TransactionStatus';
import { TransactionType } from './TransactionType';

export interface UpdateTransactionPayload {
  id: string;
  status?: TransactionStatus;
  comment?: string;
  type?: TransactionType | string;
  amount?: number;
  date?: string;
}
