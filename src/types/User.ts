import {UserRole} from "@/types/UserRole";

export interface User {
    id: string;
    firstname: string | null;
    lastname: string | null;
    email: string;
    phone: string;
    status: string;
    type: "entrepreneur" | "admin";
    startDate: string;
    endDate: string;
    officeId: string;
    portageId: string;
    role: UserRole;
    referrals: number;
    monthlyEstimation: number | null,
    performance: number | null
    createdAt: string;
    updatedAt: string;
}