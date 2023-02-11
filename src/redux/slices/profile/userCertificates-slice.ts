import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Types
import { CertificateType, profileCertificateState } from 'src/@types/sections/profile/userCertificate';
import { AudienceEnum, Certificate } from 'src/@types/sections/serverTypes';
import { RootState } from 'src/redux/store';

// ------------------------------

const initialState: profileCertificateState = {};

const slice = createSlice({
  name: 'userCertificate',
  initialState,
  reducers: {
    certificateUpdated(state, action: PayloadAction<CertificateType>) {
      state.certificate = { ...state.certificate, ...action.payload };
    },
    certificateCleared(state, action: PayloadAction<CertificateType>) {
      state.certificate = undefined;
    },
  },
});

export const userCertificateSelector = (state: RootState) => state.userCertificates.certificate;

// reducer
export default slice.reducer;

// Action
export const { certificateUpdated, certificateCleared } = slice.actions;
