export interface SearchUnitsResponse {
  data: Units[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface Units {
  id?: string;
  entityId?: string;
  entityBusinessName?: string;
  domain?: string;
  typeUnitId?: string;
  typeUnitName?: string;
  brandId?: string | undefined;
  brandName?: string | undefined;
  modelId?: string | undefined;
  modelName?: string | undefined;
  year?: number;
  rutaExpiryDate?: Date | undefined;
  civilLiabilityInsuranceExpiryDate?: Date | undefined;
  observation?: string | undefined;
  startDate?: Date | undefined;
  endDate?: Date | undefined;
  cargoInsuranceExpiryDate?: Date | undefined;
  technicalInspectionExpiryDate?: Date | undefined;
  scalableId?: string | undefined;
  scalableName?: string | undefined;
  isAvailable?: boolean;
  active?: boolean;
}
