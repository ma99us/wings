import {Review} from "../reviews/review";

export class Event {
  id: number | null = null;
  title?: string;           // readonly property, calculated based on event's Place and Date
  place_id: number | string | null = null;
  date?: string;
  type?: string;
  portion?: number;
  price?: number;
  attendants_ids?: number[];
  event_rating?: number;    // readonly property, calculated average rating of all reviews for the event. Updates on every review update.

  constructor(data: any | null = null){
    for (let key in data) { (<any>this)[key] = data[key]; }
  }

  public getEventDate(): Date | undefined {
    return (typeof this.date === 'string') ? new Date(this.date) : this.date;
  }
}
