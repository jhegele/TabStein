import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initPath } from '../defaults';
import { PathProperties } from '../types'

const pathConfigSlice = createSlice({
    name: 'path',
    initialState: initPath,
    reducers: {
        pathUpdate: (state, action: PayloadAction<PathProperties>) => {
            return action.payload;
        }
    }
})

export const { pathUpdate } = pathConfigSlice.actions;

export default pathConfigSlice.reducer;