export interface ItemsListResponse {
  data: Items[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface Items {
  id: string;
  name: string;
  iRoleId: string;
  iRoleName: string;
  itemCategoryId: string;
  itemCategoryName: string;
  itemSubCategoryId: string;
  itemSubCategoryName: string;
  brandId: string;
  brandName: string;
  modelId: string;
  modelName: string;
  unitOfMeasurementId: string;
  unitOfMeasurementName: string;
  barCode: any;
  factoryCode: any;
  generalStock: number;
  minimumStock: number;
  maximumStock: number;
  quantityPerPackage: number;
  pricePerPackage: number;
  movesStock: boolean;
  showOnWeb: boolean;
  active: boolean;
  description: any;
}
