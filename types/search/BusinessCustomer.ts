export interface BusinessCustomerListResponse {
  data: BusinessCustomer[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface BusinessCustomer {
  id: string;
  userName: string;
  firstName: string;
  fullName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  emailConfirmed: boolean;
  phoneNumber?: string;
  imageUrl?: string;
}
