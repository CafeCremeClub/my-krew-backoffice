import {Referral} from "@/types/referral/Referral";


export interface GetReferralsResponse {
    page: number;
    perPage: number;
    count: number;
    data: Referral[]
}