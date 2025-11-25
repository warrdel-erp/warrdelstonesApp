import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { services } from '../../network';
import { createThunkFromApiResult } from '../utils/thunkHelpers.ts';
import {
  BasePageRequest,
  Bin,
  CustomersAmounts,
  GeneralData,
  Location,
  OpenPos,
  VendorsAmounts,
} from '../../types/CommonTypes.ts';
import { InventoryResponse } from '../../types/InventoryTypes.ts';
import { RootState } from '../index.ts';
import { ClientUsers } from '../../network/services/AuthService.ts';
import { FromToDateFilter } from '../../network/services/CommonService.ts';
import moment from 'moment';
import { DropdownOption } from '../../components/ui/Dropdown.tsx';
import { DATE_FILTERS } from '../../screens/ConstantData.ts';

export interface AppState {
  isInitialized: boolean;
  selectedLocation?: Location;
  allLocations: Location[];
  inventory?: InventoryResponse;
  generalData?: GeneralData;
  openPOs?: OpenPos;
  openSOs?: OpenPos;
  notes?: any;
  customersAmounts?: CustomersAmounts;
  vendorsAmounts?: VendorsAmounts;
  bins: Bin[];
  clientUsers: ClientUsers;
  currentDashboardFilter: DropdownOption;
  salesAmount?: CustomersAmounts;
  purchaseAmount?: CustomersAmounts;
}

const initialState: AppState = {
  isInitialized: false,
  selectedLocation: undefined,
  inventory: undefined,
  allLocations: [],
  generalData: undefined,
  openPOs: undefined,
  notes: undefined,
  customersAmounts: undefined,
  vendorsAmounts: undefined,
  bins: [],
  clientUsers: [],
  currentDashboardFilter: DATE_FILTERS[0],
};

export const initializeApp = createAsyncThunk(
  'app/initialize',
  async (_, { dispatch, getState }) => {
    const state = getState() as RootState;
    if (state.app.isInitialized) return;
    dispatch(getAllLocations());
    dispatch(getGeneralData());
    dispatch(setInitialized());
  },
);
export const getAllLocations = createAsyncThunk(
  'app/getAllLocations',
  async (_, { rejectWithValue }) => {
    return createThunkFromApiResult(() => services.common.getAllLocations(), rejectWithValue);
  },
);

export const getGeneralData = createAsyncThunk(
  'app/getGeneralData',
  async (_, { rejectWithValue }) => {
    return createThunkFromApiResult(() => services.common.getGeneralData(), rejectWithValue);
  },
);

export const getOpenPOs = createAsyncThunk('app/getOpenPOs', async (_, { rejectWithValue }) => {
  return createThunkFromApiResult(() => services.common.getOpenPOs(), rejectWithValue);
});

export const getOpenSOs = createAsyncThunk('app/getOpenSOs', async (_, { rejectWithValue }) => {
  return createThunkFromApiResult(() => services.common.getOpenSOs(), rejectWithValue);
});

export const getAllNotes = createAsyncThunk(
  'app/getAllNotes',
  async (basePageRequest: BasePageRequest, { rejectWithValue }) => {
    return createThunkFromApiResult(
      () => services.common.getAllNotes(basePageRequest),
      rejectWithValue,
    );
  },
);

export const getCustomersAmounts = createAsyncThunk(
  'app/getCustomersAmounts',
  async (_, { rejectWithValue }) => {
    return createThunkFromApiResult(() => services.common.getCustomerAmounts(), rejectWithValue);
  },
);

export const getVendorsAmounts = createAsyncThunk(
  'app/getVendorsAmounts',
  async (_, { rejectWithValue }) => {
    return createThunkFromApiResult(() => services.common.getVendorsAmounts(), rejectWithValue);
  },
);

export const getSalesAmount = createAsyncThunk(
  'app/getSalesAmount',
  async (filter: FromToDateFilter, { rejectWithValue }) => {
    return createThunkFromApiResult(() => services.common.getSalesAmount(filter), rejectWithValue);
  },
);

export const getPurchaseAmount = createAsyncThunk(
  'app/getPurchaseAmount',
  async (filter: FromToDateFilter, { rejectWithValue }) => {
    return createThunkFromApiResult(
      () => services.common.getPurchaseAmount(filter),
      rejectWithValue,
    );
  },
);

export const getBins = createAsyncThunk('app/getBins', async (_, { rejectWithValue, getState }) => {
  const locationId = (getState() as RootState)?.app?.selectedLocation?.id ?? 1;

  return createThunkFromApiResult(() => services.common.getBins(locationId), rejectWithValue);
});

export const getAllClientUsers = createAsyncThunk(
  'app/getAllClientUsers',
  async (_, { rejectWithValue }) => {
    return createThunkFromApiResult(() => services.common.getClientUsers(), rejectWithValue);
  },
);

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setSelectedLocation: (state, action: PayloadAction<Location | undefined>) => {
      state.selectedLocation = action.payload;
    },
    setDashboardFilter: (state, action: PayloadAction<DropdownOption>) => {
      state.currentDashboardFilter = action.payload;
    },
    setInitialized: state => {
      state.isInitialized = true;
    },
  },
  extraReducers: builder => {
    builder.addCase(getAllLocations.fulfilled, (state, action) => {
      state.allLocations = action.payload?.data ?? [];
    });
    builder.addCase(getGeneralData.fulfilled, (state, action) => {
      state.generalData = action.payload?.data;
    });
    builder.addCase(getOpenPOs.fulfilled, (state, action) => {
      state.openPOs = action.payload?.data;
    });
    builder.addCase(getAllNotes.fulfilled, (state, action) => {
      state.notes = action.payload?.data;
    });
    builder.addCase(getCustomersAmounts.fulfilled, (state, action) => {
      state.customersAmounts = action.payload?.data;
    });
    builder.addCase(getVendorsAmounts.fulfilled, (state, action) => {
      state.vendorsAmounts = action.payload?.data;
    });
    builder.addCase(getBins.fulfilled, (state, action) => {
      state.bins = action.payload?.data ?? [];
    });
    builder.addCase(getAllClientUsers.fulfilled, (state, action) => {
      state.clientUsers = action.payload?.data ?? [];
    });
    builder.addCase(getOpenSOs.fulfilled, (state, action) => {
      state.openSOs = action.payload?.data;
    });
    builder.addCase(getSalesAmount.fulfilled, (state, action) => {
      state.salesAmount = action.payload?.data;
    });
    builder.addCase(getPurchaseAmount.fulfilled, (state, action) => {
      state.purchaseAmount = action.payload?.data;
    });
  },
});

export const { setSelectedLocation, setDashboardFilter, setInitialized } = appSlice.actions;

export default appSlice.reducer;
