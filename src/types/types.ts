export interface DonationEvent {
  amount: number;
  currency: string;
  donor_name?: string;
  message?: string;
  timestamp: Date;
}

export type PusherChannelType = "donation.notification" | "donation.update";

export type PusherEventType =
  | "update.donation.notification"
  | "update.donation";
