import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deletePortage } from '@/services/portageService';

const useDeletePortage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['delete-portage'],
    mutationFn: async (id: string) => await deletePortage(id),
    retry: 0,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['get-portages'] });
    },
  });
};

export default useDeletePortage;
