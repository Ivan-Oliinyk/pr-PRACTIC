import { EventEmitter } from 'events';
import { Types } from 'mongoose';
import { StrictEventEmitter } from 'nest-emitter';
import { AacFolder } from 'src/entities/aac/aac-folders/schema/aac-folder.schema';
import { AacPlayedWord } from 'src/entities/aac/aac-played/schema/aac-played-word.schema';
import { AacWord } from 'src/entities/aac/aac-words/schema/aac-word.schema';
import {
  ACTION_TYPE,
  LOGS_TYPE,
} from 'src/entities/app-logs/schema/app-logs.schema';
import { BehaviorTraining } from 'src/entities/behavior-trainings/schema/behavior-training.schema';
import { Behavior } from 'src/entities/behavior/schema/behavior.schema';
import { Checklist } from 'src/entities/checklists/schema/checklist.schema';
import { Client } from 'src/entities/clients/schema/client.schema';
import { CompletedChecklist } from 'src/entities/completed-checklists/schema/completed-checklist.schema';
import { CompletedQuizlet } from 'src/entities/completed-quizlet/schema/completed-quizlet.schema';
import { CompletedReminder } from 'src/entities/completed-reminders/schema/completed-reminder.schema';
import { CompletedSleepMode } from 'src/entities/completed-sleep-mode/schema/completed-sleep-mode.schema';
import { CompletedTraining } from 'src/entities/completed-trainings/schema/completed-training.schema';
import { GameConfig } from 'src/entities/game-configs/schema/game-configs.schema';
import { PlayedRoutine } from 'src/entities/played-routine/schema/played-routine.schema';
import { Puzzles } from 'src/entities/puzzles/schema/puzzles.schema';
import { Quizlet } from 'src/entities/quizlet/schema/quizlet.schema';
import { RecordedBehavior } from 'src/entities/recorded-behaviors/schema/recorded-behavior.schema';
import { RedeemedReward } from 'src/entities/redeemed-rewards/schema/redeemed-reward.schema';
import { Reminder } from 'src/entities/reminders/schema/reminder.schema';
import { Reward } from 'src/entities/rewards/schema/reward.schema';
import { Routine } from 'src/entities/routines/schema/routine.schema';
import { SafetyFeature } from 'src/entities/safety-features/schema/safety-feature.schema';
import { SleepMode } from 'src/entities/sleep-mode/schema/sleep-mode.schema';
import { Sound } from 'src/entities/sounds/schema/sound.schema';

interface RoutineEvents {
  RoutineChildLibraryChanged: string;

  RoutineParentLibraryChanged: string;

  RoutineChildHistoryChanged: string;

  RoutineDeleted: Routine;
  RoutineCreated: Routine;
  RoutineCreatedForTheChild: Routine;
  RoutineUpdated: Routine;

  RoutineHistoryNewAdded: PlayedRoutine;
  RoutineHistoryEdited: PlayedRoutine;

  RoutineLibraryReordered: Routine;
}

interface RewardEvents {
  RewardChildLibraryChanged: string;

  RewardParentLibraryChanged: string;

  RewardChildHistoryChanged: string;

  RewardDeleted: Reward;
  RewardCreated: Reward;
  RewardCreatedForTheChild: Reward;
  RewardUpdated: Reward;

  RedeemedRewardCreated: RedeemedReward;
  RedeemedRewardRemoved: RedeemedReward;

  RewardLibraryReordered: Reward;
}

interface ReminderEvents {
  ReminderDeleted: Reminder;
  ReminderCreated: Reminder;
  ReminderCreatedForTheChild: Reminder;
  ReminderUpdated: Reminder;

  ReminderHistoryCreated: CompletedReminder;
  ReminderHistoryRemoved: CompletedReminder;

  ReminderReordered: Reminder;
}

interface ChecklistEvents {
  ChecklistDeleted: Checklist;
  ChecklistCreated: Checklist;
  ChecklistCreatedForTheChild: Checklist;
  ChecklistUpdated: Checklist;

  ChecklistHistoryCreated: CompletedChecklist;

  ChecklistReordered: Checklist;
}

interface BehaviorEvents {
  BehaviorChildLibraryChanged: string;

  BehaviorParentLibraryChanged: string;

  BehaviorChildHistoryChanged: string;

  BehaviorDeleted: Behavior;
  BehaviorCreated: Behavior;
  BehaviorCreatedForTheChild: Behavior;
  BehaviorUpdated: Behavior;
  BehaviorLibraryReordered: Behavior;
  RecordedBehaviorCreated: RecordedBehavior;
  RecordedBehaviorRemoved: RecordedBehavior;
}

interface AacEvents {
  AacWordCreated: AacWord;
  AacWordUpdated: AacWord;
  AacWordDeleted: AacWord;

  AacWordAddedForTheChild: AacWord;
  AacMultipleWordsAddedForTheChild: AacWord[];
  AacMultipleWordsUpdatedForTheChild: AacWord[];
  AacMultipleWordsDeletedForTheChild: AacWord[];
  AacWordModelForTheChild: AacWord;

