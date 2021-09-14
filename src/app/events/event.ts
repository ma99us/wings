export class Event {
  id: number | null = null;
  title?: string;
  place_id: number | string | null = null;
  date?: string;
  portion?: string;
  price?: number;
  attendants_ids?: number[];
  reviews?: Review[];
  event_rating?: number;    // pre-calculated average rating of all reviews for the event. Updates on every review update.

  constructor(data: any | null = null){
    for (let key in data) { (<any>this)[key] = data[key]; }
  }

  public getEventDate(): Date | undefined {
    return (typeof this.date === 'string') ? new Date(this.date) : this.date;
  }
}

export class Review {
  author_id?: number;
  comment?: string;
  parking?: number;
  ambience?: number;
  wings_moistness?: number;
  wings_souce?: number;
  wings_taste?: number;
  side_dish?: Dish;
  drink_pairing?: Dish;
}

export class Dish {
  name?: string;
  price?: number;
  rating?: number;
}
