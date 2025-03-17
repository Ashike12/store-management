import {combineReducers} from 'redux';
import {
  appAuthReducer,
  appLanguageReducer,
  appPinnedPartnerSlice,
} from './slices';

const LocalReducer = combineReducers({
  language: appLanguageReducer,
  auth: appAuthReducer,
  pinnedPartner: appPinnedPartnerSlice,
});

export default LocalReducer;