  AacPlayedWordCreated: AacPlayedWord;

  AacFolderCreated: AacFolder;
  AacFolderUpdated: AacFolder;
  AacFolderDeleted: AacFolder;
  AacFolderCreatedForTheChild: AacFolder;
}

interface PuzzleEvents {
  PuzzleDeleted: Puzzles;
  PuzzleCreated: Puzzles;
  PuzzleUpdated: Puzzles;
  PuzzleCategoryDeleted: Puzzles[];
  PuzzleCategoryUpdated: Puzzles[];
}

interface BehaviorTrainingEvents {
  BehaviorTrainingDeleted: BehaviorTraining;
  BehaviorTrainingCreated: BehaviorTraining;
  BehaviorTrainingCreatedForTheChild: BehaviorTraining;
  BehaviorTrainingUpdated: BehaviorTraining;
  BehaviorTrainingLibraryReordered: BehaviorTraining;

  CompletedTrainingCreated: CompletedTraining;
  CompletedTrainingRemoved: CompletedTraining;
}

interface SoundEvents {
  SoundUpdated: Sound;
}

interface QuizletEvents {
  QuizletChildLibraryChanged: string;

  QuizletParentLibraryChanged: string;

  QuizletChildHistoryChanged: string;

  QuizletDeleted: Quizlet;
  QuizletCreated: Quizlet;
  QuizletCreatedForTheChild: Quizlet;
  QuizletUpdated: Quizlet;
  QuizletLibraryReordered: Quizlet;

  CompletedQuizletCreated: CompletedQuizlet;
  CompletedQuizletRemoved: CompletedQuizlet;
}
interface BalanceEvents {
  BalanceChanged: { newBalance: number; clientId: string };
}

interface SafetyEvents {
  SafetyCreated: SafetyFeature;
  SafetyUpdated: SafetyFeature;
}

interface ClientEvent {
  ClientChanged: { client: Types.ObjectId };
  DeviceConnectedToTheChild: { client: Client };
  WpClientChanged: Types.ObjectId;
}

interface AssetSharedEvents {
  AssetShared: string;
}
interface ActiveRoutineEvents {
  ActiveRoutineChanged: PlayedRoutine;
  ActiveRoutineChangedNotifyWebPortal: {
    routine: PlayedRoutine;
    clientId: Types.ObjectId;
    socketId?: string;
  };
  ActiveRoutineChangedNotifyDevice: {
    routine: PlayedRoutine;
    clientId: Types.ObjectId;
    socketId?: string;
  };
}
interface ActiveChecklistEvents {
  ActiveChecklistChanged: CompletedChecklist;
  ActiveChecklistChangedNotifyWebPortal: {
    checklist: CompletedChecklist;
    clientId: Types.ObjectId;
    socketId?: string;
  };
  ActiveChecklistChangedNotifyDevice: {
    checklist: CompletedChecklist;
    clientId: Types.ObjectId;
    socketId?: string;
  };
}

interface ActiveSleepModeEvents {
  ActiveSleepModeChanged: CompletedSleepMode;
  ActiveSleepModeChangedNotifyWebPortal: {
    sleepMode: CompletedSleepMode;
    clientId: Types.ObjectId;
    socketId?: string;
  };
  ActiveSleepModeChangedNotifyDevice: {
    sleepMode: CompletedSleepMode;
    clientId: Types.ObjectId;
    socketId?: string;
  };
}
interface SleepModeEvents {
  SleepModeUpdated: SleepMode;
  SleepModeCreated: SleepMode;

  SleepModeHistoryCreated: CompletedSleepMode;
}
interface LogsEvent {
  CreateLog: {
    action: ACTION_TYPE;
    entity: LOGS_TYPE;
    user: Types.ObjectId;
    client: Types.ObjectId | null;
    meta: any;
  };
  SyncUserAppLogs: string;
}

interface GameEvents {
  GameConfigUpdated: GameConfig;
  GameConfigCreated: GameConfig;
}

interface AppEvents
  extends RoutineEvents,
    RewardEvents,
    BehaviorEvents,
    BalanceEvents,
    AssetSharedEvents,
    QuizletEvents,
    ActiveRoutineEvents,
    LogsEvent,
    BehaviorTrainingEvents,
    SoundEvents,
    SafetyEvents,
    AacEvents,
    PuzzleEvents,
    ReminderEvents,
    ChecklistEvents,
    ActiveChecklistEvents,
    SleepModeEvents,
    ActiveSleepModeEvents,
    GameEvents,
    ActiveReminderEvents,
    ClientEvent {
  notification: string;
  newRequest: (req: Express.Request) => void;
}

interface ActiveReminderEvents {
  ActiveReminderChanged: Reminder;
  ActiveReminderChangedNotifyWebPortal: {
    reminder: Reminder;
    clientId: Types.ObjectId;
    socketId?: string;
  };
  ActiveReminderChangedNotifyDevice: {
    reminder: Reminder;
    clientId: Types.ObjectId;
    socketId?: string;
  };
}
export type GoallyEventEmitter = StrictEventEmitter<EventEmitter, AppEvents>;
