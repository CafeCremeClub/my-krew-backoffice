import { useMutation } from '@tanstack/react-query';
import { CreatePortagePayload } from '@/types/portage/CreatePortagePayload';
import { createPortage } from '@/services/portageService';

const useCreatePortage = () => {
  return useMutation({
    mutationKey: ['create-portage'],
    mutationFn: async (payload: CreatePortagePayload) =>
      await createPortage(payload),
    retry: 0,
  });
};

export default useCreatePortage;
