import { CreateSoundDto } from '../dto/CreateSound';
import { Audio } from '../schema/sound.schema';
import { behaviorSound } from './behavior-sound';
import { generalNewSound, generalSound } from './general-sound';
import { puzzleSound } from './puzzle-sound';
import { rewardSound } from './reward-sound';
import { timerSound } from './timer-sound';
import { visualSchedularSound } from './visual-schedule-sound';

export const defaultSound: CreateSoundDto = {
  general: generalSound,
  generalNew: generalNewSound,
  visualScdedule: visualSchedularSound,
  reward: rewardSound,
  behavior: behaviorSound,
  timer: timerSound,
  puzzle: puzzleSound,
};

export const newSounds: Audio[] = [
  {
    name: 'Announcement',
    url:
      'https://goally-files.s3.amazonaws.com/predefinedSounds/announcement.mp3',
    isSelected: false,
  },
  {
    name: 'Big Applause',
    url:
      'https://goally-files.s3.amazonaws.com/predefinedSounds/big_applause.mp3',
    isSelected: false,
  },
  {
    name: 'Orchestra',
    url: 'https://goally-files.s3.amazonaws.com/predefinedSounds/orchestra.mp3',
    isSelected: false,
  },
  {
    name: 'Piano',
    url: 'https://goally-files.s3.amazonaws.com/predefinedSounds/piano.mp3',
    isSelected: false,
  },
  {
    name: 'Playground',
    url:
      'https://goally-files.s3.amazonaws.com/predefinedSounds/playground.mp3',
    isSelected: false,
  },
  {
    name: 'Trumpet',
    url: 'https://goally-files.s3.amazonaws.com/predefinedSounds/trumpet.mp3',
    isSelected: false,
  },
  {
    name: 'Ukelele',
    url: 'https://goally-files.s3.amazonaws.com/predefinedSounds/ukelele.mp3',
    isSelected: false,
  },
  {
    name: 'Vibraphone',
    url:
      'https://goally-files.s3.amazonaws.com/predefinedSounds/vibraphone.mp3',
    isSelected: false,
  },
  {
    name: 'Xylophone',
    url: 'https://goally-files.s3.amazonaws.com/predefinedSounds/xylophone.mp3',
    isSelected: false,
  },
];
