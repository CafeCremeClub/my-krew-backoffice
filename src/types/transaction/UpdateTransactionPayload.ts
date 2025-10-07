import { TransactionStatus } from './TransactionStatus';

export interface UpdateTransactionPayload {
  id: string;
  status?: TransactionStatus;
  comment?: string;
}
