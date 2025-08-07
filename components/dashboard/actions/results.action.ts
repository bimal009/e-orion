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
                // Match details with essential tournament info
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
                // Team with players and their kills for this specific match
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
                // Player kills for this match
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
                // Points table information
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
                { placement: 'asc' },  // Order by placement (1st, 2nd, 3rd, etc.)
                { points: 'desc' },    // Then by points (highest first)
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
        // Get or create PubgResult
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
                match: {
                    include: {
                        tournament: true
                    }
                },
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
                },
                group: {

                    include: {
                        teams: {
                            include: {
                                players: true

                            }
                        },
                        matches: true,
                        tournament: true,
                        round: true
                    }
                }
            }
        });

        // Send real-time update
        if (updatedResult) {
            // Only send the updated kill count
            const payload = {
                gameId,
                teamId,
                kills: updatedResult.totalKills // or the correct field for kills
            };
            await pusher.trigger('pubg-results', 'update-player-kills', payload);
        }

        return updatedResult;
    } catch (error) {
        console.error('[PUSHER] Error triggering update-player-kills:', error);
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

        await prisma.player.update({
            where: { id: playerId },
            data: { isEliminated: true }
        });

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

                // Fetch the points table for this result
                const pointsTable = await prisma.pointsTable.findUnique({
                    where: { id: pubgResult.pointsTableId },
                });
                let placementPoint = 0;
                if (pointsTable && Array.isArray(pointsTable.ranks)) {
                    const rankEntry = pointsTable.ranks.find((r) => r.rank === position);
                    if (rankEntry) {
                        placementPoint = rankEntry.placementPoint;
                    } else {
                        placementPoint = 0;
                    }
                }
                // All players are eliminated, mark team as eliminated with position
                await prisma.team.update({
                    where: { id: teamId },
                    data: {
                        isEliminated: true,
                        eliminatedAt: position
                    }
                });

                // Update resultEntry with position and eliminated status
                const updatedResultEntry = {
                    teamId: teamId,
                    teamName: team.name,
                    totalKills: pubgResult.totalKills,
                    totalPoints: placementPoint + pubgResult.totalKills,
                    matchesPlayed: 1,
                    position: placementPoint,
                    eliminated: true,
                    eliminatedAt: placementPoint
                };

                // Decrement alive teams count and update resultEntry in the pubg result
                await prisma.pubgResult.update({
                    where: { id: pubgResult.id },
                    data: {
                        aliveTeams: pubgResult.aliveTeams - 1,
                        resultEntry: [updatedResultEntry]
                    }
                });
            }
        }

        const updatedResult = await prisma.pubgResult.findUnique({
            where: { id: pubgResult.id },
            include: {
                match: {
                    include: {
                        tournament: true
                    }
                },
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
                },
                group: {
                    include: {
                        teams: {
                            include: {
                                players: true
                            }
                        },
                        matches: true,
                        tournament: true,
                        round: true
                    }
                }
            }
        });

        if (updatedResult) {
            await pusher.trigger('pubg-results', 'update-player-elimination', {
                gameId,
                teamId,
                result: updatedResult
            });
        }

        return updatedResult;
    } catch (error) {
        console.error('[PUSHER] Error triggering update-player-elimination:', error);
        return null;
    }
};


