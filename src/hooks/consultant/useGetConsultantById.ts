import { useQuery } from '@tanstack/react-query';
import { getConsultantById } from '@/services/consultantsService';

const useGetConsultantById = (id: string) => {
  return useQuery({
    queryKey: ['consultant', id],
    queryFn: () => getConsultantById(id),
    enabled: !!id,
  });
};

export default useGetConsultantById;
