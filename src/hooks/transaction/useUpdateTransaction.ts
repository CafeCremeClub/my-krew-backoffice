import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTransaction } from '@/services/transactionService';
import { UpdateTransactionPayload } from '@/types/transaction/UpdateTransactionPayload';

const useUpdateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateTransactionPayload) =>
      updateTransaction(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-transactions'] });
    },
  });
};

export default useUpdateTransaction;
