import { UserAuthRole } from '@/types/UserAuthRole';

export interface AuthResponseUser {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string | null;
  role: UserAuthRole;
  createdAt: string;
  updatedAt: string;
}
