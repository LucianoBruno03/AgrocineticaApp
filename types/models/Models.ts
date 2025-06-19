export interface CreateModels {
  brandId: string;
  name: string;
  active: boolean;
}

export interface SearchModelsResponse {
  data: Models[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface Models {
  id: string;
  brandId: string;
  brandName: string;
  name: string;
  active: boolean;
}
