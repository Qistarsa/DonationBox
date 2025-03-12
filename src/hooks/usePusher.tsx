import { useEffect, useRef, useState, useCallback } from "react";
import Pusher, { Channel } from "pusher-js";

// Type definitions for better type safety
interface DonationEvent {
  donation: {
    amount: number;
  };
  donor_name?: string;
  message?: string;
}
interface DviceEvent {
  clientId: string;
}

interface PusherChannels {
  deviceChannel?: Channel;
  hassalahChannel?: Channel;
}

export const usePusher = (clientId: string | null, id: string) => {
  const pusherRef = useRef<Pusher | null>(null);
  const channelsRef = useRef<PusherChannels>({});
  const [connectionState, setConnectionState] = useState<
    "connecting" | "connected" | "error"
  >("connecting");
  const [donationData, setDonationData] = useState<DonationEvent | null>(null);
  const [deviceDonationData, setDeviceDonationData] =
    useState<DviceEvent | null>(null);

  const handleDeviceDonation = useCallback((data: DviceEvent) => {
    console.log("New device donation:", data);
    setDeviceDonationData(data);
  }, []);
  const handleCampaignDonation = useCallback((data: DonationEvent) => {
    console.log("New Hassalah donation:", data);
    setDonationData(data);
  }, []);

  useEffect(() => {
    if (!clientId || !id) return;

    // Initialize Pusher if not already initialized
    if (!pusherRef.current) {
      pusherRef.current = new Pusher(import.meta.env.VITE_PUSHER_APP_KEY, {
        cluster: "ap2",
        forceTLS: true,
        // authEndpoint: "/api/pusher/auth", // Uncomment if using private channels
      });

      // Set up connection listeners
      pusherRef.current.connection.bind("connected", () => {
        setConnectionState("connected");
        console.log("Pusher connected");
      });

      pusherRef.current.connection.bind("disconnected", () => {
        setConnectionState("connecting");
        console.log("Pusher disconnected");
      });

      pusherRef.current.connection.bind("error", (err: any) => {
        setConnectionState("error");
        console.error("Pusher connection error:", err);
      });
    }

    const pusher = pusherRef.current;

    // Subscribe to channels if not already subscribed
    if (!channelsRef.current.deviceChannel) {
      channelsRef.current.deviceChannel = pusher.subscribe(
        `donation.notification.${clientId}`
      );
      channelsRef.current.deviceChannel.bind(
        "update.donation.notification",
        handleDeviceDonation
      );
    }

    if (!channelsRef.current.hassalahChannel) {
      channelsRef.current.hassalahChannel = pusher.subscribe(`donation.${id}`);
      channelsRef.current.hassalahChannel.bind(
        "update.donation",
        handleCampaignDonation
      );
    }

    return () => {
      if (channelsRef.current.deviceChannel) {
        channelsRef.current.deviceChannel?.unbind(
          "update.donation.notification",
          handleDeviceDonation
        );
      }
      if (channelsRef.current.hassalahChannel) {
        channelsRef.current.hassalahChannel?.unbind(
          "update.donation",
          handleCampaignDonation
        );
      }
      if (pusherRef.current) {
        console.log("Disconnecting Pusher");
        pusherRef.current.disconnect();
        pusherRef.current = null;
      }
      channelsRef.current = {};
    };
  }, [clientId, id, handleDeviceDonation, handleCampaignDonation]);

  // Optional: Expose connection state using a memoized getter
  const getConnectionStatus = useCallback(
    () => connectionState,
    [connectionState]
  );
  console.log("==== pusher donation data == ", deviceDonationData);

  return { donationData, deviceDonationData, getConnectionStatus };
};
