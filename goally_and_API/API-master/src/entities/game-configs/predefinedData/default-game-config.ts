import { CreateGameConfigDto } from 'src/entities/game-configs/dto/CreateGameConfig.dto';
import { GAME_NAMES } from 'src/entities/game-configs/predefinedData/game-names';

export const defaultGameConfig: CreateGameConfigDto = {
  enablePlayLimit: true,
  startTime: '09:00 AM',
  endTime: '07:00 PM',
  duration: 600,
  clientId: null,
  maxPlayMins: 90,
  ptsFor15Mins: 50,
  enablePtsToPlay: true,
  games: GAME_NAMES,
};
