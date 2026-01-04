import React from 'react';
import { UserRole, UserRoleValue } from '../types/userTypes';
import { AccountPayableNavigator } from './stacks/accounting/AccountPayableNavigator.tsx';
import { AccountReceivableNavigator } from './stacks/accounting/AccountReceivableNavigator.tsx';
import { BalanceSheetNavigator } from './stacks/accounting/BalanaceSheetNavigator.tsx';
import { ChartsOfAccountsNavigator } from './stacks/accounting/ChartsOfAccountsNavigator.tsx';
import { CreditDebitNoteNavigator } from './stacks/accounting/CreditDebitNoteNavigator.tsx';
import { GeneralLedgerNavigator } from './stacks/accounting/GeneralLedgerNavigator.tsx';
import { TransactionsNavigator } from './stacks/accounting/TransactionsNavigator.tsx';
import { DashboardNavigator } from './stacks/dashboard/DashboardNavigator.tsx';
import { DemoNavigator } from './stacks/demo/DemoNavigator.tsx';
import { FreightBillsNavigator } from './stacks/expenses/FreightBillsNavigator.tsx';
import { PurchaseNavigator } from './stacks/expenses/PurchaseNavigator.tsx';
import { VendorInvoicesNavigator } from './stacks/expenses/VendorInvoicesNavigator.tsx';
import { CustomersNavigator } from './stacks/initiate/CustomersNavigator.tsx';
import { ProductsNavigator } from './stacks/initiate/ProductsNavigator.tsx';
import { ServicesNavigator } from './stacks/initiate/ServicesNavigator.tsx';
import { SuppliersNavigator } from './stacks/initiate/SuppliersNavigator.tsx';
import { TrucksNavigator } from './stacks/initiate/TrucksNavigator.tsx';
import { VendorsNavigator } from './stacks/initiate/VendorsNavigator.tsx';
import { InventoryNavigator } from './stacks/inventory/InventoryNavigator.tsx';
import { TransfersNavigator } from './stacks/inventory/TransfersNavigator.tsx';
import { DeliveriesNavigator } from './stacks/sales/DeliveriesNavigator.tsx';
import { InvoicesNavigator } from './stacks/sales/InvoicesNavigator.tsx';
import { ReturnsNavigator } from './stacks/sales/ReturnsNavigator.tsx';
import { SalesNavigator } from './stacks/sales/SalesNavigator.tsx';
import { LocationsNavigator } from './stacks/settings/LocationsNavigator.tsx';
import { PermissionsNavigator } from './stacks/settings/PermissionsNavigator.tsx';
import { UserRolesNavigator } from './stacks/settings/UserRolesNavigator.tsx';
import { UsersNavigator } from './stacks/settings/UsersNavigator.tsx';

export const StackId = {
  HOME: 'HomeStack',
  INVENTORY: 'InventoryStack',
  TRANSFERS: 'TransfersStack',
  SALES: 'SalesStack',
  LEADS: 'LeadsStack',
  INVOICES: 'InvoicesStack',
  DELIVERIES: 'DeliveriesStack',
  RETURNS: 'ReturnsStack',
  BATCH_INVOICING: 'BatchInvoicingStack',
  EXPENSES: 'ExpensesStack',
  PURCHASES: 'PurchasesStack',
  VENDOR_INVOICES: 'VendorInvoicesStack',
  FREIGHT_BILLS: 'FreightBillsStack',
  INITIATE: 'InitiateStack',
  PRODUCTS: 'ProductsStack',
  SUPPLIERS: 'SuppliersStack',
  CUSTOMERS: 'CustomersStack',
  VENDORS: 'VendorsStack',
  SERVICES: 'ServicesStack',
  TRUCKS: 'TrucksStack',
  ACCOUNTING_STACK: 'AccountingStack',
  GENERAL_LEDGER: 'GeneralLedgerStack',
  ACCOUNTING_PAYABLE: 'AccountingPayableStack',
  ACCOUNTING_RECEIVABLE: 'AccountingReceivableStack',
  CHARTS_OF_ACCOUNTS: 'ChartsOfAccountsStack',
  BALANCE_SHEET: 'BalanceSheetStack',
  TRANSACTIONS: 'TransactionsStack',
  CREDIT_DEBIG_NOTE: 'CreditDebitNoteStack',
  SETTINGS_STACK: 'SettingsStack',
  USER_ROLES: 'UserRolesStack',
  USERS: 'UsersStack',
  PERMISSIONS: 'PermissionsStack',
  LOCATIONS: 'LocationsStack',
  PROFILE: 'ProfileStack',
  DEMO_STACK: 'DemoStack',
} as const;

