export interface SearchBusinessDetailsResponse {
  data: BusinessDetails[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface BusinessDetails {
  id: string;
  incrementId: number;
  businessId: string;
  businessItemId: string;
  businessItemName: string;
  businessUserId: string;
  businessUserName: string;
  businessEntityId: string;
  businessEntityBusinessName: string;
  businessDetailStatusId: string;
  businessDetailStatusName: string;
  businessLoadingPoints: BusinessLoadingPoint[];
  businessUnloadingPoints: BusinessUnloadingPoint[];
  businessesUnitTypes: BusinessesUnitType[];
}

export interface BusinessLoadingPoint {
  id: string;
  incrementId: number;
  businessId: string;
  loadingPointId: string;
  loadingPointName: string;
  order: number;
  distance: any;
  statusId: any;
  arrivalDate: any;
  loadedDate: any;
  isArrival: any;
  isLoaded: any;
  loadingPointGeoLatitude: number;
  loadingPointGeoLongitude: number;
}

export interface BusinessUnloadingPoint {
  id: string;
  incrementId: number;
  businessId: string;
  unloadingPointId: string;
  unloadingPointName: string;
  order: number;
  distance: any;
  statusId: any;
  arrivalDate: any;
  unloadedDate: any;
  isArrival: any;
  isUnloaded: any;
  unloadingPointGeoLatitude: number;
  unloadingPointGeoLongitude: number;
}

export interface BusinessesUnitType {
  id: string;
  businessId: string;
  typeUnitId: string;
  typeUnitName: string;
}
