import { useQuery } from '@tanstack/react-query';
import { getOffices } from '@/services/officeService';

const useGetOffices = () => {
  return useQuery({
    queryKey: ['get-offices'],
    queryFn: getOffices,
    retry: 0,
    refetchOnMount: false,
    refetchInterval: false,
  });
};

export default useGetOffices;
