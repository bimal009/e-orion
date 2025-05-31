"use client"
import { useSession } from "next-auth/react";

const useGetSession = () => {
  const { data: session, status } = useSession();
  return { session, status };
}

export default useGetSession;
