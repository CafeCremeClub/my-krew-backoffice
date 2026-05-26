import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUserIdentity } from '@/services/consultantsService';
import { UpdateUserIdentityPayload } from '@/types/consultant/UpdateUserIdentityPayload';
import { toast } from 'sonner';

const useUpdateUserIdentity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateUserIdentityPayload) =>
      updateUserIdentity(payload),
    onError: (error: unknown) => {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ||
        "Une erreur est survenue lors de la mise à jour de l'identité du consultant";
      toast.error(errorMessage);
    },
    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({ queryKey: ['consultant', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['get-consultants'] });
    },
  });
};

export default useUpdateUserIdentity;
