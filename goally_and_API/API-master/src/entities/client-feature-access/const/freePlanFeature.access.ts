import { CreateClientFeatureAccessDto } from '../dto/create-client-feature.dto';

export const FreeFeatures: CreateClientFeatureAccessDto = {
  awardWinningVisualScheduler: {
    awardWinningVisualScheduler: true,
    dedicatedMobileAppForLearners: true,
    winPointsForRoutineCompletion: true,
    startTimeAutomation: false,
    uploadCustomImagesForVisualAids: false,
    uploadCustomVideoToModelBehavior: false,
    uploadAudioRecordingsForAuditoryPrompts: false,
  },
  tokenEconomy: {
    giveChildPointsForAnything: true,
    behaviorTrackerIntegration: true,
    puzzlesForLearnersToComplete: true,
    beautifulPuzzles: false,
    createCustomRewardsToEarn: true,
  },
  dedicatedVisualTimer: {
    eliminateExpensiveMechanicalTimers: true,
    timersLonger: false,
  },
  homeBehaviorTracker: {
    streamlinedParentRecording: false,
    promptingHierarchyForParents: false,
    quizletsToQueryAnyKnowledge: false,
    reportingSuiteToTrackProgress: true,
  },
  behaviorSkillsTraining: {
    customSocialStoryCreation: false,
    gamifiedFeedback: false,
    scriptRehearsalsForHome: false,
  },
};
