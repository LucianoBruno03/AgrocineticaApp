export interface SearchLoadingOrdersResponse {
  data: LoadingOrders[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface LoadingOrders {
  id: string;
  incrementId: number;
  businessDetailId: string;
  destinationQuantity: number;
  issuingDate: string;
  loadDate: string;
  journeyStart: string;
  timeDifference: string;
  capacity: number;
  kgsUnloaded: number;
  kgsDifference: number;
  customerTolerance: number;
  kmTraveled: number;
  ctgNumber: string;
  remittanceNumber: string;
  userId: string;
  userName: string;
  loadingOrderStatusId: string;
  loadingOrderStatusName: string;
  cancellationReasonId: string;
  cancellationReasonDescription: string;
  billOfLading: string;
  observation: string;
  arrivalDate: string;
  unloadedDate: string;
  completedDate: string;
  entityId: string;
  entityBusinessName: string;
  transportUserId: string;
  transportUserName: string;
  isCompliantDocumentation: boolean;
  systemDocumentationDate: string;
  userDocumentationDate: string;
  distance: number;
  isRemainingCapacity: boolean;
  kilograms: number;
  scalableId: string;
  documentationObservation: string;
  chassisId: string;
  chassisName: string;
  trailerId: string;
  trailerName: string;
  driverId: string;
  driverName: string;
  isItInvoiced: boolean;
  isItSettled: boolean;
  businessDetailBusinessIncrementId: number;
  businessDetailBusinessEntityId: string;
  businessDetailBusinessEntityBusinessName: string;
  businessDetailBusinessBusinessUserId: string;
  businessDetailBusinessCustomerRate: number;
  businessDetailBusinessTransportRate: number;
  businessDetailBusinessIsKilograms: boolean;
  businessDetailBusinessIsKilometers: boolean;
  businessDetailBusinessIsOrigin: boolean;
  businessDetailBusinessIsDestination: boolean;
  businessDetailBusinessIsWeightScaleOrigin: boolean;
  businessDetailBusinessIsWeightScaleDestination: boolean;
  businessDetailBusinessIsPhysicalPapers: boolean;
  businessDetailBusinessFirstLoadingPoint: string;
  businessDetailBusinessLastUnloadingPoint: string;
}

export interface SearchLoadingOrderFilesResponse {
  data: LoadingOrderFiles;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface LoadingOrderFiles {
  id: string;
  loadingOrderId: string;
  name: string;
  fileExtension: string;
  filePath: string;
}
