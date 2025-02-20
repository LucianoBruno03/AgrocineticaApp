export interface BusinessEdit {
  id: string;
  loadDate: string;
  loadTime: string;
  unloadDate: string;
  unloadTime: string;
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
  shipperId: string;
  shipperName?: string;
  commission: number;
  isKilograms: boolean;
  isKilometers: boolean;
  isOrigin: boolean;
  isDestination: boolean;
  isWeightScaleOrigin: boolean;
  isWeightScaleDestination: boolean;
  isPhysicalPapers: boolean;
  gatheringId: string;
  scaleId: string;
  isScale: boolean;
  businessStatusId: string;
  businessStatusName: string;
  cancellationReasonId: string;
  showOnWeb: boolean;
}

export interface BusinessById {
  id: string;
  incrementId: number;
  loadDate: any;
  loadTime: any;
  unloadDate: any;
  unloadTime: any;
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
  shipperId: any;
  shipperName?: any;
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