export const ScreenId = {
  HOME: 'Home',
  INVENTORY: 'Inventory',
  PRODUCT_DETAIL: 'ProductDetail',
  BLOCK_SLAB_LIST: 'BlockSlabsList',
  SLABS_LIST: 'SlabsList',
  TRANSFERS: 'Transfers',
  SALES_ORDER_LIST: 'SalesList',
  ADD_SALES_ORDER: 'AddSalesOrder',
  SALES_ORDER_DETAIL: 'SalesOrderDetail',
  INVOICES_LIST: 'InvoicesList',
  DELIVERIES_LIST: 'DeliveriesList',
  RETURNS_LIST: 'ReturnsList',
  PURCHASES_LIST: 'PurchasesList',
  VENDOR_INVOICES: 'VendorInvoices',
  FREIGHT_BILLS: 'FreightBills',
  PRODUCTS: 'Products',
  ADD_PRODUCT: 'AddProduct',
  SUPPLIERS: 'Suppliers',
  ADD_SUPPLIER: 'AddSupplier',
  CUSTOMERS: 'Customers',
  ADD_CUSTOMERS: 'AddCustomers',
  VENDORS: 'Vendors',
  SERVICES: 'Services',
  TRUCKS: 'Trucks',
  GENERAL_LEDGER: 'GeneralLedger',
  ACCOUNT_PAYABLE: 'AccountPayable',
  ACCOUNT_RECEIVABLE: 'AccountReceivable',
  CHART_OF_ACC: 'ChartOfAcc',
  BALANCE_SHEET: 'BalanceSheet',
  TRANSACTIONS: 'Transactions',
  CREDIT_DEBIT_NOTE: 'CreditDebitNote',
  USER_ROLES: 'UserRoles',
  USERS: 'Users',
  PERMISSIONS: 'Permissions',
  LOCATIONS: 'Locations',
  SUBJECTS: 'Subjects',
  SUBJECT_DETAILS: 'SubjectDetails',
  TIMETABLE: 'Timetable',
  STUDENT_LIST: 'StudentList',
  ADMISSIONS: 'Admissions',
  ATTENDANCE: 'Attendance',
  TEACHER_LIST: 'TeacherList',
  ASSIGNMENTS: 'Assignments',
  FEES: 'Fees',
  EXPENSES: 'Expenses',
  REPORTS: 'Reports',
  PROFILE: 'Profile',
  RESET_PASSWORD: 'ResetPasswordScreen',
  SETTINGS: 'Settings',
  COMPONENT_DEMO: 'ComponentDemo',
  ICONS_DEMO: 'IconsDemo',
  BUTTONS_DEMO: 'ButtonsDemo',
  HEADING_DEMO: 'HeadingDemo',
  STATUS_BADGES_DEMO: 'StatusBadgesDemo',
  FORM_COMPONENTS_DEMO: 'FormComponentsDemo',
  CARD_WITH_HEADER_DEMO: 'CardWithHeaderDemo',
  TABS_DEMO: 'TabsDemo',
  TABLE_DEMO: 'TableDemo',
  CLASS_ROUTINE: 'ClassRoutine',
  MY_CLASSES: 'MyClasses',
  SYLLABUS: 'Syllabus',
  COURSE_OUTCOME: 'CourseOutcome',
  PROGRAM_OUTCOME: 'ProgramOutcome',
  LESSON_PLAN: 'LessonPlan',
  TOPIC_OVERVIEW: 'TopicOverview',
  HOMEWORK_LIST: 'HomeworkList',
  HOMEWORK_REPORT: 'HomeworkReport',
  ADD_HOMEWORK: 'AddHomework',
  EXAM_SCHEDULE: 'ExamSchedule',
  EXAM_GRADES: 'ExamGrades',
  LIBRARY: 'Library',
  ISSUED_BOOKS: 'IssuedBooks',
  MEMBER_ID: 'MemberId',
  TRANSPORT_ROUTE: 'TransportRoute',
  HOSTEL: 'Hostel',
  WARDEN: 'Warden',
  FEE_PLAN: 'FeePlan',
  INCIDENTS: 'Incidents',
  BEHAVIOUR_REPORTS: 'BehaviourReports',
  DOWNLOAD_CENTER: 'DownloadCenter',
  NOTICE_BOARD: 'NoticeBoard',
  NOTICE_DETAIL: 'NoticeDetail',
  ADD_NOTICE: 'AddNoticeBoard',
  CALENDAR: 'Calendar',
  EVENT: 'Event',
  SEND_MESSAGE: 'SendMessage',
  HIERARCHY: 'Hierarchy',
  APPLY_LEAVES: 'ApplyLeaves',
  APPROVE_LEAVES: 'ApproveLeaves',
  COURSES: 'Courses',
  COURSE_OURCOME_LIST: 'CourseOutcomeList',
  PROGRAM_OURCOME_LIST: 'ProgramOutcomeList',
  COURSE_DETAIL: 'CourseDetail',
  SESSION_DETAILS: 'SessionDetails',
} as const;

