import Pusher from "pusher-js";
import { useEffect, useState } from "react";

let pusherClient: Pusher | null = null;

export default function usePusher() {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (
      !process.env.NEXT_PUBLIC_PUSHER_KEY ||
      !process.env.NEXT_PUBLIC_PUSHER_CLUSTER
    ) {
      console.error(
        "NEXT_PUBLIC_PUSHER_KEY and NEXT_PUBLIC_PUSHER_CLUSTER must be set"
      );
      return;
    }

    if (!pusherClient) {
      pusherClient = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      });

      pusherClient.connection.bind("connected", () => {
    
        setIsConnected(true);
      });

      pusherClient.connection.bind("error", (err: any) => {
        console.error("Pusher connection error:", err);
        setIsConnected(false);
      });

      pusherClient.connection.bind("disconnected", () => {
    
        setIsConnected(false);
      });
    }

    return () => {
      if (pusherClient) {
        pusherClient.disconnect();
        pusherClient = null;
      }
    };
  }, []);

  return { pusherClient, isConnected };
}
