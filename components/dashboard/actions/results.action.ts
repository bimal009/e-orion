"use server";

import { prisma } from "@/lib/prisma";
import pusher from "@/lib/pusher";

// Simplified getResults function
export const getResults = async (id: string) => {
    if (!id) {
        return [];
    }

    try {
        const results = await prisma.pubgResult.findMany({
            where: { matchId: id },
            include: {
                team: {
                    include: {
                        players: {
                            include: {
                                playerKills: {
                                    where: { matchId: id }
                                }
                            }
                        }
                    }
                },
                playerKills: {
                    include: {
                        player: true
                    }
                }
            }
        });

        return results;
    } catch (error) {
        console.error("Error getting results:", error);
        return [];
    }
};

// Simplified updatePlayerKills function
export const updatePlayerKills = async (gameId: string, teamId: string, playerId: string, kills: number) => {
    if (!gameId || !teamId || !playerId) {
        return null;
    }

    try {
        // Get or create PubgResult
        let pubgResult = await prisma.pubgResult.findFirst({
            where: {
                matchId: gameId,
                teamId: teamId
            }
        });

        if (!pubgResult) {
            const match = await prisma.match.findUnique({
                where: { id: gameId },
                select: { pointsTable: { select: { id: true } } }
            });

            if (!match?.pointsTable) {
                throw new Error("Match not found");
            }

            pubgResult = await prisma.pubgResult.create({
                data: {
                    matchId: gameId,
                    teamId: teamId,
                    pointsTableId: match.pointsTable.id,
                    totalKills: 0,
                    placement: 0,
                    points: 0
                }
            });
        }

        // Get current player kills
        const currentPlayerKills = await prisma.playerKills.findFirst({
            where: {
                playerId: playerId,
                matchId: gameId
            }
        });

        let newKills = 0;
        let killsChange = 0;

        if (currentPlayerKills) {
            // Update existing record
            newKills = Math.max(0, currentPlayerKills.kills + kills);
            killsChange = newKills - currentPlayerKills.kills;

            await prisma.playerKills.update({
                where: { id: currentPlayerKills.id },
                data: { kills: newKills }
            });
        } else {
            // Create new record
            newKills = Math.max(0, kills);
            killsChange = newKills;

            await prisma.playerKills.create({
                data: {
                    kills: newKills,
                    pubgResultId: pubgResult.id,
                    teamId: teamId,
                    playerId: playerId,
                    matchId: gameId
                }
            });
        }

        // Update team total kills
        if (killsChange !== 0) {
            await prisma.pubgResult.update({
                where: { id: pubgResult.id },
                data: {
                    totalKills: pubgResult.totalKills + killsChange
                }
            });
        }

        // Get updated result
        const updatedResult = await prisma.pubgResult.findUnique({
            where: { id: pubgResult.id },
            include: {
                team: {
                    include: {
                        players: {
                            include: {
                                playerKills: {
                                    where: { matchId: gameId }
                                }
                            }
                        }
                    }
                },
                playerKills: {
                    include: {
                        player: true
                    }
                }
            }
        });

        // Send real-time update
        if (updatedResult) {
            pusher.trigger('pubg-results', 'update-player-kills', {
                gameId,
                teamId,
                result: updatedResult
            });
        }

        return updatedResult;
    } catch (error) {
        console.error('Error updating player kills:', error);
        return null;
    }
};