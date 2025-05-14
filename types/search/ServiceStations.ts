export interface ServiceStationsListResponse {
  data: ServiceStations[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface ServiceStations {
  id: string;
  entityId: string;
  name: string;
  email: string;
  phone: string;
  entityBusinessName: string;
  countryId: string;
  provinceId: string;
  locationId: string;
  locationName: string;
  address: string;
  administrativeSchedule: string;
  startDate: string;
  endDate: string;
  geoLatitude: number;
  geoLongitude: number;
  observation: string;
  active: boolean;
}
