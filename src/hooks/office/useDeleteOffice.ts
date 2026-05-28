import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteOffice } from '@/services/officeService';

const useDeleteOffice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['delete-office'],
    mutationFn: async (id: string) => await deleteOffice(id),
    retry: 0,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['get-offices'] });
    },
  });
};

export default useDeleteOffice;
