import { useMutation } from '@tanstack/react-query';
import { UpdateUserDetailsPayload } from '@/types/auth/UpdateUserDetailsPayload';
import { updateUserDetails } from '@/services/authService';

const useUpdateUserDetails = () => {
  return useMutation({
    mutationKey: ['update-user-details'],
    mutationFn: async (payload: UpdateUserDetailsPayload) =>
      await updateUserDetails(payload),
    retry: 0,
  });
};

export default useUpdateUserDetails;
