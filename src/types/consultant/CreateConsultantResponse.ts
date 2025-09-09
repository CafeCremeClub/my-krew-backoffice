import {UserAuthRole} from "@/types/UserAuthRole";


export interface CreateConsultantResponse {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    role: UserAuthRole;
    authMode: string;
    signInAt: string;
}