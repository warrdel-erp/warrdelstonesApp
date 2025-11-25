import { PaginatedResponse } from './CommonTypes.ts';

export type ServiceOrderResponse = PaginatedResponse<SalesOrder[]>;

export interface SalesOrder {
  tax: Tax;
  id: number;
  clientSoNumber: number;
  soDate: Date;
  customerPo: null | string;
  status: Status;
  deliveryType: DeliveryType;
  deliveryNotes: null | string;
  paymentTermId: null;
  customerPoDate: Date | null;
  expDeliveryDate: Date | null;
  userId: number;
  customerId: number;
  shippingAddressId: number | null;
  clientId: number;
  soLocationId: number;
  taxId: number;
  createdAt: Date;
  updatedAt: Date;
  loadingOrderCount: number;
  customer: Customer;
  loadingOrders: LoadingOrder[];
  createdBy: CreatedBy;
  soLocation: SoLocation;
  notes: any[];
  salesOrderProducts: SalesOrderProduct[];
  totalAmount: number;
  fulFilled: number | null;
}

export interface CreatedBy {
  id: number;
  username: Username;
  phone: string;
}

export enum Username {
  ChrisEvans = 'Chris Evans',
}

export interface Customer {
  scope: Scope;
  id: number;
  scopeId: number;
  daysForHold: number | null;
  name: Name;
  primaryPhoneNumber: string;
}

export enum Name {
  Customer1 = 'Customer-1',
  GraniteSolutionsLLC = 'Granite Solutions LLC',
  HenryCavil = 'Henry Cavil',
}

export interface Scope {
  id: number;
  value: Value;
}

export enum Value {
  National = 'National',
}

export enum DeliveryType {
  Delivery = 'delivery',
}

export interface LoadingOrder {
  id: number;
  code: string;
  packagingList: PackagingList | null;
}

export interface PackagingList {
  id: number;
  code: string;
}

export interface SalesOrderProduct {
  id: number;
  unitPrice: string;
  stage: Stage;
  inventoryProduct: InventoryProduct;
}

export interface InventoryProduct {
  id: number;
  slab: Slab;
}

export interface Slab {
  id: number;
  receivingLength: number;
  receivingWidth: number;
}

export enum Stage {
  LoadingOrder = 'loadingOrder',
  PackagingList = 'packagingList',
  SaleOrder = 'saleOrder',
}

export interface SoLocation {
  id: number;
  location: string;
}

export enum Status {
  Open = 'open',
}

export interface Tax {
  id: number;
  code: Code;
  label: Label;
  value: number;
  stateTax: number;
}

export enum Code {
  Dek = 'DEK',
  Dou = 'DOU',
  Ful = 'FUL',
}

export enum Label {
  GeorgiaStateDekalbCounty = 'Georgia State, Dekalb County',
  GeorgiaStateDouglasCounty = 'Georgia State, Douglas County',
  GeorgiaStateFultonCounty = 'Georgia State, Fulton County',
}

export interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
