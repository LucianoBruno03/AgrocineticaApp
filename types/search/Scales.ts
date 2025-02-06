export interface ScalesListResponse {
  data: Scales[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface Scales {
  id: string;
  name: string;
  email: string;
  phone: string;
  countryId: string;
  provinceId: string;
  locationId: string;
  locationName: string;
  address: string;
  administrativeSchedule: any;
  startDate: string;
  endDate: any;
  geoLatitude: number;
  geoLongitude: number;
  observation: any;
  active: boolean;
}
