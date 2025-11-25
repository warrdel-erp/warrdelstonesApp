import { PaginationData } from './InventoryTypes.ts';
import { Customers } from './CustomerTypes.ts';
import { ClientUsers } from '../network/services/AuthService.ts';

export interface BaseResponse {
  success: boolean;
  message: string;
}

export interface BaseResponseData<T> extends BaseResponse {
  data: T;
}

export interface PaginatedResponse<T> extends BaseResponseData<T> {
  paginationData: PaginationData;
}

export interface MutationResponse extends BaseResponse {
  data: {
    message: string;
  };
}

export interface LocationsResponse extends BaseResponse {
  data: Location[];
}

export interface Location {
  id: number;
  location: string;
  contactName: string;
  contactNumber: string;
  contactMail: string;
  address: string;
  lat: string;
  long: string;
  status: string;
  clientId: number;
  createdAt: Date;
  updatedAt: Date;
  user_locations: UserLocation;
}

export interface UserLocation {
  createdAt: Date;
  updatedAt: Date;
  userId: number;
  locationId: number;
}

export interface GeneralDataResponse extends BaseResponse {
  data: GeneralData;
}

export interface GeneralData {
  productSubCategories: ProductSubCategory[];
  productColors: ProductColor[];
  countries: Country[];
  unitOfMeasurement: UnitOfMeasurement[];
  deliveryType: DeliveryType;
  paymentTerms: PaymentTerms[];
  shipmentTerms: ShipmentTerms[];
  scope: Scope[];
  languages: Language[];
  thickness: Thickness[];
  finish: Finish[];
  group: Group[];
  kind: Kind[];
  salesTax: SalesTax[];
  paymentMethods: PaymentMethods;
}

export interface Kind {
  id: number;
  value: string;
}

export interface Group {
  id: number;
  name: string;
}

export interface Country {
  id: number;
  name: string;
}

export interface ProductColor {
  id: number;
  name: string;
}

export interface DeliveryType {
  Pickup: string;
  Delivery: string;
  Other: string;
}

export interface Finish {
  id: number;
  name: string;
  clientId?: number;
}

export interface PaymentTerms {
  id: number;
  value: string;
}

export interface ShipmentTerms {
  id: number;
  value: string;
}

export interface Scope {
  id: number;
  value: string;
}

export interface Thickness {
  id: number;
  value: string;
}

export interface Language {
  id: number;
  value: string;
  code: string;
}

export interface PaymentMethods {
  CREDIT_CARD: string;
  BANK_TRANSFER: string;
  CASH: string;
  CHEQUE: string;
}

export interface ProductSubCategory {
  id: number;
  name: string;
  clientId: number;
  isSlabType: boolean;
}

export interface SalesTax {
  id: number;
  code: string;
  label: string;
  value: number;
  stateTax?: number;
}

export interface UnitOfMeasurement {
  id: number;
  name: string;
  code: string;
}

export interface OpenPosResponse extends BaseResponse {
  data: OpenPos;
}

export interface CustomersAmounts {
  totalAmount: number;
  totalPaidAmount: number;
}

export interface VendorsAmountsResponse extends BaseResponse {
  data: VendorsAmounts;
}

export interface CustomersAmountsResponse extends BaseResponse {
  data: CustomersAmounts;
}

export interface VendorsAmounts {
  totalAmount: number;
  totalPaidAmount: number;
}

export interface OpenPos {
  count: number;
}

export type BasePageRequest = {
  page: number;
  limit: number;
};

export interface Bin {
  id: number;
  name: string;
  warehouseId: number;
  warehouse: Warehouse;
}

export interface Warehouse {
  id: number;
  locationId: number;
  createdAt: Date;
  updatedAt: Date;
  location: Location;
}

export interface ProductAccounts {
  finishedGoodsAccount: Account;
  cogsAccount: Account;
  goodsSoldAccount: Account;
}

export type ProductAccountsResponse = {
  data: ProductAccounts;
};

export interface Account {
  id: number;
  name: string;
  key: string;
  type: string;
  openingBalance: string;
  openingDate: Date;
  subHeaderId: number;
  referenceId: null;
  code: number;
  referenceType: null;
  clientId: number;
}

export type BinsResponse = {
  data: Bin[];
};

export interface ClientUsersResponse extends BaseResponse {
  data: ClientUsers;
}
