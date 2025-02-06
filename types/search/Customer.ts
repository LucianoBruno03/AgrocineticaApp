export interface CustomerListResponse {
  data: Customer[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface Customer {
  id: string;
  incrementId: number;
  userId: any;
  isUser: boolean;
  cuit: string;
  businessName: string;
  tradeName: any;
  categoryTypeId: string;
  taxpayerTypeName: string;
  countryId: string;
  countryName: string;
  provinceId: string;
  provinceName: string;
  locationId: string;
  locationName: string;
  address: string;
  phone: any;
  email: any;
  isTransportUser: boolean;
  transportUserId: string;
  isBusinessUser: boolean;
  businessUserId: string;
  literDiscount: number;
  isCurrentAccount: boolean;
  currentAccountAmount: number;
  collectionDueDate: number;
  paymentDueDate: number;
  isTraditional: boolean;
  isSettlement: boolean;
  isPhysical: boolean;
  isDigital: boolean;
  interest: number;
  eRoleId: string;
  eRoleName: string;
  observation: any;
  isSalesperson: boolean;
  url: any;
  active: boolean;
}
