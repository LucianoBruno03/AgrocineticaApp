export interface LoadingPointsListResponse {
  data: LoadingPoints[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface LoadingPoints {
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
  administrativeSchedule: any;
  startDate: any;
  endDate: any;
  geoLatitude: number;
  geoLongitude: number;
  observation: any;
  active: boolean;
}
