"use server"

import { authOptions } from "@/auth"
import { prisma } from "@/lib/prisma"
import { GameCreateInput, MatchCreateInput, TeamCreateInput } from "@/lib/types"
import { handleError } from "@/lib/utils"
import { getServerSession } from "next-auth"

  export const createGame = async (data: GameCreateInput) => {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      throw new Error("User not authenticated")
    }

    const team = await prisma.match.create({
      data: {
        matchNo: data.matchNo,
        name: data.name,
        roundId: data.roundId,
        tournamentId: data.tournamentId,
        mapId: data.mapId,
        startTime: data.startTime,
        endTime: data.endTime || null,
        day: data.day || null,
        ...(data.groupId && { groupId: data.groupId }),
      }
    })
    console.log(team)
    return team
  } catch (error) {
    handleError(error)
    throw new Error("Failed to create team")
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

export const getGames = async (tournmentId: string,roundId:string) => {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      throw new Error("User not authenticated")
    }

    if (!tournmentId) {
      throw new Error("Tournament ID is required")
    }

    const games = await prisma.match.findMany({
      where: { tournamentId: tournmentId,roundId:roundId },
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
      include: { tournament: true, round: true },
    })

    return games || null
    console.log(games)
  } catch (error) {
    handleError(error)
    throw new Error("Failed to fetch games")
  }
}