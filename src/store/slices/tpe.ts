import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initTpe } from '../defaults';
import { TpeProperties, TpeAuth, TpeServer, TpePredictionModel } from '../types'

const tpeConfigSlice = createSlice({
    name: 'tpe',
    initialState: initTpe,
    reducers: {
        tpeUpdateAll: (state, action: PayloadAction<TpeProperties>) => {
            state = action.payload;
            return state;
        },
        tpeUpdateAuth: (state, action: PayloadAction<TpeAuth>) => {
            state.auth = action.payload;
            return state;
        },
        tpeUpdateServer: (state, action: PayloadAction<TpeServer>) => {
            state.server = action.payload;
            return state;
        },
        tpeAddModel: (state, action: PayloadAction<TpePredictionModel>) => {
            state.predictionModels.push(action.payload);
            return state;
        },
        tpeRemoveModel: (state, action: PayloadAction<string>) => {
            if (state.predictionModels.length === 0) return state;
            const idxSplice = state.predictionModels.map(pm => pm.predictionDefinition).indexOf(action.payload);
            state.predictionModels.splice(idxSplice, 1);
            return state;
        }
    }
});

export const { tpeUpdateAll, tpeUpdateAuth, tpeUpdateServer, tpeAddModel, tpeRemoveModel } = tpeConfigSlice.actions;

export default tpeConfigSlice.reducer;