import {useQuery} from "@tanstack/react-query";
import {GetReferralsParams} from "@/types/referral/GetReferralsParams";
import {getReferrals} from "@/services/referralService";

const DEFAULT_PAGE: number = 1;
export const GET_REFERRALS_DEFAULT_PER_PAGE: number = 10;

const useGetReferrals = (params?: GetReferralsParams) => {

    const mergedParams: GetReferralsParams = {
        page: params?.page ?? DEFAULT_PAGE,
        perPage: params?.perPage ?? GET_REFERRALS_DEFAULT_PER_PAGE,
    }

    return useQuery({
        queryKey: ["get-referrals", mergedParams.page, mergedParams.perPage],
        queryFn: async () => await getReferrals(mergedParams),
        retry: 0,
        refetchOnMount: false,
        refetchInterval: false
    })

}

export default useGetReferrals;