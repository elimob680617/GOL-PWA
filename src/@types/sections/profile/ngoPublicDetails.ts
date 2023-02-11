import { AudienceEnum } from '../serverTypes';

export type PlacePayloadType = {
  id?: string;
  placeAudience?: AudienceEnum;
  description?: string;
  placeId?: string;
  address?: string;
  mainText?: string;
  lat?: any;
  lng?: any;
  secondaryText?: string;
  isChange?: boolean;
};
export type NGOPublicDetailsState = {
  place?: PlacePayloadType;
};

export type PlaceType = Pick<PlacePayloadType, 'description' | 'id' | 'placeAudience' | 'mainText' | 'secondaryText'>;
