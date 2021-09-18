// aka User
export class Taster {
  id: number | null = null;
  name?: string;
  password?: string;
  photo?: string;

  constructor(data: any | null = null) {
    for (let key in data) {
      (<any>this)[key] = data[key];
    }
  }
}
