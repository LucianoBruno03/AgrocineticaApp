export interface SearchCancellationReasonsResponse {
  data: CancellationReasons[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface CancellationReasons {
  id: string;
  incrementId: number;
  cancellationTypeId: string;
  cancellationTypeName: string;
  description: string;
  isActive: boolean;
}
