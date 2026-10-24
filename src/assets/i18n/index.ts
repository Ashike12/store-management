import * as common from './common';
import {enOrderFollowUp, bnOrderFollowUp, zhOrderFollowUp} from './orderFollowUp';

export const enTransLations = {
  ...common.enTranslations,
  ORDER_FOLLOW_UP: enOrderFollowUp,
};

export const bnTransLations = {
  ...common.bnTranslations,
  ORDER_FOLLOW_UP: bnOrderFollowUp,
};

// Untranslated console keys continue to use the configured English fallback.
export const zhTransLations = {ORDER_FOLLOW_UP: zhOrderFollowUp};
