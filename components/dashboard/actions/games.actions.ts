"use server"

import { authOptions } from "@/auth"
import { prisma } from "@/lib/prisma"
import { GameCreateInput } from "@/lib/types"
import { handleError } from "@/lib/utils"
import { getServerSession } from "next-auth"
import type { Team } from '@/lib/types';

export const createGame = async (data: GameCreateInput) => {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      throw new Error("User not authenticated")
    }

    const match = await prisma.match.create({
      data: {
        matchNo: data.matchNo,
        name: data.name,
        roundId: data.roundId,
        tournamentId: data.tournamentId,
        mapId: data.mapId,
        startTime: data.startTime,
        endTime: data.endTime || null,
        day: data.day || null,
        pointsTableId: data.pointsTableId || null,
        ...(data.groupId && { groupId: data.groupId }),
      }
    })

    const teams = await prisma.team.findMany({
      where: data.groupId
        ? { groupId: data.groupId }
        : { tournamentId: data.tournamentId },
      include: { players: true }
    })

    // Get points table for the tournament
    const pointsTable = await prisma.pointsTable.findFirst({
      where: { tournamentId: data.tournamentId }
    })

    if (pointsTable && teams.length > 0) {
      // Create PUBG results for each team
      const pubgResults = await Promise.all(
        teams.map(async (team: Team) => {
          return await prisma.pubgResult.create({
            data: {
              matchId: match.id,
              teamId: team.id,
              pointsTableId: pointsTable.id,
              groupId: data.groupId || null,
              totalKills: 0,
              placement: 0,
              points: 0
            }
          })
        })
      )

      // Create player kills for each team's players
      const playerKillsData = teams.flatMap((team: Team) =>
        (team.players ?? []).map(player => ({
          playerId: player.id,
          matchId: match.id,
          teamId: team.id,
          pubgResultId: pubgResults.find(result => result.teamId === team.id)?.id || "",
          kills: 0,
          damage: 0,
          assists: 0,
          survived: false
        }))
      )

      if (playerKillsData.length > 0) {
        await prisma.playerKills.createMany({
          data: playerKillsData
        })
      }
    }

    console.log(match)
    return match
  } catch (error) {
    handleError(error)
    throw new Error("Failed to create game")
  }
}

export const updateGame = async (id: string, data: GameCreateInput) => {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      throw new Error("User not authenticated")
    }

    const currentGame = await prisma.match.findUnique({
      where: { id },
    })

    if (!currentGame) {
      throw new Error("Game not found")
    }

    const updateData: any = {
      name: data.name,
      tournamentId: data.tournamentId,
      roundId: data.roundId,
      matchNo: data.matchNo,
      mapId: data.mapId,
      startTime: data.startTime,
      endTime: data.endTime || null,
      day: data.day || null,
      ...(data.groupId && { groupId: data.groupId }),
    };
    if (data.groupId !== undefined) updateData.groupId = data.groupId;
    if (data.roundId !== undefined) updateData.roundId = data.roundId;

    // Update the team with new players
    const game = await prisma.match.update({
      where: { id },
      data: updateData,
      include: {
        tournament: true,
        round: true,
      },
    })
    return game
  } catch (error) {
    handleError(error)
    throw new Error("Failed to update game")
  }
}

export const getGames = async (tournmentId: string, roundId: string) => {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      throw new Error("User not authenticated")
    }

    if (!tournmentId) {
      throw new Error("Tournament ID is required")
    }

    const games = await prisma.match.findMany({
      where: { tournamentId: tournmentId, roundId: roundId },
      include: { tournament: true },
      orderBy: { id: 'asc' },
    })

    return games || []
  } catch (error) {
    handleError(error)
    throw new Error("Failed to fetch games")
  }
}

export const getGamesWithSearch = async (tournmentId: string, search: string) => {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      throw new Error("User not authenticated")
    }

    if (!tournmentId) {
      throw new Error("Tournament ID is required")
    }

    const games = await prisma.match.findMany({
      where: {
        tournamentId: tournmentId,
        name: {
          contains: search,
          mode: 'insensitive',
        },
      },
      include: { tournament: true },
    })

    console.log(games)

    return games || []
  } catch (error) {
    handleError(error)
    throw new Error("Failed to fetch games")
  }
}

export const deleteGame = async (gameId: string) => {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      throw new Error("User not authenticated")
    }

    // Optional: check if the tournament belongs to the current user before deleting
    const game = await prisma.match.findUnique({
      where: { id: gameId },
      include: { tournament: true },
    })

    if (!game || !session.user.id) {
      throw new Error("Game not found or you're not authorized to delete it")
    }

    // Delete players first (if not using CASCADE)

    // Then delete the team
    const deletedGame = await prisma.match.delete({
      where: { id: gameId },
      include: { tournament: true },
    })

    return deletedGame
  } catch (error) {
    handleError(error)
    throw new Error("Failed to delete game")
  }
}

export const getGameById = async (id: string) => {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      throw new Error("User not authenticated")
    }
    const game = await prisma.match.findUnique({
      where: { id },
      include: { tournament: true, round: true },
    })
    if (!game) throw new Error("Game not found")
    return game
  } catch (error) {
    handleError(error)
    throw new Error("Failed to fetch game")
  }
}

export const getGamesByGameId = async (gameId: string) => {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      throw new Error("User not authenticated")
    }

    if (!gameId) {
      throw new Error("Game ID is required")
    }

    const games = await prisma.match.findUnique({
      where: { id: gameId },
      include: {
        tournament: true,
        round: true,
        group: {
          include: {
            teams: {
              include: {
                players: true
              }
            }
          }
        }
      },
    })

    return games || null
  } catch (error) {
    handleError(error)
    throw new Error("Failed to fetch games")
  }
}