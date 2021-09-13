export class Place {
  id: number | null = null;
  title?: string;
  rating?: number;
  price?: string;
  type?: string;
  address?: string;
  thumbnail?: string;
  review?: string;
  gps_coordinates?: {
    latitude: number;
    longitude: number;
  }
}
