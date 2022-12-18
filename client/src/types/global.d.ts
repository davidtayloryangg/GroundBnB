export {};

declare global {
  type Review = {
    date: Date;
    rating: number;
    text: string;
    userId: string;
  };

  type Geolocation = {
    latitude: number;
    longitude: number;
  };
  type Address = {
    city: string;
    geolocation: Geolocation;
    street: string;
    zipcode: string;
    state: string;
    description: string;
  };

  type Listing = {
    listingId: string;
    ownerId: string;
    address: Address;
    numOfBookings: number;
    averageRating: number;
    reviews: Review[];
    price: number;
    imageUrls: string[];
    description: string;
  };

  type timestamp = {
    seconds: number;
    nanoseconds: number;
  };

  type Booking = {
    totalPrice: number;
    status: string;
    ownerId: string;
    numOfPeople: number;
    bookingId: string;
    listingId: string;
    bookerId: string;
    startTimestamp: timestamp;
    endTimestamp: timestamp;
  };
}
