export interface ChauffeurListResponse {
  data: Chauffeur[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface Chauffeur {
  id: string;
  cuit: string;
  name: string;
  entityId: string;
  validUntil: any;
  entityBusinessName: string;
  countryId: any;
  provinceId: any;
  locationId: any;
  address: any;
  phone: any;
  email: any;
  observation: any;
  isAvailable: boolean;
  active: boolean;
}
