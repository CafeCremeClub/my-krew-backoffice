export interface BulkUpdateConsultantsPayload {
  ids: string[];
  officeId?: string;
  portageId?: string;
}

export interface BulkUpdateConsultantsResult {
  requested: number;
  updated: number;
  failed: number;
  failedIds: string[];
}
