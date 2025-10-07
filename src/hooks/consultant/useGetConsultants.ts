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
  };

  return useQuery({
    queryKey: [
      'get-consultants',
      mergedParams.page,
      mergedParams.perPage,
      mergedParams.search,
    ],
    queryFn: async () => await getConsultants(mergedParams),
    retry: 0,
    refetchOnMount: 'always',
    refetchInterval: false,
    refetchOnWindowFocus: true,
    staleTime: mergedParams.search ? 0 : 5 * 60 * 1000,
    gcTime: mergedParams.search ? 0 : 5 * 60 * 1000,
  });
};

export default useGetConsultants;
