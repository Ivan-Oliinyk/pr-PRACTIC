import { AacFolderNotifier } from './aac-folder.notifier';
import { AacWordNotifier } from './aac-word.notifier';
import { ActiveChecklistNotifier } from './active-checklist.notifier';
import { ActiveReminderNotifier } from './active-reminder.notifier';
import { ActiveRoutineNotifier } from './active-routine.notifier';
import { ActiveSleepModeNotifier } from './active-sleep-mode.notifier';
import { BalanceNotifier } from './balance.notifier';
import { BehaviorTrainingNotifier } from './behavior-training.notifier';
import { BehaviorNotifier } from './behavior.notifier';
import { ChecklistNotifier } from './checklist.notifier';
import { ClientNotifier } from './client.notifier';
import { GameConfigNotifier } from './game-config.notifier';
import { LogsNotifier } from './logs.notifier';
import { PuzzleNotifier } from './puzzle.notifier';
import { QuizletNotifier } from './quizlet.notifier';
import { ReminderNotifier } from './reminder.notifier';
import { RewardNotifier } from './reward.notifier';
import { RoutineNotifier } from './routine.notifier';
import { SafetyNotifier } from './safety.notifier';
import { SharedAssetNotifier } from './shared-assets.notifier';
import { SleepModeNotifier } from './sleep-mode.notifier';
import { SoundNotifier } from './sound.notifier';

export const notifiers = [
  BehaviorNotifier,
  RewardNotifier,
  RoutineNotifier,
  BalanceNotifier,
  QuizletNotifier,
  SharedAssetNotifier,
  ClientNotifier,
  ActiveRoutineNotifier,
  LogsNotifier,
  BehaviorTrainingNotifier,
  SoundNotifier,
  AacWordNotifier,
  AacFolderNotifier,
  SafetyNotifier,
  PuzzleNotifier,
  ReminderNotifier,
  ChecklistNotifier,
  ActiveChecklistNotifier,
  SleepModeNotifier,
  GameConfigNotifier,
  ActiveReminderNotifier,
  ActiveSleepModeNotifier,
];
