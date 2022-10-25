import { LIBRARY_TYPES } from 'src/shared/const';
import { CreateBehavior } from '../dto';

export const behaviorSayThank: CreateBehavior = {
  name: 'Say thank you',
  points: 10,
  showOnDevice: true,
  libraryType: LIBRARY_TYPES.ADULT,
  ordering: 0,
};
