export interface ParsedForm {
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
  entityBusinessName: string; // Este campo no existe en el tipo original
  shipperId: string;
  shipperName: string; // Este campo no existe en el tipo original
  commission: number;
  isKilograms: boolean;
  isKilometers: boolean;
  isOrigin: boolean;
  isDestination: boolean;
  isWeightScaleOrigin: boolean;
  isWeightScaleDestination: boolean;
  isPhysicalPapers: boolean;
  gatheringId: string;
  gatheringName: string; // Este campo no existe en el tipo original
  scaleId: string;
  scaleName: string; // Este campo no existe en el tipo original
  isScale: boolean;
  cancellationReasonId: string | null;
  showOnWeb: boolean;
  businessesUnitTypes: BusinessesUnitType[];
  businessesLoadingPoints: BusinessesLoadingPoint[];
  businessesUnloadingPoint: BusinessesUnloadingPoint[];
}

export interface BusinessesUnitType {
  businessId: string;
  typeUnitId: string;
  typeUnitName: string;
}

export interface BusinessesLoadingPoint {
  businessId: string;
  loadingPointId: string;
  order: number;
  distance: number;
  statusId: string;
  arrivalDate: string;
  loadedDate: string;
  isArrival: boolean;
  isLoaded: boolean;
}

export interface BusinessesUnloadingPoint {
  businessId: string;
  unloadingPointId: string;
  order: number;
  distance: number;
  statusId: string;
  arrivalDate: string;
  unloadedDate: string;
  isArrival: boolean;
  isUnloaded: boolean;
}
