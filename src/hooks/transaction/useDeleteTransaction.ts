import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteTransaction } from '@/services/transactionService';

const useDeleteTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['delete-transaction'],
    mutationFn: async (id: string) => await deleteTransaction(id),
    retry: 0,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['get-transactions'] });
    },
  });
};

export default useDeleteTransaction;