export type StackIdType = (typeof StackId)[keyof typeof StackId];
export type ScreenIdType = (typeof ScreenId)[keyof typeof ScreenId];

export const ALL_ROLES: UserRoleValue[] = [
  UserRoleValue.ADMIN,
  UserRoleValue.TEACHER,
  UserRoleValue.HEAD,
  UserRoleValue.STUDENT,
  UserRoleValue.STAFF,
];

export interface NavigationTarget {
  stack: StackIdType;
  screen: ScreenIdType;
}

export interface ScreenItem {
  id: ScreenIdType;
  title: string;
  parentStack?: string;
  component: React.ComponentType<any>;
  roles?: UserRoleValue[];
  isRoot?: boolean;
}

export interface DrawerMenuItem {
  id: StackIdType;
  title: string;
  icon: string;
  component?: React.ComponentType<any>;
  children?: DrawerMenuItem[];
  roles?: UserRoleValue[];
  hideInDrawer?: boolean;
}

export const SALES_NAVIGATORS: DrawerMenuItem[] = [
  {
    id: StackId.SALES,
    title: 'Sales',
    icon: 'calendar-today',
    component: SalesNavigator,
    roles: ALL_ROLES,
  },
  {
    id: StackId.INVOICES,
    title: 'Invoices',
    icon: 'people',
    component: InvoicesNavigator,
    roles: ALL_ROLES,
  },
  {
    id: StackId.DELIVERIES,
    title: 'Deliveries',
    icon: 'people',
    component: DeliveriesNavigator,
    roles: ALL_ROLES,
  },
  {
    id: StackId.RETURNS,
    title: 'Returns',
    icon: 'people',
    component: ReturnsNavigator,
    roles: ALL_ROLES,
  },
];

export const INVENTORY_NAVIGATORS: DrawerMenuItem[] = [
  {
    id: StackId.INVENTORY,
    title: 'Inventory',
    icon: 'fact-check',
    component: InventoryNavigator,
    roles: ALL_ROLES,
  },
  {
    id: StackId.TRANSFERS,
    title: 'Transfers',
    icon: 'calendar-today',
    component: TransfersNavigator,
    roles: ALL_ROLES,
  },
];

export const EXPENSES_NAVIGATORS: DrawerMenuItem[] = [
  {
    id: StackId.PURCHASES,
    title: 'Purchases',
    icon: 'ballot',
    component: PurchaseNavigator,
    roles: ALL_ROLES,
  },
  {
    id: StackId.VENDOR_INVOICES,
    title: 'Vendor Invoices',
    icon: 'assessment',
    component: VendorInvoicesNavigator,
    roles: ALL_ROLES,
  },
  {
    id: StackId.FREIGHT_BILLS,
    title: 'Freight Bills',
    icon: 'assessment',
    component: FreightBillsNavigator,
    roles: ALL_ROLES,
  },
];

