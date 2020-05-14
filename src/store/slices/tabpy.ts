import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initTabpy } from '../defaults';
import { TabpyOptions } from '../types'

const tabpyConfigSlice = createSlice({
    name: 'tabpy',
    initialState: initTabpy,
    reducers: {
        tabpyUpdateOptions: (state, action: PayloadAction<TabpyOptions>) => {
            state.options = action.payload;
            return state;
        },
        tabpyResetToDefaults: (state, action) => {
            return initTabpy;
        }
    }
});

export const { tabpyUpdateOptions, tabpyResetToDefaults } = tabpyConfigSlice.actions;

export default tabpyConfigSlice.reducer;