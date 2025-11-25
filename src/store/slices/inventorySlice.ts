import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { services } from '../../network';
import { createThunkFromApiResult } from '../utils/thunkHelpers.ts';
import { InventoryResponse } from '../../types/InventoryTypes.ts';
import { GetInventoryRequest } from '../../network/services/InventoryService.ts';
export interface InventoryState {
  loading: boolean;
  error?: string;
  inventory?: InventoryResponse
}

const initialState: InventoryState = {
  loading: false,
  error: undefined,
  inventory: undefined,
};

export const getInventory = createAsyncThunk(
  'app/getInventory',
  async (request: GetInventoryRequest, { rejectWithValue }) => {
    return createThunkFromApiResult(
      () => services.inventory.getInventory(request),
      rejectWithValue,
    );
  },
);

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getInventory.fulfilled, (state, action) => {
      state.inventory = action.payload;
      state.loading = false;
      state.error = undefined;
    });
    builder.addCase(getInventory.pending, (state, action) => {
      state.inventory = undefined;
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(getInventory.rejected, (state, action) => {
      state.inventory = undefined;
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

export const {  } = inventorySlice.actions;

export default inventorySlice.reducer;
