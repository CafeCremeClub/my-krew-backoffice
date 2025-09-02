import {UserAuthRole} from "@/types/UserAuthRole";

export interface User {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    phone: string | null;
    role: UserAuthRole;
    authMode: string;
    signInAt: string;
    deletedAt: string | null;
}