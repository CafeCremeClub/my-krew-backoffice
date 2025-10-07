import { useMutation } from '@tanstack/react-query';
import { CreateConsultantPayload } from '@/types/consultant/CreateConsultantPayload';
import { createConsultant } from '@/services/consultantsService';

const useCreateConsultant = () => {
  return useMutation({
    mutationKey: ['create-consultant'],
    mutationFn: async (payload: CreateConsultantPayload) =>
      await createConsultant(payload),
    retry: 0,
  });
};

export default useCreateConsultant;
