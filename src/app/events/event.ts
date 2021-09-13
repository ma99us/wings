export class Event {
  id: number | null = null;
  title?: string;
  place_id: number | null = null;
  date?: Date;
  portion?: string;
  price?: number;
  attendants_ids?: number[];
  reviews?: Review[];
  event_rating?: number;    // pre-calculated average rating of all reviews for the event. Updates on every review update.
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
