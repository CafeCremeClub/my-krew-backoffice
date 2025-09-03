import {ReferralUser} from "@/types/referral/ReferralUser";


export interface Referral {
    id: string;
    referrer: ReferralUser;
    referee: ReferralUser;
    startDate: string;
    endDate: string;
    status: string;
    amount: string;
    creationDate: string;
}