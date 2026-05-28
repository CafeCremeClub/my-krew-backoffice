import { ReferralStatus } from '@/types/referral/ReferralStatus';

export interface UpdateReferralPayload {
  id: string;
  status?: ReferralStatus | string;
}
