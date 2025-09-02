import {AuthResponseUser} from "@/types/auth/AuthResponseUser";

export interface SigninResponse {
    user: AuthResponseUser;
    accessToken: string;
}