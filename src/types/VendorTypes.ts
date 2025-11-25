import { BaseResponse, PaymentTerms } from './CommonTypes.ts';
import { PaginationData } from './InventoryTypes.ts';

export interface VendorsResponse extends BaseResponse {
  data: Vendors;
  paginationData: PaginationData;
}

export type Vendors = Vendor[];
export interface Vendor {
  id: number;
  name: string;
  printName: string;
  parentLocationId: null;
  type: string;
  vendorScope: string;
  contactName: string;
  vendorSince: Date;
  primaryPhoneNo: string;
  secondaryPhoneNo: null | string;
  landlineNo: null | string;
  email: string;
  accountingEmail: string;
  remitAddress: string;
  remitSuite: null | string;
  remitCity: string;
  status: string;
  remitState: string;
  remitZip: string;
  remitCountry: string;
  shippingAddress: string;
  shippingSuite: null | string;
  shippingCity: string;
  shippingState: string;
  shippingZip: string;
  shippingCountry: string;
  paymentTerms: PaymentTerms;
  createdBy: number;
  currency: string;
  defaultPaymentMethod: null | string;
  internalNotesId: null;
  clientId: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  parentLocation: ParentLocation | null;
}

interface ParentLocation {
  address: string;
}
