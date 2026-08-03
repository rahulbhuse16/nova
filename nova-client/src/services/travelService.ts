export interface Destination {
  id: string;
  name: string;
  country: string;
  coordinates: { lat: number; lng: number };
  image: string;
  description: string;
}

export interface TravelPlan {
  id: string;
  destination: Destination;
  dates: { start: string; end: string; duration: number };
  travellers: { type: string; count: number };
  budget: { amount: number; currency: string; level: string };
  transport: string;
  accommodation: string;
  interests: string[];
  itinerary: DayItinerary[];
  overview: TripOverview;
  recommendations: Recommendations;
  createdAt: string;
}

export interface DayItinerary {
  day: number;
  date: string;
  activities: Activity[];
  meals: Meal[];
  tips: string[];
}

export interface Activity {
  id: string;
  name: string;
  type: string;
  duration: string;
  time: string;
  location: string;
  cost: number;
  description: string;
}

export interface Meal {
  name: string;
  type: string;
  location: string;
  estimatedCost: number;
  cuisine: string;
}

export interface TripOverview {
  tripScore: number;
  totalCost: number;
  weather: { temp: string; condition: string };
  travelMood: string;
  quickFacts: string[];
  emergencyContacts: string[];
}

export interface Recommendations {
  places: Place[];
  restaurants: Restaurant[];
  packingList: string[];
  tips: string[];
}

export interface Place {
  name: string;
  category: string;
  rating: number;
  description: string;
  visitTime: string;
}

export interface Restaurant {
  name: string;
  cuisine: string;
  priceRange: string;
  rating: number;
  mustTry: string;
}

const mockDestinations: Destination[] = [
  {
    id: "1",
    name: "Paris",
    country: "France",
    coordinates: { lat: 48.8566, lng: 2.3522 },
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800",
    description: "The City of Light, known for art, fashion, gastronomy, and culture.",
  },
  {
    id: "2",
    name: "Tokyo",
    country: "Japan",
    coordinates: { lat: 35.6762, lng: 139.6503 },
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800",
    description: "A vibrant metropolis blending tradition and cutting-edge technology.",
  },
  {
    id: "3",
    name: "New York",
    country: "United States",
    coordinates: { lat: 40.7128, lng: -74.0060 },
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800",
    description: "The city that never sleeps, offering endless entertainment and culture.",
  },
  {
    id: "4",
    name: "Bali",
    country: "Indonesia",
    coordinates: { lat: -8.3405, lng: 115.0920 },
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800",
    description: "A tropical paradise with stunning beaches, temples, and rice terraces.",
  },
  {
    id: "5",
    name: "Rome",
    country: "Italy",
    coordinates: { lat: 41.9028, lng: 12.4964 },
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800",
    description: "The Eternal City, rich in ancient history and Renaissance art.",
  },
];

