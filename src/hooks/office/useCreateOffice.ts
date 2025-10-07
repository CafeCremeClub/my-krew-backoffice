import { useMutation } from '@tanstack/react-query';
import { CreateOfficePayload } from '@/types/office/CreateOfficePayload';
import { createOffice } from '@/services/officeService';

const useCreateOffice = () => {
  return useMutation({
    mutationKey: ['create-office'],
    mutationFn: async (payload: CreateOfficePayload) =>
      await createOffice(payload),
    retry: 0,
  });
};

export default useCreateOffice;
