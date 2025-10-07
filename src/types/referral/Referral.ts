import { ReferralUser } from '@/types/referral/ReferralUser';
import { ReferralStatus } from '@/types/referral/ReferralStatus';

export interface Referral {
  id: string;
  referrer: ReferralUser;
  referee: ReferralUser;
  startDate: string;
  endDate: string;
  status: ReferralStatus;
  amount: string;
  creationDate: string;
}
