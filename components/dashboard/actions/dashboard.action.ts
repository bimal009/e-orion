"use server"

import { authOptions } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Tournament } from "@/lib/types"
import { handleError } from "@/lib/utils"
import { getServerSession } from "next-auth"

export const createTournment = async (data: Tournament) => {
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
      },
    })
console.log(tournament)
    return tournament
  } catch (error) {
    handleError(error)
    throw new Error("Failed to create tournament")
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
          tournaments: true, // assumes relation field in Prisma schema is called `tournaments`
        },
      })
  
      console.log(userWithTournaments?.tournaments)
  
      return userWithTournaments?.tournaments || []
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
      })
  
      if (!tournament || tournament.ownerId !== session.user.id) {
        throw new Error("Tournament not found or you're not authorized to delete it")
      }
  
      const deletedTournament = await prisma.tournament.delete({
        where: { id },
      })
  
      return deletedTournament
    } catch (error) {
      handleError(error)
      throw new Error("Failed to delete tournament")
    }
  }
  




