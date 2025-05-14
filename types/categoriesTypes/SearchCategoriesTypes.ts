export interface SearchCategoriesTypesResponse {
  data: CategoriesTypes[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface CategoriesTypes {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
  active: boolean;
}
