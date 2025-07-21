"use client"
import React from 'react';
import { Card } from '@/components/ui/card';
import { useGetGamesByGameId } from '../dashboard/api/useGames';
import Image from 'next/image';

export default function TournamentCard({gameId}: {gameId: string}) {
    const {data}= useGetGamesByGameId(gameId)
    console.log(data)
   
  return (
    <Card className="w-96 bg-muted p-0.5 border border-border">
      <div className="bg-background/90 dark:bg-background/80 backdrop-blur-sm p-3 rounded-md">
        <div className="flex items-center justify-between text-foreground">
          
          {/* Left side - Tournament logo and info */}
          <div className="flex items-center gap-2">
            <div className="bg-background p-1 rounded-lg">
              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center relative">
                <Image src={data?.tournament?.logo || "/placeholder.png"} alt={data?.tournament?.name || "Tournament Logo"} width={40} height={40} className='object-cover' />
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 bg-accent text-secondary text-xs px-1 py-0.5 rounded font-bold">
                  100
                </div>
              </div>
            </div>
            
            <div>
              <div className="font-bold text-sm text-foreground">{data?.tournament?.name}</div>
            </div>
          </div>

          {/* Center - Match info */}
          <div className="text-center">
            <div className="text-primary font-bold text-xs mb-1">DAY {data?.day} - MATCH {data?.matchNo}</div>
            <div className="bg-primary text-primary-foreground px-3 py-1 rounded font-bold text-sm">
              {data?.round?.name}
            </div>
          </div>

       
        </div>
      </div>
    </Card>
  );
}