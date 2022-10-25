export interface OldRoutineType {
  _id: string;
  title: string;
  schedule: string;
  advschedule: Advschedule[];
  hardstop: number;
  starttime: string;
  endtime: string;
  icon: string;
  userId: string;
  submitted: string;
  activityCount: number;
  rank: number;
  isDeleted: boolean;
  lastCompleted?: any;
  state: string;
  lastCompletedTimeStamp?: any;
  lastSkippedTimestamp?: any;
  lastSkipped?: any;
  color: string;
  createAt: string;
  points: number;
}

export interface Advschedule {
  is_checked: boolean;
  starttime: string;
  endtime: string;
}
