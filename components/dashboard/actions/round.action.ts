"use server"

import { authOptions } from "@/auth"
import { prisma } from "@/lib/prisma"
import {  RoundCreateInput } from "@/lib/types"
import { handleError } from "@/lib/utils"
import { getServerSession } from "next-auth"




export const createRound = async (data: RoundCreateInput) => {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      throw new Error("User not authenticated")
    }

    const round = await prisma.round.create({
      data: {
        name: data.name,
        tournamentId: data.tournamentId,
        numberOfMatches: data.numberOfMatches,
      },
    })
    console.log(round)
    return round
  } catch (error) {
    handleError(error)
    throw new Error("Failed to create round")
  }
}

  export const updateRound = async (id: string, data: RoundCreateInput) => {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      throw new Error("User not authenticated")
    }

    const round = await prisma.round.update({
      where: { id },
      data: {
        name: data.name,
          tournamentId: data.tournamentId,
          numberOfMatches: data.numberOfMatches,
        },
        include: {
          tournament: true,
          matches: true,
        },

    })
    return round
  } catch (error) {
    handleError(error)
    throw new Error("Failed to update tournament")
  }
}


export const getRounds = async () => {
    try {
      const session = await getServerSession(authOptions)
  
      if (!session?.user?.id) {
        throw new Error("User not authenticated")
      }
  
      const rounds = await prisma.round.findMany({
        where: { tournament: { ownerId: session.user.id } },
        include: { tournament: true },
        orderBy: { id: 'asc' },
      })
  
  
      return rounds || []
    } catch (error) {
      handleError(error)
      throw new Error("Failed to fetch tournaments")
    }
  }

  export const getRoundsWithSearch = async (search: string) => {
    try {
      const session = await getServerSession(authOptions)
  
      if (!session?.user?.id) {
        throw new Error("User not authenticated")
      }
  
      const rounds = await prisma.round.findMany({
        where: {
          name: {
            contains: search,
            mode: 'insensitive',
          },
          tournament: {
            ownerId: session.user.id,
          },
        },
      })
  
        console.log(rounds)
  
      return rounds || []
    } catch (error) {
      handleError(error)
      throw new Error("Failed to fetch tournaments")
    }
  }


  export const deleteRound = async (roundId: string) => { 
    try {
      const session = await getServerSession(authOptions)
  
      if (!session?.user?.id) {
        throw new Error("User not authenticated")
      }
  
      // Optional: check if the tournament belongs to the current user before deleting
      const round = await prisma.round.findUnique({
        where: { id: roundId },
      })
  
      if (!round || !session.user.id) {
        throw new Error("Round not found or you're not authorized to delete it")
      }
  
      const deletedRound = await prisma.round.delete({
        where: { id: roundId },
      })
  
      return deletedRound
    } catch (error) {
      handleError(error)
      throw new Error("Failed to delete round")
    }
  }
  




