export interface SearchPurchaseOrdersResponse {
  data: PurchaseOrders[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface PurchaseOrders {
  id: string;
  incrementId: number;
  loadingOrderId: string;
  issuingDate: string;
  expirationDate: string;
  userId: string;
  userName: string;
  purchaseOrderStatusId: string;
  purchaseOrderStatusName: string;
  cancellationReasonId: string;
  cancellationReasonDescription: string;
  remittanceNumber: string;
  completedDate: string;
  entityId: string;
  entityBusinessName: string;
  serviceStationId: string;
  paymentMethodId: string;
  royalLiters: number;
  advance: number;
  total: number;
  observation: string;
  compliantDocumentation: boolean;
  documentationObservation: string;
  loadingOrderIncrementId: number;
  loadingOrderEntityId: string;
  loadingOrderEntityBusinessName: string;
  loadingOrderDriverId: string;
  loadingOrderDriverName: string;
  loadingOrderChassisId: string;
  loadingOrderChassisName: string;
}

export interface SearchPurchaseOrderFilesResponse {
  data: PurchaseOrderFiles;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface PurchaseOrderFiles {
  id: string;
  purchaseOrderId: string;
  name: string;
  fileExtension: string;
  filePath: string;
}

export interface SearchPurchaseOrderItemsResponse {
  data: PurchaseOrderItems[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface PurchaseOrderItems {
  id: string;
  purchaseOrderId: string;
  itemId: string;
  itemName: string;
  quantity: number;
}
