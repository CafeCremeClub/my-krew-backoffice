import { useQuery } from '@tanstack/react-query';
import { getPortages } from '@/services/portageService';

const useGetPortages = () => {
  return useQuery({
    queryKey: ['get-portages'],
    queryFn: getPortages,
    retry: 0,
    refetchOnMount: false,
    refetchInterval: false,
  });
};

export default useGetPortages;
