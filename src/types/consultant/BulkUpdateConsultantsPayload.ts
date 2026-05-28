import { ConsultantRole } from '@/types/consultant/ConsultantRole';
import { ConsultantStatus } from '@/types/consultant/ConsultantStatus';
import { ConsultantType } from '@/types/consultant/ConsultantType';

export interface BulkUpdateConsultantsPayload {
  ids: string[];
  officeId?: string;
  portageId?: string;
  status?: ConsultantStatus | string;
  type?: ConsultantType | string;
  role?: ConsultantRole | string;
}

export interface BulkUpdateConsultantsResult {
  requested: number;
  updated: number;
  failed: number;
  failedIds: string[];
}
