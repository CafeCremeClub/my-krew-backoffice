import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteReferral } from '@/services/referralService';

const useDeleteReferral = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['delete-referral'],
    mutationFn: async (id: string) => await deleteReferral(id),
    retry: 0,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['get-referrals'] });
    },
  });
};

export default useDeleteReferral;
