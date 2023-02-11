import { GroupCategory, AudienceEnum } from '../serverTypes';

export interface GroupCategoryState {
  category?: GroupCategoryType;
}

export interface GroupCategoryType extends GroupCategory {
  audience?: AudienceEnum;
}