export const INITIATE_NAVIGATORS: DrawerMenuItem[] = [
  {
    id: StackId.PRODUCTS,
    title: 'Products',
    icon: 'subject',
    component: ProductsNavigator,
    roles: ALL_ROLES,
  },
  {
    id: StackId.SUPPLIERS,
    title: 'Suppliers',
    icon: 'topic',
    component: SuppliersNavigator,
    roles: ALL_ROLES,
  },
  {
    id: StackId.CUSTOMERS,
    title: 'Customers',
    icon: 'topic',
    component: CustomersNavigator,
    roles: ALL_ROLES,
  },
  {
    id: StackId.VENDORS,
    title: 'Vendors',
    icon: 'topic',
    component: VendorsNavigator,
    roles: ALL_ROLES,
  },
  {
    id: StackId.SERVICES,
    title: 'Services',
    icon: 'topic',
    component: ServicesNavigator,
    roles: ALL_ROLES,
  },
  {
    id: StackId.TRUCKS,
    title: 'Trucks',
    icon: 'topic',
    component: TrucksNavigator,
    roles: ALL_ROLES,
  },
];

export const ACCOUNTING_NAVIGATORS: DrawerMenuItem[] = [
  {
    id: StackId.GENERAL_LEDGER,
    title: 'General Ledger',
    icon: 'note-add',
    component: GeneralLedgerNavigator,
    roles: [UserRoleValue.TEACHER],
  },
  {
    id: StackId.ACCOUNTING_PAYABLE,
    title: 'Account Payable',
    icon: 'subject',
    component: AccountPayableNavigator,
    roles: ALL_ROLES,
  },
  {
    id: StackId.ACCOUNTING_RECEIVABLE,
    title: 'Account Receivable',
    icon: 'report',
    component: AccountReceivableNavigator,
    roles: ALL_ROLES,
  },
  {
    id: StackId.CHARTS_OF_ACCOUNTS,
    title: 'Charts of Accounts',
    icon: 'report',
    component: ChartsOfAccountsNavigator,
    roles: ALL_ROLES,
  },
  {
    id: StackId.BALANCE_SHEET,
    title: 'Balance Sheet',
    icon: 'report',
    component: BalanceSheetNavigator,
    roles: ALL_ROLES,
  },
  {
    id: StackId.TRANSACTIONS,
    title: 'Transactions',
    icon: 'report',
    component: TransactionsNavigator,
    roles: ALL_ROLES,
  },
  {
    id: StackId.CREDIT_DEBIG_NOTE,
    title: 'Credit Debit Note',
    icon: 'report',
    component: CreditDebitNoteNavigator,
    roles: ALL_ROLES,
  },
];

export const SETTINGS_NAVIGATORS: DrawerMenuItem[] = [
  {
    id: StackId.USER_ROLES,
    title: 'User Roles',
    icon: 'calendar-today',
    component: UserRolesNavigator,
    roles: ALL_ROLES,
  },
  {
    id: StackId.USERS,
    title: 'Users',
    icon: 'grade',
    component: UsersNavigator,
    roles: ALL_ROLES,
  },
  {
    id: StackId.PERMISSIONS,
    title: 'Permissions',
    icon: 'grade',
    component: PermissionsNavigator,
    roles: ALL_ROLES,
  },
  {
    id: StackId.LOCATIONS,
    title: 'Locations',
    icon: 'grade',
    component: LocationsNavigator,
    roles: ALL_ROLES,
  },
];

const DASHBOARD_STACK: DrawerMenuItem = {
  id: StackId.HOME,
  title: 'Dashboard',
  icon: 'dashboard',
  component: DashboardNavigator,
  roles: ALL_ROLES,
};

const INVENTORY_STACK: DrawerMenuItem = {
  id: StackId.INVENTORY,
  title: 'Inventory',
  icon: 'inventory',
  children: INVENTORY_NAVIGATORS,
  roles: ALL_ROLES,
};

const SALES_STACK: DrawerMenuItem = {
  id: StackId.SALES,
  title: 'Sales',
  icon: 'school',
  children: SALES_NAVIGATORS,
  roles: ALL_ROLES,
};

