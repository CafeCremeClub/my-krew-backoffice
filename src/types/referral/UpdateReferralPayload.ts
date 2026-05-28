import { ReferralStatus } from '@/types/referral/ReferralStatus';

export interface UpdateReferralPayload {
  id: string;
  status?: ReferralStatus | string;
  amount?: number;
  startDate?: string;
  endDate?: string;
}
