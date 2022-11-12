import * as moment from 'moment';

export const EVENT_START_TIME = "18:00";    // 6pm by default

export class Event {
  id: number | null = null;
  title?: string;           // readonly property, calculated based on event's Place and Date
  place_id: number | string | null = null;
  date?: string;
  time?: string;
  type?: string;
  portion?: number;
  price?: number;
  attendants_ids?: number[];
  event_rating?: number;    // readonly property, calculated average rating of all reviews for the event. Updates on every review update.
  notifications?: number;   // email notifications count have been sent

  constructor(data: any | null = null) {
    for (let key in data) {
      (<any>this)[key] = data[key];
    }
  }

  public get eventMoment(): moment.Moment | undefined {
    if (this.date && typeof this.date === 'string') {
      const momDate = moment(this.date, "YYYY-MM-DD");
      return momDate;
    } else {
      return undefined;
    }
  }

  public get eventDate(): Date | undefined {
    const momDate = this.eventMoment;
    return momDate ? momDate.toDate() : momDate;
  }

  public get startDateTimeJsonString(): string | undefined {
    const momDate = this.eventMoment;
    if (!momDate) {
      return momDate
    }
    const eventTime = moment(this.time || EVENT_START_TIME, 'HH:mm');
    // event start time
    momDate.set('hours', eventTime.get('hours'));
    momDate.set('minutes', eventTime.get('minutes'));
    // return momDate.toISOString();
    return momDate.utc().format('YYYY-MM-DDTHH:mm:ss');
  }

  public get endDateTimeJsonString(): string | undefined {
    const momDate = this.eventMoment;
    if (!momDate) {
      return momDate
    }
    const eventTime = moment(this.time || EVENT_START_TIME, 'HH:mm');
    // event end time. Assume 2 hour event duration.
    eventTime.add(2, 'hours');
    momDate.set('hours', eventTime.get('hours'));
    momDate.set('minutes', eventTime.get('minutes'));
    // return momDate.toISOString();
    return momDate.utc().format('YYYY-MM-DDTHH:mm:ss');
  }

  public get eventDateStr(): string | undefined {
    const momDate = this.eventMoment;
    return momDate ? momDate.format('MMMM Do, YYYY') : momDate;
  }

  public get eventDateTimeStr(): string | undefined {
    const momDate = this.eventMoment;
    if (!momDate) {
      return momDate
    }
    const eventTime = moment(this.time || EVENT_START_TIME, 'HH:mm');
    // event start time
    momDate.set('hours', eventTime.get('hours'));
    momDate.set('minutes', eventTime.get('minutes'));
    return momDate.format('MMMM Do, YYYY, HH:mm');
  }

  public get eventFullTitleStr(): string {
    return `${this.eventDateTimeStr || '-NEVER-'} @ ${this.title || '-NOWHERE-'}`;
  }

}
