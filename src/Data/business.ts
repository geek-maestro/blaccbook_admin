import featuredImage from "../assets/comp1.jpg"
export interface IMapLocation {
    lat: string;
    lng: string;
    staticMapUri: string;
    mapUrl: string;
  }
  
  export interface IContact {
    telephone: string;
    countryCode: string;
    country: string;
    state: string;
    city: string;
    street: string;
    mapLocation: IMapLocation;
  }
  
  export interface IBookableDetails {
    bookableItemName: string;
    itemPluralName: string;
  }
  
  export interface IBusiness {
    id: string;
    createdAt: string;
    name: string;
    email: string;
    featuredImage: string;
    categories: string[];
    images: string[];
    website?: string;
    contact: IContact;
    features?: string[];
    isEcommerce?: boolean;
    isBookable?: boolean;
    hasMenu?: boolean;
    bookableDetails?: IBookableDetails;
    rating?: number;
  }
export const mockBusinesses: IBusiness[] = [
    {
      id: "1",
      createdAt: "2024-12-09T10:00:00Z",
      name: "The Gourmet Hub",
      email: "contact@gourmethub.com",
      featuredImage: featuredImage, 
      categories: ["cat_001", "cat_002"],
      images: [
        "https://picsum.photos/seed/restaurant2/1080/720",
        "https://picsum.photos/seed/restaurant3/1080/720",
        "https://picsum.photos/seed/restaurant4/1080/720",
        "https://picsum.photos/seed/restaurant5/1080/720"
      ],
      website: "https://gourmethub.com",
      contact: {
        telephone: "+1234567890",
        countryCode: "+1",
        country: "United States",
        state: "California",
        city: "Los Angeles",
        street: "123 Gourmet Street",
        mapLocation: {
          lat: "34.052235",
          lng: "-118.243683",
          staticMapUri: "https://maps.example.com/static?lat=34.052235&lng=-118.243683",
          mapUrl: "https://maps.example.com/?q=34.052235,-118.243683"
        }
      },
      features: ["Outdoor Seating", "Live Music"],
      isEcommerce: true,
      isBookable: true,
      hasMenu: true,
      bookableDetails: {
        bookableItemName: "Table",
        itemPluralName: "Tables"
      },
      rating: 4.8
    },
    {
      id: "2",
      createdAt: "2024-12-08T15:30:00Z",
      name: "City Cleaners",
      email: "info@citycleaners.com",
      featuredImage: "https://images.unsplash.com/photo-1625723462089-f79ab9b51998",
      categories: ["cat_004"],
      images: [
        "https://picsum.photos/seed/cleaning2/1080/720",
        "https://picsum.photos/seed/cleaning3/1080/720"
      ],
      contact: {
        telephone: "+9876543210",
        countryCode: "+44",
        country: "United Kingdom",
        state: "England",
        city: "London",
        street: "456 Clean Avenue",
        mapLocation: {
          lat: "51.507351",
          lng: "-0.127758",
          staticMapUri: "https://maps.example.com/static?lat=51.507351&lng=-0.127758",
          mapUrl: "https://maps.example.com/?q=51.507351,-0.127758"
        }
      },
      features: ["Eco-Friendly Products", "Same-Day Service"],
      isEcommerce: true,
      isBookable: false,
      hasMenu: false,
      rating: 4.5
    },
    {
      id: "3",
      createdAt: "2024-12-07T09:15:00Z",
      name: "Mountain Retreat Lodge",
      email: "reservations@mountainretreat.com",
      featuredImage: "https://images.unsplash.com/photo-1515444744559-7be63e1600de",
      categories: ["cat_006", "cat_007"],
      images: [
        "https://picsum.photos/seed/mountain2/1080/720",
        "https://picsum.photos/seed/mountain3/1080/720"
      ],
      website: "https://mountainretreat.com",
      contact: {
        telephone: "+1122334455",
        countryCode: "+33",
        country: "France",
        state: "Auvergne-Rhône-Alpes",
        city: "Chamonix",
        street: "789 Mountain Path",
        mapLocation: {
          lat: "45.923697",
          lng: "6.869433",
          staticMapUri: "https://maps.example.com/static?lat=45.923697&lng=6.869433",
          mapUrl: "https://maps.example.com/?q=45.923697,6.869433"
        }
      },
      features: ["Spa Services", "Ski-In/Ski-Out"],
      isEcommerce: false,
      isBookable: true,
      hasMenu: true,
      bookableDetails: {
        bookableItemName: "Room",
        itemPluralName: "Rooms"
      },
      rating: 4.9
    },
    {
      id: "4",
      createdAt: "2024-12-06T11:00:00Z",
      name: "Snicker Snackers",
      email: "info@thecoffeespot.com",
      featuredImage: featuredImage, 
      categories: ["cat_011", "cat_009"],
      images: [
        "https://picsum.photos/seed/coffee1/1080/720",
        "https://picsum.photos/seed/coffee2/1080/720"
      ],
      website: "https://thecoffeespot.com",
      contact: {
        telephone: "+1234567891",
        countryCode: "+1",
        country: "United States",
        state: "New York",
        city: "New York",
        street: "101 Coffee Lane",
        mapLocation: {
          lat: "40.712776",
          lng: "-74.005974",
          staticMapUri: "https://maps.example.com/static?lat=40.712776&lng=-74.005974",
          mapUrl: "https://maps.example.com/?q=40.712776,-74.005974"
        }
      },
      features: ["Free Wi-Fi", "Pet Friendly"],
      isEcommerce: false,
      isBookable: false,
      hasMenu: true,
      rating: 4.7
    },
    {
      id: "5",
      createdAt: "2024-12-05T14:30:00Z",
      name: "The Icecream Palace",
      email: "contact@thebooknook.com",
      featuredImage: featuredImage, 
      categories: ["cat_011", "cat_002"],
      images: [
        "https://picsum.photos/seed/bookstore1/1080/720",
        "https://picsum.photos/seed/bookstore2/1080/720"
      ],
      website: "https://thebooknook.com",
      contact: {
        telephone: "+1234567892",
        countryCode: "+1",
        country: "United States",
        state: "California",
        city: "San Francisco",
        street: "202 Book St",
        mapLocation: {
          lat: "37.774929",
          lng: "-122.419418",
          staticMapUri: "https://maps.example.com/static?lat=37.774929&lng=-122.419418",
          mapUrl: "https://maps.example.com/?q=37.774929,-122.419418"
        }
      },
      features: ["Reading Nooks", "Author Events"],
      isEcommerce: true,
      isBookable: false,
      hasMenu: false,
      rating: 4.8
    },
    {
      id: "6",
      createdAt: "2024-12-04T09:00:00Z",
      name: "Artisan Bakery",
      email: "info@artisanbakery.com",
      featuredImage: featuredImage, 
      categories: ["cat_011", "cat_013"],
      images: [
        "https://picsum.photos/seed/bakery1/1080/720",
        "https://picsum.photos/seed/bakery2/1080/720"
      ],
      website: "https://artisanbakery.com",
      contact: {
        telephone: "+1234567893",
        countryCode: "+1",
        country: "United States",
        state: "Texas",
        city: "Austin",
        street: "303 Bakery Blvd",
        mapLocation: {
          lat: "30.267153",
          lng: "-97.743057",
          staticMapUri: "https://maps.example.com/static?lat=30.267153&lng=-97.743057",
          mapUrl: "https://maps.example.com/?q=30.267153,-97.743057"
        }
      },
      features: ["Freshly Baked Goods", "Custom Cakes"],
      isEcommerce: true,
      isBookable: false,
      hasMenu: true,
      rating: 4.6
    },
    {
      id: "7",
      createdAt: "2024-12-03T16:45:00Z",
      name: "Coffee Ranch",
      email: "info@fitnessfirst.com",
      featuredImage: featuredImage, 
      categories: ["cat_011", "cat_015"],
      images: [
        "https://picsum.photos/seed/gym1/1080/720",
        "https://picsum.photos/seed/gym2/1080/720"
      ],
      website: "https://fitnessfirst.com",
      contact: {
        telephone: "+1234567894",
        countryCode: "+1",
        country: "United States",
        state: "Florida",
        city: "Miami",
        street: "404 Fitness Ave",
        mapLocation: {
          lat: "25.7617",
          lng: "-80.1918",
          staticMapUri: "https://maps.example.com/static?lat=25.7617&lng=-80.1918",
          mapUrl: "https://maps.example.com/?q=25.7617,-80.1918"
        }
      },
      features: ["Personal Training", "Group Classes"],
      isEcommerce: false,
      isBookable: true,
      hasMenu: false,
      rating: 4.5
    },
    {
      id: "8",
      createdAt: "2024-12-02T12:00:00Z",
      name: "Tech Haven",
      email: "info@techhaven.com",
      featuredImage: featuredImage, 
      categories: ["cat_011", "cat_017"],
      images: [
        "https://picsum.photos/seed/techstore1/1080/720",
        "https://picsum.photos/seed/techstore2/1080/720"
      ],
      website: "https://techhaven.com",
      contact: {
        telephone: "+1234567895",
        countryCode: "+1",
        country: "United States",
        state: "Illinois",
        city: "Chicago",
        street: "505 Tech Rd",
        mapLocation: {
          lat: "41.8781",
          lng: "-87.6298",
          staticMapUri: "https://maps.example.com/static?lat=41.8781&lng=-87.6298",
          mapUrl: "https://maps.example.com/?q=41.8781,-87.6298"
        }
      },
      features: ["Latest Gadgets", "Tech Support"],
      isEcommerce: true,
      isBookable: false,
      hasMenu: false,
      rating: 4.9
    },
    {
      id: "9",
      createdAt: "2024-12-10T10:00:00Z",
      name: "Spicy Thai Bistro",
      email: "info@spicythaibistro.com",
      featuredImage: featuredImage, 
      categories: ["cat_001", "cat_019"],
      images: [
        "https://picsum.photos/seed/thai1/1080/720",
        "https://picsum.photos/seed/thai2/1080/720"
      ],
      website: "https://spicythaibistro.com",
      contact: {
        telephone: "+1234567896",
        countryCode: "+1",
        country: "United States",
        state: "California",
        city: "San Diego",
        street: "789 Spicy St",
        mapLocation: {
          lat: "32.715736",
          lng: "-117.161087",
          staticMapUri: "https://maps.example.com/static?lat=32.715736&lng=-117.161087",
          mapUrl: "https://maps.example.com/?q=32.715736,-117.161087"
        }
      },
      features: ["Outdoor Seating", "Takeout Available"],
      isEcommerce: false,
      isBookable: true,
      hasMenu: true,
      bookableDetails: {
        bookableItemName: "Table",
        itemPluralName: "Tables"
      },
      rating: 4.7
    },
    {
      id: "10",
      createdAt: "2024-12-11T12:00:00Z",
      name: "Pasta Paradise",
      email: "info@pastaparadise.com",
      featuredImage: featuredImage, 
      categories: ["cat_001", "cat_021"],
      images: [
        "https://picsum.photos/seed/pasta1/1080/720",
        "https://picsum.photos/seed/pasta2/1080/720"
      ],
      website: "https://pastaparadise.com",
      contact: {
        telephone: "+1234567897",
        countryCode: "+1",
        country: "United States",
        state: "New York",
        city: "Buffalo",
        street: "101 Pasta Ave",
        mapLocation: {
          lat: "42.886448",
          lng: "-78.878372",
          staticMapUri: "https://maps.example.com/static?lat=42.886448&lng=-78.878372",
          mapUrl: "https://maps.example.com/?q=42.886448,-78.878372"
        }
      },
      features: ["Family Friendly", "Takeout Available"],
      isEcommerce: false,
      isBookable: true,
      hasMenu: true,
      bookableDetails: {
        bookableItemName: "Table",
        itemPluralName: "Tables"
      },
      rating: 4.8
    },
    {
      id: "11",
      createdAt: "2024-12-12T14:00:00Z",
      name: "Sushi World",
      email: "info@sushiworld.com",
      featuredImage: featuredImage, 
      categories: ["cat_001", "cat_012"],
      images: [
        "https://picsum.photos/seed/sushi1/1080/720",
        "https://picsum.photos/seed/sushi2/1080/720"
      ],
      website: "https://sushiworld.com",
      contact: {
        telephone: "+1234567898",
        countryCode: "+1",
        country: "United States",
        state: "Washington",
        city: "Seattle",
        street: "202 Sushi St",
        mapLocation: {
          lat: "47.606209",
          lng: "-122.332071",
          staticMapUri: "https://maps.example.com/static?lat=47.606209&lng=-122.332071",
          mapUrl: "https://maps.example.com/?q=47.606209,-122.332071"
        }
      },
      features: ["Sushi Bar", "All-You-Can-Eat"],
      isEcommerce: false,
      isBookable: true,
      hasMenu: true,
      bookableDetails: {
        bookableItemName: "Table",
        itemPluralName: "Tables"
      },
      rating: 4.9
    }
  ];