// aka User
export class Taster {
  id: number | null = null;
  name?: string;
  password?: string;
  photo?: string;
  email?: string;
  notifyMessages?: boolean = true;
  notifyEvents?: boolean = true;
  notifyReviews?: boolean = true;

  constructor(data: any | null = null) {
    for (let key in data) {
      (<any>this)[key] = data[key];
    }
  }
}
