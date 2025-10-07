import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UpdateConsultantRolePayload } from '@/types/consultant/UpdateConsultantRolePayload';
import { updateConsultantRole } from '@/services/consultantsService';
import { Consultant } from '@/types/consultant/Consultant';
import { GetConsultantsResponse } from '@/types/consultant/GetConsultantsResponse';

const useUpdateConsultantRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['update-consultant-role'],
    mutationFn: async (payload: UpdateConsultantRolePayload) =>
      await updateConsultantRole(payload),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: ['consultant', variables.id],
      });
      await queryClient.cancelQueries({ queryKey: ['get-consultants'] });

      const previousConsultant = queryClient.getQueryData<Consultant>([
        'consultant',
        variables.id,
      ]);
      const previousConsultantsList =
        queryClient.getQueriesData<GetConsultantsResponse>({
          queryKey: ['get-consultants'],
        });

      queryClient.setQueryData<Consultant>(
        ['consultant', variables.id],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            role: variables.role,
          };
        }
      );

      queryClient.setQueriesData<GetConsultantsResponse>(
        { queryKey: ['get-consultants'] },
        (old) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: old.data.map((consultant) =>
              consultant.id === variables.id
                ? { ...consultant, role: variables.role }
                : consultant
            ),
          };
        }
      );

      return { previousConsultant, previousConsultantsList };
    },
    onError: (_error, variables, context) => {
      if (context?.previousConsultant) {
        queryClient.setQueryData(
          ['consultant', variables.id],
          context.previousConsultant
        );
      }
      if (context?.previousConsultantsList) {
        context.previousConsultantsList.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({ queryKey: ['consultant', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['get-consultants'] });
    },
    retry: 0,
  });
};

export default useUpdateConsultantRole;
