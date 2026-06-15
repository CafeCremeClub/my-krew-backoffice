import { Transaction } from '@/types/transaction/Transaction';

export type SkippedTransactionReason = 'USER_NOT_FOUND' | 'DUPLICATE';

export interface SkippedTransaction {
  email: string;
  reason: SkippedTransactionReason;
}

/**
 * Réponse de `POST /transactions/batch` depuis l'introduction de la garde
 * d'idempotence côté API : les lignes réellement créées sont dans `created`,
 * et les lignes ignorées (consultant introuvable ou doublon) sont remontées
 * dans `skipped` avec leur motif.
 */
export interface CreateCSVTransactionsResponse {
  created: Transaction[];
  createdCount: number;
  skipped: SkippedTransaction[];
  skippedCount: number;
}
