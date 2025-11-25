import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './index';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useAppState = () => {
  return useAppSelector(state => state.app);
};

export const useInventory = () => {
  return useAppSelector(state => state.inventory);
};

export const useAuthState = () => {
  return useAppSelector(state => state.auth);
};
