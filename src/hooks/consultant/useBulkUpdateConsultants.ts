import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bulkUpdateConsultants } from '@/services/consultantsService';
import { BulkUpdateConsultantsPayload } from '@/types/consultant/BulkUpdateConsultantsPayload';

const useBulkUpdateConsultants = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: BulkUpdateConsultantsPayload) =>
      bulkUpdateConsultants(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-consultants'] });
    },
  });
};

export default useBulkUpdateConsultants;
