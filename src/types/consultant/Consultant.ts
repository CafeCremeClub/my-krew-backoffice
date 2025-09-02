import {ConsultantRole} from "@/types/consultant/ConsultantRole";
import {ConsultantStatus} from "@/types/consultant/ConsultantStatus";

export interface Consultant {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    phone: string | null;
    status: ConsultantStatus;
    type: string;
    startDate: string;
    endDate: string;
    office: string;
    portage: string;
    role: ConsultantRole;
    referrals: number;
    monthlyEstimation: number;
    performance: number | null;
}