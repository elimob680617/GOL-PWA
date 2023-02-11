import { NumberRange, AudienceEnum } from '../serverTypes';

export interface NgoSizeState {
  numberRange?: NgoSizeType;
}

export interface NgoSizeType extends NumberRange {
  audience?: AudienceEnum;
  isChange?: boolean;
}
