import { useMutation } from '@tanstack/react-query';
import { CreateCSVConsultantsPayload } from '@/types/consultant/CreateCSVConsultantsPayload';
import { createCSVConsultants } from '@/services/consultantsService';

const useCreateCsvConsultants = () => {
  return useMutation({
    mutationKey: ['create-csv-consultants'],
    mutationFn: async (payload: CreateCSVConsultantsPayload) =>
      await createCSVConsultants(payload),
    retry: 0,
  });
};

export default useCreateCsvConsultants;
