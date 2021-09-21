export class Review {
  id: number | null = null;
  event_id: number | null = null;
  author_id: number | null = null;
  comment?: string;
  review_rating?: number;    // readonly property, calculated average rating of all the categories of the Review. Updates on every category review update.
  place!: {
    parking?: number;
    ambiance?: number;
    service?: number;
    wait_time?: number;
    cleanliness?: number;
  };
  wings!: {
    moistness?: number;
    sauce?: number;
    taste?: number;
    satiety?: number;
  };
  sides!: {
    appetizer?: Dish;
    side?: Dish;
    drink?: Dish;
  };

  constructor(data: any | null = null) {
    this.place = {};
    this.wings = {};
    this.sides = {appetizer: new Dish(), side: new Dish(), drink: new Dish()};
    for (let key in data) {
      (<any>this)[key] = data[key];
    }
  }
}

export class Dish {
  name?: string;
  price?: number;
  rating?: number;
}
