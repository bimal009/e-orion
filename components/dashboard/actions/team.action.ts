"use server"

import { authOptions } from "@/auth"
import { prisma } from "@/lib/prisma"
import { TeamCreateInput } from "@/lib/types"
import { handleError } from "@/lib/utils"
import { getServerSession } from "next-auth"

export const createTeam = async (data: TeamCreateInput) => {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      throw new Error("User not authenticated")
    }

    const team = await prisma.team.create({
      data: {
        name: data.name,
        tournamentId: data.tournamentId,
        logo: data.logo || null,
        teamTag: data.teamTag ?? null,
        email: data.email || null,
        phone: data.phone || null,
        // Create new players instead of connecting existing ones
        players: data.players && data.players.length > 0 ? {
          create: data.players.map((player) => ({
            name: player.name,
            ign: player.ign,
            role: player.role || null,
            image: player.image || null,
            email: player.email || null,
            phone: player.phone || null,
          })),
        } : undefined,
      },
      include: {
        tournament: true,
        players: true,
        round: true,
      },
    })
    console.log(team)
    return team
  } catch (error) {
    handleError(error)
    throw new Error("Failed to create team")
  }
}

export const updateTeam = async (id: string, data: TeamCreateInput) => {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      throw new Error("User not authenticated")
    }

    const currentTeam = await prisma.team.findUnique({
      where: { id },
      include: { players: true },
    })

    if (!currentTeam) {
      throw new Error("Team not found")
    }

    // Delete existing players first
    await prisma.player.deleteMany({
      where: { teamId: id },
    })

    // Update the team with new players
    const team = await prisma.team.update({
      where: { id },
      data: {
        name: data.name,
        tournamentId: data.tournamentId,
        logo: data.logo || null,
        groupId: data.groupId || null,
        roundId: data.roundId || null,
        teamTag: data.teamTag ?? null,
        email: data.email || null,
        phone: data.phone || null,
        // Create new players
        players: data.players && data.players.length > 0 ? {
          create: data.players.map((player) => ({
            name: player.name,
            ign: player.ign,
            role: player.role || null,
            image: player.image || null,
            email: player.email || null,
            phone: player.phone || null,
          })),
        } : undefined,
      },
      include: {
        tournament: true,
        players: true,
        round: true,
      },
    })
    return team
  } catch (error) {
    handleError(error)
    throw new Error("Failed to update team")
  }
}

export const getTeams = async (tournmentId: string) => {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      throw new Error("User not authenticated")
    }

    if (!tournmentId) {
      throw new Error("Tournament ID is required")
    }

    const teams = await prisma.team.findMany({
      where: { tournamentId: tournmentId },
      include: { tournament: true, players: true, round: true },
      orderBy: { id: 'asc' },
    })
    return teams || []
  } catch (error) {
    handleError(error)
    throw new Error("Failed to fetch teams")
  }
}

export const getTeamsWithPagination = async (tournmentId: string, page: number, limit: number) => {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      throw new Error("User not authenticated")
    }

    if (!tournmentId) {
      throw new Error("Tournament ID is required")
    }

    // Get total count
    const total = await prisma.team.count({
      where: { tournamentId: tournmentId },
    })

    // Get paginated teams
    const teams = await prisma.team.findMany({
      where: { tournamentId: tournmentId },
      include: { tournament: true, players: true },
      orderBy: { id: 'asc' },
      skip: (page - 1) * limit,
      take: limit,
    })

    return {
      teams,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  } catch (error) {
    handleError(error)
    throw new Error("Failed to fetch teams")
  }
}

export const getTeamsWithSearch = async (tournmentId: string, search: string) => {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      throw new Error("User not authenticated")
    }

    if (!tournmentId) {
      throw new Error("Tournament ID is required")
    }

    const teams = await prisma.team.findMany({
      where: {
        tournamentId: tournmentId,
        name: {
          contains: search,
          mode: 'insensitive',
        },
      },
      include: { players: true },
    })

    console.log(teams)

    return teams || []
  } catch (error) {
    handleError(error)
    throw new Error("Failed to fetch teams")
  }
}

export const deleteTeam = async (teamId: string) => {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      throw new Error("User not authenticated")
    }

    // Optional: check if the tournament belongs to the current user before deleting
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: { players: true },
    })

    if (!team || !session.user.id) {
      throw new Error("Team not found or you're not authorized to delete it")
    }

    // Delete players first (if not using CASCADE)
    await prisma.player.deleteMany({
      where: { teamId: teamId },
    })

    // Then delete the team
    const deletedTeam = await prisma.team.delete({
      where: { id: teamId },
      include: { players: true },
    })

    return deletedTeam
  } catch (error) {
    handleError(error)
    throw new Error("Failed to delete team")
  }
}

export const getTeamById = async (id: string) => {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      throw new Error("User not authenticated")
    }
    const team = await prisma.team.findUnique({
      where: { id },
      include: { tournament: true, players: true, round: true, group: true },
    })
    if (!team) throw new Error("Team not found")
    return team
  } catch (error) {
    handleError(error)
    throw new Error("Failed to fetch team")
  }
}
