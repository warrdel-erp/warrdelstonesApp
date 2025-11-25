import { BaseResponse, PaymentTerms, SalesTax } from './CommonTypes.ts';
import { PaginationData } from './InventoryTypes.ts';

export interface CustomersResponse extends BaseResponse {
  data: Customers;
  paginationData: PaginationData;
}

export type Customers = Customer[];

export interface Customer {
  salesTax?: SalesTax;
  paymentTerm: PaymentTerms;
  scope: PaymentTerms;
  id: number;
  name: string;
  type: string;
  contactName: string;
  printName: null | string;
  primaryPhoneNumber: string;
  secondaryPhoneNumber: null | string;
  landlineNumber: null | string;
  accEmail: null | string;
  email: string;
  priceLevel: null | string;
  taxExempt: boolean;
  salesTaxId: number;
  paymentTermId: number;
  exemptCerti: null | string;
  exemptExpiry: Date | null;
  internalNotes: null | string;
  poRequired: boolean;
  applyFinanceCharges: boolean;
  preferredDocSend: null | string;
  daysForGrace: number | null;
  daysForHold: number | null;
  customerSince: Date | null;
  einNumber: null | string;
  status: string;
  scopeId: number;
  createdBy: number;
  clientId: number;
  updatedBy: number;
  deletedAt: null;
  primarySalesPersonId: number | null;
  createdAt: Date;
  updatedAt: Date;
  addresses: Address[];
  primarySalesPerson: PrimarySalesPerson | null;
}

export interface Address {
  id: number;
  address: string;
  unit: null | string;
  contactName: string;
  contactEmail: null | string;
  contactNumber: null | string;
  lat: null | string;
  long: null | string;
  addressType: string;
  customerId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PrimarySalesPerson {
  id: number;
  username: string;
  userid: string;
  phone: string;
  accountId: number;
  clientId: number;
  defaultLocationId: number;
  createdAt: Date;
  updatedAt: Date;
}
