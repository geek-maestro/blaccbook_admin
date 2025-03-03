export type IBusiness = {
    id?: string,
    createdAt?: string,
    name: string,
    email: string,
    featuredImage: string,
    categories?: string[],
    images?: string[],
    website?: string,
    contact: IContact,
    description?: string,
    features?: string[],
    isBanned?: boolean,
    address?: string,
    isEcommerce?: boolean, // CAN YOU BUY FROM THEM ONLINE
    isBookable: boolean, // CAN YOU MAKE A BOOKING OR RESERVATION
    hasMenu: boolean, // IF IT HAS A FOOD MENU
    bookableDetails?: BookableDetails,
    rating?: number,
    products?: IProduct[],
}

export type IContact = {
    telephone: string,
    countryCode: string,
    country: string,
    state: string,
    city: string,
    street: string,
    mapLocation: MapLocation
}

export type IProduct = {
    name: string,
    price: number,
    image: string
}

export type MapLocation = {
    lat: string;
	lng: string;
	staticMapUri: string;
	mapUrl: string;
}

export type BookableDetails = {
    bookableItemName: string, // WHAT CAN BE BOOKED E.G. TABLE, ROOM
    itemPluralName: string, // TABLES, ROOMS
}