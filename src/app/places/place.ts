export class Place {
  id: number | null = null;
  title: string | null = null;
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
