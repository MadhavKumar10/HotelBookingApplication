export const  UserType = {
  _id: string,
  email: string,
  password: string,
  firstName: string,
  lastName: string,
}

export const  HotelType = {
  _id: string,
  userId: string,
  name: string,
  city: string,
  country: string,
  description: string,
  type: string,
  adultCount: number,
  childCount: number,
  facilities: [],
  pricePerNight: number,
  starRating: number,
  imageUrls: [],
  lastUpdated: Date,
  bookings: [],
}

export const  BookingType = {
  _id: string,
  userId: string,
  firstName: string,
  lastName: string,
  email: string,
  adultCount: number,
  childCount: number,
  checkIn: Date,
  checkOut: Date,
  totalCost: number,
}

export const  HotelSearchResponse = {
  data: [],
  pagination: {
    total: number,
    page: number,
    pages: number,
  },
}

export const  PaymentIntentResponse = {
  paymentIntentId: string,
  clientSecret: string,
  totalCost: number,
}
