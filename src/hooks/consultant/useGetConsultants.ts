import { useQuery } from '@tanstack/react-query';
import { GetConsultantsParams } from '@/types/consultant/GetConsultantsParams';
import { getConsultants } from '@/services/consultantsService';

const DEFAULT_PAGE: number = 1;
export const GET_CONSULTANTS_DEFAULT_PER_PAGE: number = 10;

const useGetConsultants = (params?: GetConsultantsParams) => {
  const mergedParams: GetConsultantsParams = {
    page: params?.page ?? DEFAULT_PAGE,
    perPage: params?.perPage ?? GET_CONSULTANTS_DEFAULT_PER_PAGE,
    search: params?.search ?? undefined,
    status: params?.status ?? undefined,
    portageId: params?.portageId ?? undefined,
    officeId: params?.officeId ?? undefined,
    sortBy: params?.sortBy ?? undefined,
    sortOrder: params?.sortOrder ?? undefined,
  };

  const hasActiveQuery = Boolean(
    mergedParams.search ||
      mergedParams.status ||
      mergedParams.portageId ||
      mergedParams.officeId ||
      mergedParams.sortBy
  );

  return useQuery({
    queryKey: [
      'get-consultants',
      mergedParams.page,
      mergedParams.perPage,
      mergedParams.search,
      mergedParams.status,
      mergedParams.portageId,
      mergedParams.officeId,
      mergedParams.sortBy,
      mergedParams.sortOrder,
    ],
    queryFn: async () => await getConsultants(mergedParams),
    retry: 0,
    refetchOnMount: 'always',
    refetchInterval: false,
    refetchOnWindowFocus: true,
    staleTime: hasActiveQuery ? 0 : 5 * 60 * 1000,
    gcTime: hasActiveQuery ? 0 : 5 * 60 * 1000,
  });
};

export default useGetConsultants;
