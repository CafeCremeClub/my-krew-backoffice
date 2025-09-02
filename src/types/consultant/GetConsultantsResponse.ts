import {Consultant} from "@/types/consultant/Consultant";


export interface GetConsultantsResponse {
    page: number;
    perPage: number;
    total: number;
    data: Consultant[];
}