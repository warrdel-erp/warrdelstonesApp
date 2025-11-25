import { BaseResponse, Country, Group, ProductColor, ProductSubCategory } from './CommonTypes.ts';
import { Inventory, PaginationData, Slab } from './InventoryTypes.ts';

export interface ProductResponse extends BaseResponse {
  data: ProductList;
  paginationData: PaginationData;
}

export type ProductList = Product[];
export interface Product {
  id: number;
  name: string;
  alternativeName: string;
  inventoryLinkAccountId: number;
  incomeAccountId: number;
  costOfGoodsAccountId: number;
  baseColorId: number | null;
  groupId: number | null;
  origin?: Country;
  uom: Uom;
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
  deletedAt: null;
  subCategory: ProductSubCategory;
  slabs: Slab[];
  genericProducts: any[];
  group: Group | null;
  baseColor: ProductColor | null;
}

export interface Uom {
  id: number;
  name: string;
  code: string;
}
