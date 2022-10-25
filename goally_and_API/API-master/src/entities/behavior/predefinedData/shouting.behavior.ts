import { LIBRARY_TYPES } from 'src/shared/const';
import { CreateBehavior } from '../dto';

export const behaviorShouting: CreateBehavior = {
  name: 'Shouting',
  points: -10,
  showOnDevice: true,
  libraryType: LIBRARY_TYPES.ADULT,
  ordering: 3,
};
