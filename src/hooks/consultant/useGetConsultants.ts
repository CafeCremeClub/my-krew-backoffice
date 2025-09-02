import {useQuery} from "@tanstack/react-query";
import {GetConsultantsParams} from "@/types/consultant/GetConsultantsParams";
import {getConsultants} from "@/services/consultantsService";

const DEFAULT_PAGE: number = 1;
export const GET_CONSULTANTS_DEFAULT_PER_PAGE: number = 10;

const useGetConsultants = (params?: GetConsultantsParams) => {

    const mergedParams: GetConsultantsParams = {
        page: params?.page ?? DEFAULT_PAGE,
        perPage: params?.perPage ?? GET_CONSULTANTS_DEFAULT_PER_PAGE,
    }

    return useQuery({
        queryKey: ["get-consultants", mergedParams.page, mergedParams.perPage],
        queryFn: async () => await getConsultants(mergedParams),
        retry: 0,
        refetchOnMount: false,
        refetchInterval: false
    })

}

export default useGetConsultants;