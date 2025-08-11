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
                match: {
                    select: {
                        id: true,
                        matchNo: true,
                        name: true,
                        startTime: true,
                        endTime: true,
                        day: true,
                        tournament: {
                            select: {
                                id: true,
                                name: true,
                                logo: true,
                                selectedTheme: true
                            }
                        },
                        round: {
                            select: {
                                id: true,
                                name: true,
                                numberOfDays: true
                            }
                        },
                        map: {
                            select: {
                                id: true,
                                name: true,
                                mapImage: true
                            }
                        },
                        group: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                },
                team: {
                    select: {
                        id: true,
                        name: true,
                        teamTag: true,
                        logo: true,
                        isEliminated: true,
                        eliminatedAt: true,
                        players: {
                            select: {
                                id: true,
                                name: true,
                                ign: true,
                                role: true,
                                image: true,
                                isEliminated: true,
                                isPlaying: true,
                                playerKills: {
                                    where: { matchId: id },
                                    select: {
                                        kills: true,
                                        damage: true,
                                        assists: true,
                                        placement: true,
                                        survived: true,
                                        eliminatedAt: true
                                    }
                                }
                            }
                        }
                    }
                },
                playerKills: {
                    select: {
                        id: true,
                        kills: true,
                        damage: true,
                        assists: true,
                        placement: true,
                        survived: true,
                        eliminatedAt: true,
                        player: {
                            select: {
                                id: true,
                                name: true,
                                ign: true,
                                role: true,
                                image: true
                            }
                        }
                    }
                },
                pointsTable: {
                    select: {
                        id: true,
                        pointTableName: true,
                        killPoint: true,
                        ranks: true
                    }
                }
            },
            orderBy: [
                { placement: 'asc' },
                { points: 'desc' },
                { totalKills: 'desc' }
            ]
        });

        return results;
    } catch (error) {
        console.error("Error getting results:", error);
        return [];
    }
};

export const updatePlayerKills = async (gameId: string, teamId: string, playerId: string, kills: number) => {
    if (!gameId || !teamId || !playerId) {
        return null;
    }

    try {
        // Get PubgResult
        let pubgResult = await prisma.pubgResult.findFirst({
            where: {
                matchId: gameId,
                teamId: teamId
            }
        });

        if (!pubgResult) {
            return null;
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
            newKills = Math.max(0, currentPlayerKills.kills + kills);
            killsChange = newKills - currentPlayerKills.kills;

            await prisma.playerKills.update({
                where: { id: currentPlayerKills.id },
                data: { kills: newKills }
            });
        } else {
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
            const newTotalKills = pubgResult.totalKills + killsChange;

            await prisma.pubgResult.update({
                where: { id: pubgResult.id },
                data: {
                    totalKills: newTotalKills
                }
            });

            // Send real-time update with just the necessary data
            const payload = {
                gameId,
                teamId,
                kills: newTotalKills
            };

            await pusher.trigger('pubg-results', 'update-player-kills', payload);
        }

        return { success: true, totalKills: pubgResult.totalKills + killsChange };
    } catch (error) {
        console.error('[PUSHER] Error updating player kills:', error);
        return null;
    }
};

export const updatePlayerElimination = async (gameId: string, teamId: string, playerId: string) => {
    if (!gameId || !teamId || !playerId) {
        return null;
    }

    try {
        let pubgResult = await prisma.pubgResult.findFirst({
            where: {
                matchId: gameId,
                teamId: teamId
            }
        });

        if (!pubgResult) {
            return null;
        }

        // Mark player as eliminated
        await prisma.player.update({
            where: { id: playerId },
            data: { isEliminated: true }
        });

        // Check if team should be eliminated
        const team = await prisma.team.findFirst({
            where: { id: teamId },
            include: {
                players: true
            }
        });

        if (team) {
            const alivePlayers = team.players.filter((player) =>
                player.isEliminated === false && player.isPlaying === true
            );

            if (alivePlayers.length === 0) {
                // Calculate position based on current alive teams count
                const position = pubgResult.aliveTeams;

                // Get placement points
                const pointsTable = await prisma.pointsTable.findUnique({
                    where: { id: pubgResult.pointsTableId },
                });

                let placementPoints = 0;
                if (pointsTable && Array.isArray(pointsTable.ranks)) {
                    const rankEntry = pointsTable.ranks.find((r) => r.rank === position);
                    if (rankEntry) {
                        placementPoints = rankEntry.placementPoint;
                    }
                }

                // Mark team as eliminated
                await prisma.team.update({
                    where: { id: teamId },
                    data: {
                        isEliminated: true,
                        eliminatedAt: position
                    }
                });

                // Update PubgResult
                const newTotalPoints = placementPoints + pubgResult.totalKills;
                await prisma.pubgResult.update({
                    where: { id: pubgResult.id },
                    data: {
                        aliveTeams: pubgResult.aliveTeams - 1,
                        placement: position,
                        points: newTotalPoints
                    }
                });

                // Send real-time update
                const payload = {
                    gameId,
                    teamId,
                    result: {
                        placement: position,
                        points: newTotalPoints,
                        totalKills: pubgResult.totalKills,
                        eliminated: true
                    }
                };

                await pusher.trigger('pubg-results', 'update-player-elimination', payload);
            }
        }

        return { success: true };
    } catch (error) {
        console.error('[PUSHER] Error updating player elimination:', error);
        return null;
    }
};