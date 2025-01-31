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
  loadTime: any;
  unloadDate: any;
  unloadTime: any;
  itemId: string;
  itemName: string;
  customerRate: number;
  transportRate: number;
  quantity: number;
  businessUserId: string;
  businessUserName: string;
  userId: string;
  userName: string;
  entityId: string;
  shipperId: any;
  entityBusinessName: string;
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
  scaleId: any;
  scaleName: any;
  isScale: boolean;
  businessStatusId: string;
  businessStatusName: string;
  cancellationReasonId: any;
  cancellationReasonDescription: any;
  showOnWeb: boolean;
  businessLoadingPoints: BusinessLoadingPoint[];
  businessUnloadingPoints: BusinessUnloadingPoint[];
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
