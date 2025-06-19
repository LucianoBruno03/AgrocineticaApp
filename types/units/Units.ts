export interface ICreateUnitRequest {
  entityId: string;
  domain: string;
  typeUnitId: string;
  typeUnitName?: string;
  brandId?: string | undefined;
  modelId?: string | undefined;
  year?: number;
  rutaExpiryDate?: Date | undefined;
  civilLiabilityInsuranceExpiryDate?: Date | undefined;
  observation?: string | undefined;
  startDate?: Date | undefined;
  endDate?: Date | undefined;
  cargoInsuranceExpiryDate?: Date | undefined;
  technicalInspectionExpiryDate?: Date | undefined;
  scalableId: string;
  isAvailable?: boolean;
  active?: boolean;
}

export class UpdateUnitRequest implements IUpdateUnitRequest {
  id?: string;
  entityId!: string;
  domain!: string;
  typeUnitId!: string;
  typeUnitName?: string;
  brandId?: string | undefined;
  modelId?: string | undefined;
  year?: number;
  rutaExpiryDate?: Date | undefined;
  civilLiabilityInsuranceExpiryDate?: Date | undefined;
  observation?: string | undefined;
  startDate?: Date | undefined;
  endDate?: Date | undefined;
  cargoInsuranceExpiryDate?: Date | undefined;
  technicalInspectionExpiryDate?: Date | undefined;
  scalableId!: string;
  isAvailable?: boolean;
  active?: boolean;
}

export interface IUpdateUnitRequest {
  id?: string;
  entityId: string;
  domain: string;
  typeUnitId: string;
  typeUnitName?: string;
  brandId?: string | undefined;
  modelId?: string | undefined;
  year?: number;
  rutaExpiryDate?: Date | undefined;
  civilLiabilityInsuranceExpiryDate?: Date | undefined;
  observation?: string | undefined;
  startDate?: Date | undefined;
  endDate?: Date | undefined;
  cargoInsuranceExpiryDate?: Date | undefined;
  technicalInspectionExpiryDate?: Date | undefined;
  scalableId: string;
  isAvailable?: boolean;
  active?: boolean;
}

export interface IUnitDto {
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
