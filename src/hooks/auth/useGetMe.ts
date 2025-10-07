import { useQuery } from '@tanstack/react-query';
import { getMe } from '@/services/authService';

const useGetMe = () => {
  return useQuery({
    queryKey: ['get-me'],
    queryFn: getMe,
    retry: 0,
    refetchOnMount: false,
    refetchInterval: false,
  });
};

export default useGetMe;
