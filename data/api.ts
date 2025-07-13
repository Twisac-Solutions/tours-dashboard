export interface EventData {
  id: string;
  name: string;
  location: string;
  description: string;
  date: string;
  mediaUrls: string[] | null;
}
export interface User {
  id: string;
  fullName: string;
}

export interface Event {
  id: string;
  name: string;
  location?: string;
  description?: string;
  date: string; // ISO date format
  color?: string | null;
  font?: string | null;
  upgraded: boolean;
  mediaUrls?: string | null;
}

export interface ItineraryItem {
  id: string;
  time: string;
  title: string;
}

export interface ItineraryResponse {
  data: [
    {
      id: string;
      user: User;
      event: Event;
      itineraryItems: ItineraryItem[];
    },
  ];
}

export interface EventsResponse {
  metadata: {
    total: number;
  };
  data: Event[];
}

interface EventUser {
  id: string;
}

export interface OurStoryData {
  id: string;
  brideName: string;
  groomName: string;
  mediaUrl: string;
  brideMediaUrl: string | null;
  groomMediaUrl: string | null;
  weddingDate: string;
  event: {
    id: string;
  };
  user: {
    id: string;
  };
  favoriteCharacteristics: any[];
  ourStorySections: OurStorySection[];
  ourStoryPartyMember: any[];
}

export interface OurStoryResponse {
  data: OurStoryData;
}

export interface OurStorySection {
  id: string;
  mediaUrls: string[];
  content: string;
  createdAt: string;
  title: string;
}

export interface TriviaGroupData {
  id: string;
  name: string;
  user: {
    id: string;
  };
  event: {
    id: string;
  };
}

export interface TriviaQuestionData {
  data: {
    id: string;
    question: string;
    event: {
      id: string;
    };
    group: {
      id: string;
    };
    user: {
      id: string;
    };
  };
}

export interface TriviaAnswerResponse {
  data: {
    id: string;
    question: {
      id: string;
    };
    answer: string;
    isCorrect: boolean;
  };
}

export interface TriviaQuestion {
  id: string;
  question: string;
  event: {
    id: string;
  };
  group: {
    id: string;
  };
  user: {
    id: string;
  };
}

export interface TriviaQuestionsResponse {
  metadata: {
    total: number;
  };
  data: TriviaQuestion[];
}

export interface GiftStats {
  draft: number;
  reported: number;
  failed: number;
  processed: number;
  total_amount: number;
  total_fees: number;
}

export interface GiftItem {
  id: string;
  eventId: string;
  name: string;
  goal: number;
  achieved: number;
  achieved_percent: number;
  imageUrl: string;
}

export interface GiftsResponse {
  metadata: {
    total: number;
  };
  data: GiftItem[];
}

export interface Post {
  id: string;
  content: string;
  mediaUrls: string[] | null;
  effects: string[] | null;
  postType: string;
  privacy: string;
  timestamp: string;
  // user: { id: string; name: string; avatar: string };
  guest: { id: string; name: string; avatar: string };
  tags: { id: string; name: string; avatar: string }[];
  likes: number;
  shares: number;
  views: number;
  i_liked: boolean;
}

export interface VendorDetailSection {
  id: string;
  title: string;
  content: string;
  mediaUrls: string[];
}

interface VendorDetail {
  id: string;
  sections: VendorDetailSection[];
}
interface VendorDetailResponse {
  data: VendorDetail;
}

export interface GiftPayment {
  id: string;
  eventId: string;
  giftId: string;
  amount: string;
  totalAmount: string;
  fee_percent: string;
  total_amount: string;
  message: string | null;
  reported: boolean | null;
  reason: string | null;
  status: string; // "paid" | "failed" | "pending"
  visible: boolean;
  receipt: GiftPaymentReceipt;
  gift: GiftSummary;
  guest: GiftGuest;
}
export interface GiftSummary {
  id: string;
  name: string;
  imageUrl: string;
}

export interface GiftGuest {
  id: string;
  name: string;
  avatar: string;
}

export interface GiftPaymentReceipt {
  reference: string | null;
  date: string;
  cc_number: string;
  cc_expire: string;
  fees: string;
  amount: string;
}

export interface GiftGuest {
  id: string;
  name: string;
  avatar: string;
}

export interface GiftSummary {
  id: string;
  name: string;
  imageUrl: string;
}

export interface GiftPaymentResponse {
  metadata: {
    total: number;
  };
  data: GiftPayment[];
}
