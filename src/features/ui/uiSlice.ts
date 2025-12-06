import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UIState } from '../../types/portfolio';

const initialState: UIState = {
  addTokenModalOpen: false,
  editingTokenId: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openAddTokenModal: (state) => {
      state.addTokenModalOpen = true;
    },
    closeAddTokenModal: (state) => {
      state.addTokenModalOpen = false;
    },
    setEditingTokenId: (state, action: PayloadAction<string | null>) => {
      state.editingTokenId = action.payload;
    },
  },
});

export const { openAddTokenModal, closeAddTokenModal, setEditingTokenId } =
  uiSlice.actions;

export const selectAddTokenModalOpen = (state: { ui: UIState }) =>
  state.ui.addTokenModalOpen;

export const selectEditingTokenId = (state: { ui: UIState }) =>
  state.ui.editingTokenId;

export default uiSlice.reducer;
