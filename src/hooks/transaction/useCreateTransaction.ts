import { useMutation } from '@tanstack/react-query';
import { CreateTransactionPayload } from '@/types/transaction/CreateTransactionPayload';
import { createTransaction } from '@/services/transactionService';

const useCreateTransaction = () => {
  return useMutation({
    mutationKey: ['create-transaction'],
    mutationFn: async (payload: CreateTransactionPayload) =>
      await createTransaction(payload),
    retry: 0,
  });
};

export default useCreateTransaction;
