import { useCallback, useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks.ts';
import { Location } from '../types/CommonTypes.ts';
import {
  getAllLocations,
  getAllNotes,
  getBins,
  getCustomersAmounts,
  getGeneralData,
  getOpenPOs,
  getOpenSOs,
  getPurchaseAmount,
  getSalesAmount,
  getVendorsAmounts,
  initializeApp,
  setDashboardFilter,
  setSelectedLocation,
} from '../store/slices/appSlice.ts';
import { FromToDateFilter } from '../network/services/CommonService.ts';
import moment from 'moment';
import { DropdownOption } from '../components/ui/Dropdown.tsx';

export const useAppActions = () => {
  const dispatch = useAppDispatch();
  const authUserState = useAppSelector(state => state.auth);
  const appState = useAppSelector(state => state.app);

  useEffect(() => {
    refreshMainData();
  }, [appState.selectedLocation, appState.currentDashboardFilter]);

  useEffect(() => {
    if (authUserState?.loginUserDetail && !appState.isInitialized) {
      dispatch(initializeApp());
    }
  }, [authUserState.loginUserDetail, appState.isInitialized, dispatch]);

  useEffect(() => {
    if (appState.allLocations.length > 1 && !appState.selectedLocation) {
      const defaultLocation = appState.allLocations.find(
        loc => loc.id === authUserState.loginUserDetail?.defaultLocationId,
      );
      setLocation(defaultLocation ?? appState.allLocations[0]);
    }
  }, [appState.allLocations, appState.selectedLocation]);

  const refreshMainData = useCallback(async () => {
    if (!appState.selectedLocation) return;
    const filter: FromToDateFilter = {
      fromDate: moment()
        .subtract(appState.currentDashboardFilter.value as number, 'days')
        .format('YYYY-MM-DD'),
      toDate: moment().format('YYYY-MM-DD'),
    };
    dispatch(getBins());
    dispatch(getAllNotes({ page: 1, limit: 500 }));
    dispatch(getOpenPOs());
    dispatch(getCustomersAmounts());
    dispatch(getVendorsAmounts());
    dispatch(getOpenSOs());
    dispatch(getSalesAmount(filter));
    dispatch(getPurchaseAmount(filter));
  }, [dispatch, appState.selectedLocation, appState.currentDashboardFilter]);

  const setLocation = (location?: Location) => {
    dispatch(setSelectedLocation(location));
  };

  const setDateFilter = (dateFilter: DropdownOption) => {
    dispatch(setDashboardFilter(dateFilter));
  };

  return {
    setLocation,
    setDateFilter,
    refreshMainData,
  };
};
