import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import theReducer from './reducers';

const rootReducer = combineReducers({
  theReducer,
});

export const Store = createStore(rootReducer, applyMiddleware(thunk));
