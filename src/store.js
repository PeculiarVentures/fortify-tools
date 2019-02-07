import createSagaMiddleware from 'redux-saga';
import { createStore, applyMiddleware, compose } from 'redux';
import { RoutingController } from './controllers';
import { AppStateModel } from './state';
import RootReducer from './reducers';
import { ItemMiddleware, ProviderMiddleware, DebugMiddleware } from './middlewares';
import rootSaga from './sagas';

const sagaMiddleware = createSagaMiddleware();
const composeEnhancers = compose;

export default createStore(RootReducer, new AppStateModel(), composeEnhancers(applyMiddleware(
  DebugMiddleware,
  ProviderMiddleware,
  ItemMiddleware,
  RoutingController.middleware(),
  sagaMiddleware,
)));

sagaMiddleware.run(rootSaga);
