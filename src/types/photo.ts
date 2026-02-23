export interface PhotoViewModel {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  year: string;
  tags: string[];
  location: string;
  camera: string;
  lens: string;
  aperture: string;
  shutter: string;
  iso: string;
  focalLength: string;
  featured: boolean;
  thumbnail: {
    src: string;
    width: number;
    height: number;
  };
  full: {
    src: string;
    width: number;
    height: number;
  };
}
