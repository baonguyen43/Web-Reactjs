import createSagaMiddleware from "redux-saga";

const sagaMiddleware = createSagaMiddleware();
const rootMiddleware = [sagaMiddleware];

export { rootMiddleware, sagaMiddleware };
