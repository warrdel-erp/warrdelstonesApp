import { TodoItem, WeekDay } from '../types/CommonTypes.ts';
import { DropdownOption } from '../components/ui/Dropdown.tsx';
import theme from '../theme';

export const WEEKDAYS: WeekDay[] = [
  { key: 'monday', title: 'Monday', isWeekend: false },
  { key: 'tuesday', title: 'Tuesday', isWeekend: false },
  { key: 'wednesday', title: 'Wednesday', isWeekend: false },
  { key: 'thursday', title: 'Thursday', isWeekend: false },
  { key: 'friday', title: 'Friday', isWeekend: false },
  { key: 'saturday', title: 'Saturday', isWeekend: true },
  { key: 'sunday', title: 'Sunday', isWeekend: true },
];

export const DATE_FILTERS: DropdownOption[] = [
  { label: 'Last 7 Days', id: 1, value: 7 },
  { label: 'Last 28 Days', id: 2, value: 30 },
  { label: 'Last 90 Days', id: 3, value: 90 },
  { label: 'Current Year', id: 4, value: 365 },
  { label: 'Last 3 Months', value: 5, id: 90 },
];
export const TODO_LIST: TodoItem[] = [
  {
    id: 1,
    title: 'Complete React Native Project',
    description: 'Finish the development of the React Native application by end of the week.',
    dueDate: '2025-09-24',
    status: 'Pending',
  },
  {
    id: 2,
    title: 'Grocery Shopping',
    description: 'Buy groceries for the week including fruits, vegetables, and dairy products.',
    dueDate: '2025-09-22',
    status: 'In Progress',
  },
  {
    id: 3,
    title: 'Workout Session',
    description: 'Attend the scheduled workout session at the gym.',
    dueDate: '2025-10-03',
    status: 'Done',
  },
  {
    id: 4,
    title: 'Read a Book',
    description: 'Finish reading the current book and start a new one.',
    dueDate: undefined,
    status: 'Done',
  },
];
