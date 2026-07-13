export type Property = {
  id: string;
  apiId?: number;
  slug: string;
  title: string;
  location: string;
  description: string;
  type: string;
  category: string;
  pricePerNight: number;
  cleaningFee: number;
  serviceFee: number;
  rating: number;
  reviews: number;
  guests: number;
  bedrooms: number;
  bathrooms: number;
  host: {
    name: string;
    avatar: string;
    superhost: boolean;
    responseTime: string;
  };
  coordinates: {
    lat: number;
    lng: number;
  };
  images: string[];
  videos?: string[];
  amenities: string[];
  featured?: boolean;
};

export type Destination = {
  city: string;
  country: string;
  image: string;
  properties: number;
};

export type Experience = {
  title: string;
  location: string;
  image: string;
  price: number;
};
