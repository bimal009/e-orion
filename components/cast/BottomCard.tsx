"use client";
import React from "react";
import { Card } from "@/components/ui/card";
import { useGetGamesByGameId } from "../dashboard/api/useGames";
import Image from "next/image";

export default function TournamentCard({ gameId }: { gameId: string }) {
  const { data } = useGetGamesByGameId(gameId);

  return (
    <Card className="w-96 bg-card border border-border rounded-none shadow-sm">
      <div className="bg-background/95 p-3">
        <div className="flex items-center justify-between text-foreground">
          {/* Left side - Tournament logo and info */}
          <div className="flex items-center gap-2">
            <div className="bg-card p-1">
              <div className="w-10 h-10 bg-muted relative flex items-center justify-center">
                <Image
                  src={data?.tournament?.logo || "/placeholder.png"}
                  alt={data?.tournament?.name || "Tournament Logo"}
                  width={40}
                  height={40}
                  className="object-cover"
                />
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 bg-primary text-primary-foreground text-xs px-1 py-0.5 font-bold">
                  100
                </div>
              </div>
            </div>

            <div>
              <div className="font-bold text-sm text-foreground truncate max-w-[120px]">
                {data?.tournament?.name}
              </div>
            </div>
          </div>

          {/* Center - Match info */}
          <div className="text-center">
            <div className="text-primary font-bold text-xs mb-1">
              DAY {data?.day} - MATCH {data?.matchNo}
            </div>
            <div className="bg-primary text-primary-foreground px-3 py-1 font-bold text-sm">
              {data?.round?.name}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
