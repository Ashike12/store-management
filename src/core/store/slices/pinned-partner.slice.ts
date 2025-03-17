import {createSlice} from '@reduxjs/toolkit';
import {RootState} from '../store';
import {IPartnerSearchResult} from '@features/partnerSearch/interfaces/partner-search-result.interface';

const namespace = 'pinnedPartner';
export interface IPinnedPartnersState {
  pinnedPartners: IPartnerSearchResult[];
}

const initialState: IPinnedPartnersState = {
  pinnedPartners: [],
};

const appPinnedPartnerSlice = createSlice({
  name: namespace,
  initialState,
  reducers: {
    pinNewPartner: (
      state,
      action: {type: string; payload: IPartnerSearchResult},
    ) => {
      const pinnedPartner = state.pinnedPartners.find(
        pinnedPartner => pinnedPartner.id === action.payload.id,
      );
      if (pinnedPartner) {
        return;
      }
      state.pinnedPartners = [...state.pinnedPartners, action.payload];
    },
    removePinnedPartner: (state, action: {type: string; payload: string}) => {
      state.pinnedPartners = state.pinnedPartners.filter(
        partner => partner.id !== action.payload,
      );
    },
    removeAllPinnedPartners: state => {
      state.pinnedPartners = [];
    },
  },
});
export const {pinNewPartner, removePinnedPartner, removeAllPinnedPartners} =
  appPinnedPartnerSlice.actions;

export const selectPinnedPartners = (state: RootState) =>
  state.persisted.pinnedPartner.pinnedPartners;

export const selectIsAnyPartnerPinned = (state: RootState) =>
  state.persisted.pinnedPartner.pinnedPartners.length > 0;

export const getPartnerMitgliedIdByPartnerId = (
  state: RootState,
  id: string,
) => {
  const selectedPartner = state.persisted.pinnedPartner.pinnedPartners.find(
    partner => partner.id === id,
  );
  return selectedPartner?.kvgMitglied?.mitgliedId;
};

export default appPinnedPartnerSlice.reducer;
