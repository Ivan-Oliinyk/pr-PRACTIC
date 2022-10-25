import * as moment from 'moment';

export class DateTimeHelper {
  static isExpired(date, diff: number, unit: moment.unitOfTime.Diff) {
    const momentDate = moment(date);
    const now = moment();
    // now.add(diff * 2, unit);
    // console.log(momentDate.diff(now, unit));
    console.log(diff > momentDate.diff(now, unit));
    return now.diff(momentDate, unit) > diff;
  }
}
