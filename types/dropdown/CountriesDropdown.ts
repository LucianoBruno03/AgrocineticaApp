export interface CountriesListResponse {
  data: Countries[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface Countries {
  id: string;
  name: string;
  ord: number;
  active: boolean;
}
