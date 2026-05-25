import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UpdatePortagePayload } from '@/types/portage/UpdatePortagePayload';
import { updatePortage } from '@/services/portageService';

const useUpdatePortage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['update-portage'],
    mutationFn: async (payload: UpdatePortagePayload) =>
      await updatePortage(payload),
    retry: 0,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['get-portages'] });
    },
  });
};

export default useUpdatePortage;
