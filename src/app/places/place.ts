export class Place {
  id: number | string | null = null;
  title?: string;
  rating?: number;
  reviews?: number;
  price?: string;
  type?: string;
  address?: string;
  thumbnail?: string;
  review?: string;
  gps_coordinates?: {
    latitude: number;
    longitude: number;
  };

  constructor(data: any | null = null){
    for (let key in data) { (<any>this)[key] = data[key]; }
  }

  get adjustedRating() : number {
    return (this.reviews && this.rating && this.reviews >= 5) ? this.rating : 0;
  }
}
