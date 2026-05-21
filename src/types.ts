export interface LandingPageSettings {
  pixelId: string;
  checkoutUrl: string;
  price: number;
  originalPrice: number;
  productName: string;
  authorName: string;
  spotsTotal: number;
  spotsLeft: number;
  supportEmail: string;
  supportWhatsapp: string;
  discountCode: string;
  showOriginalPhotos: boolean; // allows toggling display of original screenshots in page
  isFictionalMode: boolean; // whether to show custom notices
}

export interface PixelEvent {
  id: string;
  timestamp: string;
  eventName: string; // PageView, InitiateCheckout, Lead, Purchase, etc.
  parameters: Record<string, any>;
  status: 'fired_successfully' | 'simulation_only' | 'error';
}
