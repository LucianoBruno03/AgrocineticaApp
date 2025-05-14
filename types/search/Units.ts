export interface UnitsListResponse {
  data: Units[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface Units {
  id: string;
  entityId: string;
  entityBusinessName: string;
  domain: string;
  typeUnitId: string;
  typeUnitName: string;
  brandId: string;
  brandName: string;
  modelId: string;
  modelName: string;
  year: number;
  rutaExpiryDate: string;
  civilLiabilityInsuranceExpiryDate: string;
  observation: any;
  startDate: string;
  endDate: string;
  cargoInsuranceExpiryDate: string;
  technicalInspectionExpiryDate: string;
  scalableId: string;
  scalableName: string;
  isAvailable: boolean;
  active: boolean;
}
