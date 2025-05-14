export interface SearchBusinessResponse {
  data: Business[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface Business {
  id: string;
  incrementId: number;
  loadDate: string;
  loadTime: string;
  unloadDate: string;
  unloadTime: string;
  itemId: string;
  itemName: string;
  customerRate: number;
  transportRate: number;
  quantity: number;
  incompleteQuantity: number;
  businessUserId: string;
  businessUserName: string;
  userId: string;
  userName: string;
  entityId: string;
  entityBusinessName: string;
  shipperId: string;
  shipperBusinessName: string;
  commission: number;
  isKilograms: boolean;
  isKilometers: boolean;
  isOrigin: boolean;
  isDestination: boolean;
  isWeightScaleOrigin: boolean;
  isWeightScaleDestination: boolean;
  isPhysicalPapers: boolean;
  gatheringId: string;
  gatheringName: string;
  scaleId: string;
  scaleName: string;
  isScale: boolean;
  businessStatusId: string;
  businessStatusName: string;
  cancellationReasonId: string;
  cancellationReasonDescription: string;
  showOnWeb: boolean;
  businessLoadingPoints: BusinessLoadingPoint[];
  businessUnloadingPoints: BusinessUnloadingPoint[];
  businessesUnitTypes: BusinessesUnitType[];
  firstLoadingPoint: string;
  lastUnloadingPoint: string;
}

export interface BusinessLoadingPoint {
  id: string;
  incrementId: number;
  businessId: string;
  loadingPointId: string;
  loadingPointName: string;
  order: number;
  distance: number;
  statusId: string;
  arrivalDate: string;
  loadedDate: string;
  isArrival: boolean;
  isLoaded: boolean;
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
  distance: number;
  statusId: string;
  arrivalDate: string;
  unloadedDate: string;
  isArrival: boolean;
  isUnloaded: boolean;
  unloadingPointGeoLatitude: number;
  unloadingPointGeoLongitude: number;
}

export interface BusinessesUnitType {
  id: string;
  businessId: string;
  typeUnitId: string;
  typeUnitName: string;
}
