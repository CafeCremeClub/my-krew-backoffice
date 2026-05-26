export type ConsultantsSortBy = 'name' | 'startDate';
export type ConsultantsSortOrder = 'asc' | 'desc';

export interface GetConsultantsParams {
  page?: number;
  perPage?: number;
  search?: string;
  status?: string;
  portageId?: string;
  officeId?: string;
  sortBy?: ConsultantsSortBy;
  sortOrder?: ConsultantsSortOrder;
}
