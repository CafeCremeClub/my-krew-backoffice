import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateReferral } from '@/services/referralService';
import { UpdateReferralPayload } from '@/types/referral/UpdateReferralPayload';

const useUpdateReferral = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['update-referral'],
    mutationFn: async (payload: UpdateReferralPayload) =>
      await updateReferral(payload),
    retry: 0,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['get-referrals'] });
    },
  });
};

export default useUpdateReferral;
