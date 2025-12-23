import {
  Account,
  BaseResponse,
  Bin,
  Country,
  Group,
  ProductColor,
  ProductSubCategory,
  UnitOfMeasurement,
} from './CommonTypes.ts';

export interface InventoryResponse extends BaseResponse {
  data: Inventory[];
  paginationData: PaginationData;
}

export interface Inventory {
  id: number;
  name: string;
  alternativeName: string;
  inventoryLinkAccountId: number;
  incomeAccountId: number;
  costOfGoodsAccountId: number;
  baseColorId: number | null;
  groupId: number | null;
  origin?: Country;
  uom?: UnitOfMeasurement;
  weight: number | null;
  finishId: number | null;
  kind: string;
  thickness: number | null;
  notes: null | string;
  specialInstruction: null | string;
  disclaimer: null | string;
  isSlabType: boolean;
  singleUnitPrice: string;
  bundlePrice: string;
  reorderQuantity: null | string;
  safetyQuantity: null | string;
  binId: number | null;
  createdBy: number;
  updatedBy: number;
  status: string;
  subCategoryId: number;
  createdAt: Date;
  updatedAt: Date;
  subCategory: ProductSubCategory;
  genericProducts: GenericProduct[];
  group: Group | null;
  baseColor: ProductColor | null;
  sipls: Sipl[];
  totalQuantity: string;
  totalSlabsCount: number;
  totalHoldQuantity: string;
  totalHoldSlabsCount: number;
  bundles: Bundle[];
  blocks: Block[];
}

export interface Block {
  block: string;
  totalQuantity: string;
  slabs: Slab[];
}

export interface Bundle {
  bundle: string;
  totalQuantity: string;
  slabs: Slab[];
}

export interface Slab {
  id: number;
  serialNumber: number;
  slabNumber: number;
  entryUnit: EntryUnit;
  packageLength: number;
  packageWidth: number;
  receivingLength: number;
  receivingWidth: number;
  block: string;
  lot: string;
  notes: string;
  barcode: string;
  status: SlabStatus;
  isHold: boolean;
  createdBy: number;
  updatedBy: number;
  productId: number;
  landedUnitCost: number;
  siplId: number;
  inventoryProductId: number;
  purchaseOrderId: number;
  siplProductId: number;
  clientId: number;
  createdAt: Date;
  updatedAt: Date;
  inventoryProduct: InventoryProduct;
  sipl: Sipl;
}
export interface GenericProduct {
  id: number;
  barcode: string;
  landedUnitCost: number;
  isHold: boolean;
  createdById: number;
  updatedById: number;
  productId: number;
  siplId: number;
  inventoryProductId: number;
  status: InventoryProductStatus;
  siplProductId: number;
  createdAt: Date;
  updatedAt: Date;
  inventoryProduct: InventoryProduct;
  sipl: Sipl;
}

export enum InventoryProductStatus {
  InInventory = 'IN_INVENTORY',
  Sold = 'SOLD',
}

export interface Sipl {
  id: number;
  clientInvoiceNumber: number;
  dueDate: Date;
  shipDate: Date;
  clientInvoiceDate: Date;
  poSiplNumber: number;
  invoiceCode: string;
  supplierInvoiceNumber: string;
  supplierInvoiceDate: Date;
  description: null;
  supplierNotes: null;
  status: SiplStatus;
  createdBy: number;
  updatedBy: number;
  inventoryReceived: boolean;
  purchaseOrderId: number;
  purchaseLocationId: number;
  shipmentLocationId: number;
  clientId: number;
  createdAt: Date;
  updatedAt: Date;
  slabs: Slab[];
  inventoryProducts: any[];
  genericProducts: GenericProduct[];
  purchaseOrder: PurchaseOrder;
  totalArea?: number;
}

// Type alias for Sipl (used in inventory screens)
export type SiplElement = Sipl;

export interface PurchaseOrder {
  id: number;
  clientPoNumber: number;
}

export interface Slab {
  id: number;
  serialNumber: number;
  slabNumber: number;
  entryUnit: EntryUnit;
  packageLength: number;
  packageWidth: number;
  receivingLength: number;
  receivingWidth: number;
  block: string;
  lot: string;
  notes: string;
  barcode: string;
  status: SlabStatus;
  isHold: boolean;
  createdBy: number;
  updatedBy: number;
  productId: number;
  isInCart: boolean;
  landedUnitCost: number;
  siplId: number;
  inventoryProductId: number;
  purchaseOrderId: number;
  siplProductId: number;
  clientId: number;
  createdAt: Date;
  updatedAt: Date;
  product: ProductColor;
  inventoryProduct: InventoryProduct;
  sipl: Sipl;
}

export enum EntryUnit {
  In = 'in',
}

export enum SiplStatus {
  Pending = 'pending',
}

export interface Category {
  id: number;
  name: string;
  clientId: number;
  isSlabType: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductDetailResponse extends BaseResponse {
  data?: ProductDetail;
}

export interface ProductDetail {
  id: number;
  name: string;
  alternativeName: string;
  inventoryLinkAccountId: number;
  incomeAccountId: number;
  costOfGoodsAccountId: number;
  baseColorId: number;
  groupId: number;
  origin: Country;
  uom: string;
  weight: number;
  thickness: string;
  finishId: number;
  kind: string;
  notes: string;
  specialInstruction: string;
  disclaimer: string;
  isSlabType: boolean;
  singleUnitPrice: string;
  avgLandedCost: string;
  bundlePrice: string;
  reorderQuantity: string;
  safetyQuantity: string;
  binId: number;
  createdBy: number;
  updatedBy: number;
  status: string;
  subCategoryId: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  slabs: any[];
  category: Category;
  subCategory: ProductSubCategory;
  inventoryLinkAccount: Account;
  incomeAccount: Account;
  costOfGoodsAccount: Account;
  baseColor: ProductColor;
  inventoryBalance: InventoryBalance;
}

export interface InventoryBalance {
  inStock: AllocatedHold[];
  allocatedHold: AllocatedHold[];
  available: AllocatedHold[];
}

export interface AllocatedHold {
  count: number;
  area: null;
}

export interface SlabDetailResponse extends BaseResponse {
  data: SlabDetail;
}

export interface SlabDetail {
  id: number;
  serialNumber: number;
  slabNumber: number;
  entryUnit: string;
  packageLength: number;
  packageWidth: number;
  receivingLength: number;
  receivingWidth: number;
  block: string;
  lot: string;
  notes: string;
  barcode: string;
  status: string;
  isHold: boolean;
  createdBy: number;
  updatedBy: number;
  productId: number;
  landedUnitCost: number;
  siplId: number;
  inventoryProductId: number;
  purchaseOrderId: number;
  siplProductId: number;
  clientId: number;
  createdAt: Date;
  updatedAt: Date;
  remeasurements: any[];
  sipl: Sipl;
  product: ProductDetail;
}

export interface PurchaseOrder {
  id: number;
  supplier: Supplier;
}

export interface Supplier {
  name: string;
}

export interface InventoryProductsResponse extends BaseResponse {
  data: InventoryProduct[];
}

export interface InventoryProduct {
  id: number;
  binId: number;
  siplId: number;
  sellingPrice: number;
  isInCart: boolean;
  combinedNumber: string;
  productId: number;
  isSlabType: boolean;
  clientId: number;
  createdAt: Date;
  updatedAt: Date;
  status: InventoryProductStatus;
  bin: Bin;
}

export enum SlabStatus {
  Initiate = 'INITIATE',
  InInventory = 'IN_INVENTORY',
  Allocated = 'ALLOCATED',
  Sold = 'SOLD',
}