const EXPENSES_STACK: DrawerMenuItem = {
  id: StackId.EXPENSES,
  title: 'Expenses',
  icon: 'menu-book',
  children: EXPENSES_NAVIGATORS,
  roles: ALL_ROLES,
};

const INITIATE_STACK: DrawerMenuItem = {
  id: StackId.INITIATE,
  title: 'Directory',
  icon: 'next-week',
  children: INITIATE_NAVIGATORS,
  roles: ALL_ROLES,
};

const ACCOUNTING_STACK: DrawerMenuItem = {
  id: StackId.ACCOUNTING_STACK,
  title: 'Accounting',
  icon: 'assignment-ind',
  children: ACCOUNTING_NAVIGATORS,
  roles: ALL_ROLES,
};

const SETTINGS_STACK: DrawerMenuItem = {
  id: StackId.SETTINGS_STACK,
  title: 'Settings',
  icon: 'edit-document',
  children: SETTINGS_NAVIGATORS,
  roles: ALL_ROLES,
};

export const DEMO_NAVIGATORS: DrawerMenuItem[] = [
  {
    id: ScreenId.ICONS_DEMO,
    title: 'Icons',
    icon: 'image',
    component: DemoNavigator,
    roles: ALL_ROLES,
  },
  {
    id: ScreenId.BUTTONS_DEMO,
    title: 'Buttons',
    icon: 'radio-button-checked',
    component: DemoNavigator,
    roles: ALL_ROLES,
  },
  {
    id: ScreenId.HEADING_DEMO,
    title: 'Heading',
    icon: 'title',
    component: DemoNavigator,
    roles: ALL_ROLES,
  },
  {
    id: ScreenId.STATUS_BADGES_DEMO,
    title: 'Status Badges',
    icon: 'label',
    component: DemoNavigator,
    roles: ALL_ROLES,
  },
  {
    id: ScreenId.FORM_COMPONENTS_DEMO,
    title: 'Form Components',
    icon: 'edit',
    component: DemoNavigator,
    roles: ALL_ROLES,
  },
  {
    id: ScreenId.CARD_WITH_HEADER_DEMO,
    title: 'CardWithHeader',
    icon: 'view-card',
    component: DemoNavigator,
    roles: ALL_ROLES,
  },
  {
    id: ScreenId.TABS_DEMO,
    title: 'Tabs',
    icon: 'tab',
    component: DemoNavigator,
    roles: ALL_ROLES,
  },
  {
    id: ScreenId.TABLE_DEMO,
    title: 'Mobile Table',
    icon: 'table-chart',
    component: DemoNavigator,
    roles: ALL_ROLES,
  },
];

const DEMO_STACK: DrawerMenuItem = {
  id: StackId.DEMO_STACK,
  title: 'Component Demos',
  icon: 'palette',
  children: DEMO_NAVIGATORS,
  roles: ALL_ROLES,
};

export const ADMIN_DRAWER_CONFIG: DrawerMenuItem[] = [
  DASHBOARD_STACK,
  INVENTORY_STACK,
  SALES_STACK,
  EXPENSES_STACK,
  INITIATE_STACK,
  ACCOUNTING_STACK,
  SETTINGS_STACK,
  DEMO_STACK,
];

const ROLE_DRAWER_CONFIGS: Record<UserRoleValue, DrawerMenuItem[]> = {
  [UserRoleValue.STUDENT]: ADMIN_DRAWER_CONFIG,
  [UserRoleValue.HEAD]: [],
  [UserRoleValue.STAFF]: [],
  [UserRoleValue.ADMIN]: [],
  [UserRoleValue.TEACHER]: [],
};

export const getNavigationItemsByRole = (userRole: UserRole): DrawerMenuItem[] => {
  const menuItems: DrawerMenuItem[] = [];
  (ROLE_DRAWER_CONFIGS[userRole.value] || [])
    .filter(item => !item.hideInDrawer && item.roles?.includes(userRole.value))
    .forEach(item => {
      if (item.children) {
        const children = item.children.filter(
          child => !child.hideInDrawer && child.roles?.includes(userRole.value),
        );
        if (children.length) {
          menuItems.push({ ...item, children });
        }
        return;
      }
      menuItems.push(item);
    });
  return menuItems;
};
