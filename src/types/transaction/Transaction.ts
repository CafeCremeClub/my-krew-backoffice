import {ConsultantStatus} from "@/types/consultant/ConsultantStatus";
import {ConsultantType} from "@/types/consultant/ConsultantType";
import {TransactionType} from "@/types/transaction/TransactionType";
import {TransactionStatus} from "@/types/transaction/TransactionStatus";


export interface Transaction {
    id: string;
    email: string;
    firstname: string;
    lastname: string;
    phone: string;
    consultantStatus: ConsultantStatus;
    consultantType: ConsultantType;
    gross: string;
    net: string;
    type: TransactionType;
    status: TransactionStatus;
    date: string;
}