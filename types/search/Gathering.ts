export interface GatheringListResponse {
  data: Gathering[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface Gathering {
  id: string;
  entityId: string;
  name: string;
  email: any;
  phone: any;
  entityBusinessName: string;
  countryId: string;
  provinceId: string;
  locationId: string;
  locationName: string;
  address: string;
  startDate?: string;
  endDate: any;
  geoLatitude: number;
  geoLongitude: number;
  observation: any;
  active: boolean;
}
