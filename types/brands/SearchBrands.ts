export interface SearchBrandsResponse {
  data: Brands[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface Brands {
  id?: string;
  name?: string;
  active?: boolean;
}
