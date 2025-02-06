export interface CategoryTypesListResponse {
  data: CategoryTypes[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface CategoryTypes {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
  active: boolean;
}
