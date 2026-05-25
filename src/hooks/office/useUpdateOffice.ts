import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UpdateOfficePayload } from '@/types/office/UpdateOfficePayload';
import { updateOffice } from '@/services/officeService';

const useUpdateOffice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['update-office'],
    mutationFn: async (payload: UpdateOfficePayload) =>
      await updateOffice(payload),
    retry: 0,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['get-offices'] });
    },
  });
};

export default useUpdateOffice;
