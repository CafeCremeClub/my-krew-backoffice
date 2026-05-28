import { useQuery } from '@tanstack/react-query';
import { GetTransactionsParams } from '@/types/transaction/GetTransactionsParams';
import { getTransactions } from '@/services/transactionService';

const DEFAULT_PAGE: number = 1;
export const GET_TRANSACTIONS_DEFAULT_PER_PAGE: number = 10;

const useGetTransactions = (params?: GetTransactionsParams) => {
  const mergeParams: GetTransactionsParams = {
    page: params?.page ?? DEFAULT_PAGE,
    perPage: params?.perPage ?? GET_TRANSACTIONS_DEFAULT_PER_PAGE,
    search: params?.search || undefined,
  };

  return useQuery({
    queryKey: [
      'get-transactions',
      mergeParams.page,
      mergeParams.perPage,
      mergeParams.search,
    ],
    queryFn: async () => await getTransactions(mergeParams),
    retry: 0,
    refetchOnMount: 'always',
    refetchInterval: false,
    staleTime: mergeParams.search ? 0 : 5 * 60 * 1000,
    gcTime: mergeParams.search ? 0 : 5 * 60 * 1000,
  });
};

export default useGetTransactions;
