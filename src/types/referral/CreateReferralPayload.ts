import { ReferralStatus } from '@/types/referral/ReferralStatus';

export interface CreateReferralPayload {
  referrerId: string;
  refereeId: string;
  startDate: string; // format 2025-08-01
  endDate: string; // format 2025-08-01
  amount: number;
  creationDate: string; // format 2025-08-01
  status: ReferralStatus;
}
