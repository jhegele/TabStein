import { combineReducers } from '@reduxjs/toolkit';
import path from './slices/path';
import tabpy from './slices/tabpy';
import tpe from './slices/tpe';
import setup from './slices/setup';

const rootReducer = combineReducers({
    path,
    tabpy,
    tpe,
    setup
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;