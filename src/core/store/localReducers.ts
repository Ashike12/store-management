import {combineReducers} from 'redux';
import {appLanguageReducer, authReducer} from './slices';

const LocalReducer = combineReducers({
  language: appLanguageReducer,
  auth: authReducer,
});

export default LocalReducer;
