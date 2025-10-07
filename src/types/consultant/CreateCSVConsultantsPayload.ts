import { ConsultantType } from '@/types/consultant/ConsultantType';

export interface CreateCSVConsultantsPayload {
  users: {
    email: string;
    firstname: string;
    lastname: string;
    phone: string;
    status: string;
    type: ConsultantType;
    startDate: string;
    endDate: string;
    portageId: string;
    officeId: string;
  }[];
}
