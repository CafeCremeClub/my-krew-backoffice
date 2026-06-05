import { useMutation } from '@tanstack/react-query';
import { getAllTransactions } from '@/services/transactionService';
import { Transaction } from '@/types/transaction/Transaction';
import { downloadCSV } from '@/utils/helpers/downloadCSV';

interface ExportArgs {
  /** Si fourni et non vide, exporte uniquement ces transactions. */
  selected?: Transaction[];
  /** Recherche active, utilisée pour l'export global et le nom de fichier. */
  search?: string;
}

/**
 * Mappe une transaction vers une ligne CSV. Les colonnes (email, amount, type,
 * status, date, comment) sont alignées sur le format attendu par l'import CSV,
 * afin qu'un fichier exporté puisse être ré-importé tel quel.
 */
const toCSVRow = (transaction: Transaction) => ({
  firstname: transaction.firstname,
  lastname: transaction.lastname,
  email: transaction.email,
  phone: transaction.phone,
  amount: transaction.amount,
  type: transaction.type,
  status: transaction.status,
  date: transaction.date,
  comment: transaction.comment ?? '',
});

const buildFilename = (search?: string, isSelection?: boolean): string => {
  if (isSelection) return 'transactions-selection.csv';
  const suffix = search ? `-${search.trim().replace(/\s+/g, '-')}` : '';
  return `transactions${suffix}.csv`;
};

const useExportTransactionsCSV = () => {
  return useMutation({
    mutationFn: async ({ selected, search }: ExportArgs) => {
      const isSelection = Boolean(selected && selected.length > 0);
      const transactions = isSelection
        ? selected!
        : await getAllTransactions(search);
      return { transactions, search, isSelection };
    },
    onSuccess: ({ transactions, search, isSelection }) => {
      const rows = transactions.map(toCSVRow);
      downloadCSV(rows, buildFilename(search, isSelection));
    },
  });
};

export default useExportTransactionsCSV;
