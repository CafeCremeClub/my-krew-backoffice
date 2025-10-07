import { useMutation } from '@tanstack/react-query';
import { CreateReferralPayload } from '@/types/referral/CreateReferralPayload';
import { createReferral } from '@/services/referralService';

const useCreateReferral = () => {
  return useMutation({
    mutationKey: ['create-referral'],
    mutationFn: async (payload: CreateReferralPayload) =>
      await createReferral(payload),
    retry: 0,
  });
};

export default useCreateReferral;
