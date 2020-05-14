import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers';
import { logger } from 'redux-logger';

const store = configureStore({
    reducer: rootReducer,
    middleware: [
        logger
    ]
});

export { store };
// export type RootState = RState;
export type { RootState } from './reducers';