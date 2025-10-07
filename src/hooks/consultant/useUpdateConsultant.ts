import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateConsultant } from '@/services/consultantsService';
import { UpdateConsultantPayload } from '@/types/consultant/UpdateConsultantPayload';
import { toast } from 'sonner';
import { Consultant } from '@/types/consultant/Consultant';
import { GetConsultantsResponse } from '@/types/consultant/GetConsultantsResponse';

const useUpdateConsultant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateConsultantPayload) => updateConsultant(payload),
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
            monthlyEstimation:
              variables.monthlyEstimation ?? old.monthlyEstimation,
            performance: variables.performance ?? old.performance,
            status: variables.status ?? old.status,
            type: variables.type ?? old.type,
            startDate: variables.startDate?.toISOString() ?? old.startDate,
            endDate: variables.endDate?.toISOString() ?? old.endDate,
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
                ? {
                    ...consultant,
                    monthlyEstimation:
                      variables.monthlyEstimation ??
                      consultant.monthlyEstimation,
                    performance:
                      variables.performance ?? consultant.performance,
                    status: variables.status ?? consultant.status,
                    type: variables.type ?? consultant.type,
                    startDate:
                      variables.startDate?.toISOString() ??
                      consultant.startDate,
                    endDate:
                      variables.endDate?.toISOString() ?? consultant.endDate,
                  }
                : consultant
            ),
          };
        }
      );

      return { previousConsultant, previousConsultantsList };
    },
    onError: (error: unknown, variables, context) => {
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

      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ||
        'Une erreur est survenue lors de la mise à jour du consultant';
      toast.error(errorMessage);
    },
    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({ queryKey: ['consultant', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['get-consultants'] });
    },
  });
};

export default useUpdateConsultant;
