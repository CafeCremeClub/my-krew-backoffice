import {ConsultantRole} from "@/types/consultant/ConsultantRole";


export interface UpdateConsultantRolePayload {
    id: string;
    role: ConsultantRole;
}