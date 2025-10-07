import { ConsultantStatus } from './ConsultantStatus';
import { ConsultantType } from './ConsultantType';

export interface UpdateConsultantPayload {
  id: string;
  monthlyEstimation?: number;
  performance?: number;
  status?: ConsultantStatus;
  type?: ConsultantType;
  startDate?: Date;
  endDate?: Date;
}
