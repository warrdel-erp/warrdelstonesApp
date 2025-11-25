import { capitalizeWords } from '../utils/CommonUtility.ts';

export enum UserRoleValue {
  'ADMIN',
  'HEAD',
  'STUDENT',
  'STAFF',
  'TEACHER',
}

export interface UserRole {
  value: UserRoleValue;
  id: string;
  label: string;
}

export const roleFromString = (role?: string): UserRole => {
  switch (role?.toUpperCase() ?? '') {
    case 'STUDENT':
      return {
        value: UserRoleValue.STUDENT,
        id: role ?? 'STUDENT',
        label: capitalizeWords(role),
      };
    case 'ADMIN':
      return {
        value: UserRoleValue.ADMIN,
        id: role ?? 'ADMIN',
        label: capitalizeWords(role),
      };
    case 'HEAD':
      return {
        value: UserRoleValue.HEAD,
        id: role ?? 'HEAD',
        label: capitalizeWords(role),
      };
    case 'TEACHER':
      return {
        value: UserRoleValue.TEACHER,
        id: role ?? 'TEACHER',
        label: capitalizeWords(role),
      };
    default:
      return {
        value: UserRoleValue.STAFF,
        id: role ?? 'STAFF',
        label: capitalizeWords(role),
      };
  }
};
