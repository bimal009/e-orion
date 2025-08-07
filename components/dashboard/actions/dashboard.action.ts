"use server"

import { authOptions } from "@/auth"
import { prisma } from "@/lib/prisma"
import { TournamentCreateInput } from "@/lib/types"
import { handleError } from "@/lib/utils"
import { getServerSession } from "next-auth"




export const createTournment = async (data: TournamentCreateInput & { ownerId?: string }) => {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      throw new Error("User not authenticated")
    }

    const tournament = await prisma.tournament.create({
      data: {
        name: data.name,
        logo: data.logo || "",
        ownerId: session.user.id,
        selectedTheme: data.selectedTheme
      },
      include: {
        teams: true,
      },
    })
    console.log(tournament)
    return tournament
  } catch (error) {
    handleError(error)
    throw new Error("Failed to create tournament")
  }
}

export const updateTournment = async (id: string, data: TournamentCreateInput) => {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      throw new Error("User not authenticated")
    }

    const tournament = await prisma.tournament.update({
      where: { id },
      data: {
        name: data.name,
        logo: data.logo || "",
        selectedTheme: data.selectedTheme
      },
      include: {
        teams: true,
      },
    })
    return tournament
  } catch (error) {
    handleError(error)
    throw new Error("Failed to update tournament")
  }
}


export const getTournaments = async () => {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      throw new Error("User not authenticated")
    }

    const userWithTournaments = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      include: {
        tournaments: {
          include: {
            rounds: true,
          },
        },
      },
    })

    console.log(userWithTournaments?.tournaments)

    return userWithTournaments?.tournaments || []
  } catch (error) {
    handleError(error)
    throw new Error("Failed to fetch tournaments")
  }
}

export const getTournamentsWithSearch = async (search: string) => {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      throw new Error("User not authenticated")
    }

    const tournaments = await prisma.tournament.findMany({
      where: {
        name: {
          contains: search,
          mode: 'insensitive',
        },
        ownerId: session.user.id,
      },
      include: { teams: true, rounds: true },
    })

    console.log(tournaments)

    return tournaments || []
  } catch (error) {
    handleError(error)
    throw new Error("Failed to fetch tournaments")
  }
}


export const deleteTournament = async (id: string) => {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      throw new Error("User not authenticated")
    }

    // Optional: check if the tournament belongs to the current user before deleting
    const tournament = await prisma.tournament.findUnique({
      where: { id },
      include: { teams: true },
    })

    if (!tournament || tournament.ownerId !== session.user.id) {
      throw new Error("Tournament not found or you're not authorized to delete it")
    }

    const deletedTournament = await prisma.tournament.delete({
      where: { id },
      include: {
        rounds: true,
        teams: true,
      },
    })

    return deletedTournament
  } catch (error) {
    handleError(error)
    throw new Error("Failed to delete tournament")
  }
}





