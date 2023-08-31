import { applyMiddleware, compose, createStore } from 'redux';

import { rootMiddleware, sagaMiddleware } from './rootMiddleware';
import rootReducer from './rootReducer';
import rootSaga from './rootSaga';

import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// REDUX TOOLS

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const persistConfig = {
  key: 'root',
  storage,
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

// export const store = createStore(persistedReducer,applyMiddleware(...rootMiddleware));
export const store = createStore(persistedReducer, compose(composeEnhancers(applyMiddleware(...rootMiddleware))));
sagaMiddleware.run(rootSaga);

export const persistor = persistStore(store);
