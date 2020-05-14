import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initSetup } from '../defaults';
import { SetupProperties } from '../types'

const setupConfigSlice = createSlice({
    name: 'setup',
    initialState: initSetup,
    reducers: {
        setupUpdate: (state, action: PayloadAction<SetupProperties>) => {
            return action.payload;
        }
    }
})

export const { setupUpdate } = setupConfigSlice.actions;

export default setupConfigSlice.reducer;