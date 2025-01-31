import { JwtPayload } from "jwt-decode";

export interface LoginResponse {
  token: string;
  refreshToken: string;
  refreshTokenExpiryTime: string;
}

export interface IUserInfo extends JwtPayload {
  exp: number;
  fullName: string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress": string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/mobilephone": string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname": string;
  image_url: string;
  ipAddress: string;
  tenant: string;
}

export interface User {
  id: string;
  incrementId: number;
  userId: string;
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
  phone: string;
  email: string;
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
