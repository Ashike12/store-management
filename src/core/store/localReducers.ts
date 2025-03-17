import {combineReducers} from 'redux';
import {appLanguageReducer} from './slices';

const LocalReducer = combineReducers({
  language: appLanguageReducer,
});

export default LocalReducer;
