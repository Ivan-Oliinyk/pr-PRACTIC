import { LIBRARY_TYPES } from 'src/shared/const';
import { CreateReward } from '../dto';

export const rewardKarate: CreateReward = {
  name: 'Karate lesson',
  points: 1000,
  showOnDevice: true,
  allowRedeem: true,
  libraryType: LIBRARY_TYPES.ADULT,
  clientId: null,
  imgURL: 'https://goally-files.s3.amazonaws.com/predefinedRewards/Karate.jpg',
  assetSetting: false,
  ordering: 2,
  isVisibleToAudience: true,
};
