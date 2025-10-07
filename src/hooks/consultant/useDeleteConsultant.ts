import { useMutation } from '@tanstack/react-query';
import { deleteConsultant } from '@/services/consultantsService';

const useDeleteConsultant = () => {
  return useMutation({
    mutationKey: ['delete-consultant'],
    mutationFn: async (id: string) => await deleteConsultant(id),
    retry: 0,
  });
};

export default useDeleteConsultant;