class TravelService {
  async searchDestinations(query: string): Promise<Destination[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = mockDestinations.filter(
          (d) =>
            d.name.toLowerCase().includes(query.toLowerCase()) ||
            d.country.toLowerCase().includes(query.toLowerCase())
        );
        resolve(filtered);
      }, 500);
    });
  }

  async generateItinerary(params: {
    destination: Destination;
    dates: { start: string; end: string };
    travellers: { type: string; count: number };
    budget: { amount: number; currency: string; level: string };
    transport: string;
    accommodation: string;
    interests: string[];
  }): Promise<TravelPlan> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const duration = Math.ceil(
          (new Date(params.dates.end).getTime() - new Date(params.dates.start).getTime()) /
            (1000 * 60 * 60 * 24)
        );

        const itinerary: DayItinerary[] = Array.from({ length: duration }, (_, i) => ({
          day: i + 1,
          date: new Date(new Date(params.dates.start).getTime() + i * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
          activities: this.generateActivities(params.destination.name, params.interests, i),
          meals: this.generateMeals(params.destination.name),
          tips: this.generateTips(params.destination.name),
        }));

        const plan: TravelPlan = {
          id: `plan-${Date.now()}`,
          destination: params.destination,
          dates: { ...params.dates, duration },
          travellers: params.travellers,
          budget: params.budget,
          transport: params.transport,
          accommodation: params.accommodation,
          interests: params.interests,
          itinerary,
          overview: this.generateOverview(params.destination, params.budget, duration),
          recommendations: this.generateRecommendations(params.destination, params.interests),
          createdAt: new Date().toISOString(),
        };

        resolve(plan);
      }, 3000);
    });
  }

  private generateActivities(destination: string, interests: string[], dayIndex: number): Activity[] {
    const activities: Activity[] = [
      {
        id: `act-${dayIndex}-1`,
        name: `Explore ${destination} Landmarks`,
        type: "Sightseeing",
        duration: "3 hours",
        time: "09:00",
        location: "City Center",
        cost: 0,
        description: "Visit iconic landmarks and historical sites.",
      },
      {
        id: `act-${dayIndex}-2`,
        name: interests.includes("Food") ? "Local Food Tour" : "Museum Visit",
        type: interests.includes("Food") ? "Food" : "Culture",
        duration: "2 hours",
        time: "14:00",
        location: "Downtown",
        cost: 50,
        description: interests.includes("Food")
          ? "Taste authentic local cuisine."
          : "Discover art and history.",
      },
      {
        id: `act-${dayIndex}-3`,
        name: interests.includes("Nightlife") ? "Evening Entertainment" : "Nature Walk",
        type: interests.includes("Nightlife") ? "Entertainment" : "Nature",
        duration: "2 hours",
        time: "19:00",
        location: "City District",
        cost: 30,
        description: interests.includes("Nightlife")
          ? "Experience the local nightlife scene."
          : "Enjoy scenic views and nature.",
      },
    ];

    return activities;
  }

  private generateMeals(destination: string): Meal[] {
    return [
      {
        name: "Local Breakfast",
        type: "Breakfast",
        location: "Café District",
        estimatedCost: 15,
        cuisine: "Local",
      },
      {
        name: "Signature Restaurant Lunch",
        type: "Lunch",
        location: "Restaurant Row",
        estimatedCost: 35,
        cuisine: "Fusion",
      },
      {
        name: "Dinner at Rooftop",
        type: "Dinner",
        location: "City Center",
        estimatedCost: 60,
        cuisine: "International",
      },
    ];
  }

  private generateTips(destination: string): string[] {
    return [
      `Book popular attractions in advance for ${destination}`,
      "Carry local currency for small purchases",
      "Download offline maps for navigation",
      "Learn basic local phrases",
      "Keep emergency contacts handy",
    ];
  }

  private generateOverview(
    destination: Destination,
    budget: { amount: number; currency: string },
    duration: number
  ): TripOverview {
    return {
      tripScore: 92,
      totalCost: budget.amount * duration,
      weather: { temp: "22°C", condition: "Partly Cloudy" },
      travelMood: "Adventurous & Cultural",
      quickFacts: [
        `${destination.country} uses local currency`,
        `Best time to visit: Spring/Fall`,
        `Language: Local dialects common`,
        `Transport: Public transit efficient`,
      ],
      emergencyContacts: ["Police: 112", "Tourist Info: +1-800-TRAVEL", "Embassy: +1-800-EMBASSY"],
    };
  }

  private generateRecommendations(destination: Destination, interests: string[]): Recommendations {
    return {
      places: [
        {
          name: `${destination.name} Historic Center`,
          category: "Historical",
          rating: 4.8,
          description: "UNESCO World Heritage site with centuries of history.",
          visitTime: "Morning",
        },
        {
          name: "Art District Gallery",
          category: "Art",
          rating: 4.6,
          description: "Contemporary art exhibitions and local artists.",
          visitTime: "Afternoon",
        },
        {
          name: "Scenic Viewpoint",
          category: "Nature",
          rating: 4.9,
          description: "Panoramic views of the entire city.",
          visitTime: "Sunset",
        },
      ],
      restaurants: [
        {
          name: "The Local Kitchen",
          cuisine: "Traditional",
          priceRange: "$$",
          rating: 4.7,
          mustTry: "Signature dish",
        },
        {
          name: "Fusion Bistro",
          cuisine: "Modern Fusion",
          priceRange: "$$$",
          rating: 4.5,
          mustTry: "Chef's special",
        },
      ],
      packingList: [
        "Passport and travel documents",
        "Comfortable walking shoes",
        "Weather-appropriate clothing",
        "Portable charger",
        "Camera",
        "Travel adapter",
        "Basic first aid kit",
        "Reusable water bottle",
      ],
      tips: [
        "Book accommodations near public transport",
        "Try street food for authentic experiences",
        "Respect local customs and traditions",
        "Stay hydrated and carry water",
        "Keep copies of important documents",
      ],
    };
  }

  async getThinkingSteps(): Promise<string[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          "Analyzing destination...",
          "Checking travel style...",
          "Optimizing itinerary...",
          "Finding hidden gems...",
          "Balancing budget...",
          "Estimating travel time...",
          "Preparing personalized experience...",
        ]);
      }, 500);
    });
  }
}

export const travelService = new TravelService();
