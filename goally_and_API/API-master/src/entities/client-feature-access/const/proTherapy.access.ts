import { CreateClientFeatureAccessDto } from '../dto/create-client-feature.dto';

export const ProFeatures: CreateClientFeatureAccessDto = {
  awardWinningVisualScheduler: {
    awardWinningVisualScheduler: true,
    dedicatedMobileAppForLearners: true,
    winPointsForRoutineCompletion: true,
    startTimeAutomation: true,
    uploadCustomImagesForVisualAids: true,
    uploadCustomVideoToModelBehavior: true,
    uploadAudioRecordingsForAuditoryPrompts: true,
  },
  tokenEconomy: {
    giveChildPointsForAnything: true,
    behaviorTrackerIntegration: true,
    puzzlesForLearnersToComplete: true,
    beautifulPuzzles: true,
    createCustomRewardsToEarn: true,
  },
  dedicatedVisualTimer: {
    eliminateExpensiveMechanicalTimers: true,
    timersLonger: true,
  },
  homeBehaviorTracker: {
    streamlinedParentRecording: true,
    promptingHierarchyForParents: true,
    quizletsToQueryAnyKnowledge: true,
    reportingSuiteToTrackProgress: true,
  },
  behaviorSkillsTraining: {
    customSocialStoryCreation: true,
    gamifiedFeedback: true,
    scriptRehearsalsForHome: true,
  },
};
