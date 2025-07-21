"use server"

import { authOptions } from "@/auth"
import { prisma } from "@/lib/prisma"
import { GroupCreateInput, MatchCreateInput, TeamCreateInput } from "@/lib/types"
import { handleError } from "@/lib/utils"
import { getServerSession } from "next-auth"

export const createGroup = async (data: GroupCreateInput) => {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      throw new Error("User not authenticated")
    }

    const group = await prisma.group.create({
      data: {
        name: data.name,
        tournamentId: data.tournamentId,
        roundId: data.roundId || null,
        teams: data.teams && data.teams.length > 0 ? {
          connect: data.teams.map((team) => ({ id: team.id })),
        } : undefined,
      },
      include: {
        teams: { include: { players: true } },
        matches: true,
        tournament: true,
      },
    })

    // Update isSelected field for connected teams
    if (data.teams && data.teams.length > 0) {
      await prisma.team.updateMany({
        where: {
          id: { in: data.teams.map(team => team.id) }
        },
        data: {
          isSelected: true
        }
      })
    }

    return group
  } catch (error) {
    handleError(error)
    throw new Error("Failed to create group")
  }
}

export const updateGroup = async (id: string, data: GroupCreateInput) => {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      throw new Error("User not authenticated")
    }

    // Get current teams in the group
    const currentGroup = await prisma.group.findUnique({
      where: { id },
      include: { teams: true }
    })

    if (!currentGroup) {
      throw new Error("Group not found")
    }

    const currentTeamIds = currentGroup.teams.map(team => team.id)
    const newTeamIds = data.teams?.map(team => team.id) || []

    // Find teams to remove (in current but not in new selection)
    const teamsToRemove = currentTeamIds.filter(id => !newTeamIds.includes(id))
    
    // Find teams to add (in new selection but not in current)
    const teamsToAdd = newTeamIds.filter(id => !currentTeamIds.includes(id))

    // Remove teams that are no longer selected
    if (teamsToRemove.length > 0) {
      await prisma.team.updateMany({
        where: { id: { in: teamsToRemove } },
        data: { 
          groupId: null,
          isSelected: false 
        }
      })
    }

    // Add new teams to the group
    if (teamsToAdd.length > 0) {
      await prisma.team.updateMany({
        where: { id: { in: teamsToAdd } },
        data: { 
          groupId: id,
          isSelected: true 
        }
      })
    }

    const group = await prisma.group.update({
      where: { id },
      data: {
        name: data.name,
        tournamentId: data.tournamentId,
        roundId: data.roundId || null,
      },
      include: {
        teams: { include: { players: true } },
        matches: true,
        tournament: true,
      },
    })

    return group
  } catch (error) {
    handleError(error)
    throw new Error("Failed to update group")
  }
}

export const getGroups = async (tournamentId: string) => {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      throw new Error("User not authenticated")
    }

    if (!tournamentId) {
      throw new Error("Tournament ID is required")
    }

    const groups = await prisma.group.findMany({
      where: { tournamentId },
      include: {
        tournament: true,
        teams: { include: { players: true , tournament: true } },
        matches: true,
      },
      orderBy: { id: 'asc' },
    })
    console.log(groups)

    return groups || []
  } catch (error) {
    handleError(error)
    throw new Error("Failed to fetch groups")
  }
}

export const getGroupsWithSearch = async (tournamentId: string, search: string) => {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      throw new Error("User not authenticated")
    }

    if (!tournamentId) {
      throw new Error("Tournament ID is required")
    }

    const groups = await prisma.group.findMany({
      where: {
        tournamentId,
        name: {
          contains: search,
          mode: 'insensitive',
        },
      },
      include: {
        tournament: true,
        teams: { include: { players: true } },
        matches: true,
      },
    })

    console.log(groups)

    return groups || []
  } catch (error) {
    handleError(error)
    throw new Error("Failed to fetch groups")
  }
}

export const deleteGroup = async (groupId: string) => {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      throw new Error("User not authenticated")
    }

    // First, set isSelected to false for all teams in this group
    await prisma.team.updateMany({
      where: { groupId },
      data: { 
        groupId: null,
        isSelected: false 
      }
    })

    await prisma.match.deleteMany({ where: { groupId } })
    const deletedGroup = await prisma.group.delete({
      where: { id: groupId },
      include: {
        teams: { include: { players: true } },
        matches: true,
        tournament: true,
      },
    })

      return deletedGroup
  } catch (error) {
    handleError(error)
    throw new Error("Failed to delete group")
  }
}

export const getGroupById = async (id: string) => {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      throw new Error("User not authenticated")
    }
    const group = await prisma.group.findUnique({
      where: { id },
      include: {
        tournament: true,
        teams: { include: { players: true } },
        matches: true,
      },
    })
    if (!group) throw new Error("Group not found")
    return group
  } catch (error) {
    handleError(error)
    throw new Error("Failed to fetch group")
  }
}

export const getGroupsByRoundId = async (roundId: string) => {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      throw new Error("User not authenticated")
    }
    const groups = await prisma.group.findMany({
      where: { roundId },
      include: {
        tournament: true,
        teams: { include: { players: true } },
        matches: true,
        round: true,
      },
    })
    return groups || []
  } catch (error) {
    handleError(error)
    throw new Error("Failed to fetch groups")
  }
}

export const getGroupsByGameId = async (gameId: string) => {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      throw new Error("User not authenticated")
    }
    const groups = await prisma.group.findMany({
      where: { matches: { some: { id: gameId } } },
      include: {
        tournament: true,
        teams: { include: { players: true } },
        matches: true,
      },
    })
    return groups || []
  } catch (error) {
    handleError(error)
    throw new Error("Failed to fetch groups")
  }
}