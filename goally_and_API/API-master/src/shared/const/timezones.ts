import * as moment from 'moment-timezone';

export const timezones = moment.tz.names().map(timezone => {
  return {
    text: `(${timezone}), UTC ${moment.tz(timezone).format('Z')}`,
    value: timezone,
  };
});

export const defaultTimezone = 'America/Toronto';
