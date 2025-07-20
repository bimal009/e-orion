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
        numberOfDays: data.numberOfDays || 0,
      },
      include: {
        teams: true,
        matches: true,
        groups: true,
        tournament: {
          include: {
            teams: true,
            rounds: true,
            groups: true,
          }
        }
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
        numberOfDays: data.numberOfDays || 0,

      },
      include: {
        tournament: true,
        matches: true,
        teams: true,
        groups: true,
      },
    })
    return round
  } catch (error) {
    handleError(error)
    throw new Error("Failed to update round")
  }
}


export const getRounds = async (tournmentId: string) => {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      throw new Error("User not authenticated")
    }
    console.log(tournmentId)

    if (!tournmentId) {
      throw new Error("Tournament ID is required")
    }

    const rounds = await prisma.round.findMany({
      where: { tournamentId: tournmentId },
      include: { tournament: true, teams: true, matches: true, groups: true },
      orderBy: { id: 'asc' },
    })

    return rounds || []
  } catch (error) {
    handleError(error)
    throw  new Error("Failed to fetch rounds")
  }
}

  export const getRoundsWithSearch = async (tournamentId: string, search: string) => {
    try {
      const session = await getServerSession(authOptions)
  
      if (!session?.user?.id) {
        throw new Error("User not authenticated")
      }
  
      const rounds = await prisma.round.findMany({
        where: {
          tournamentId,
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
        include: { teams: true, groups: true },
      })
  
        console.log(rounds)
  
      return rounds || []
    } catch (error) {
      handleError(error)
      throw new Error("Failed to fetch rounds")
    }
  }


  export const deleteRound = async (roundId: string) => { 
    try {
      const session = await getServerSession(authOptions)
  
      if (!session?.user?.id) {
        throw new Error("User not authenticated")
      }
  
      // Check if round exists before deleting
      const round = await prisma.round.findUnique({
        where: { id: roundId },
        include: { 
          matches: true, 
          groups: {
            include: {
              teams: true
            }
          },
          teams: true
        }
      })

      if (!round) {
        throw new Error("Round not found")
      }

      // Clean up teams associated with this round
      if (round.teams && round.teams.length > 0) {
        await prisma.team.updateMany({
          where: { roundId: roundId },
          data: { 
            roundId: null,
            isSelected: false,
            groupId: null 
          }
        })
      }

      // Clean up teams in groups of this round
      if (round.groups && round.groups.length > 0) {
        // Get all team IDs from groups in this round
        const teamIdsInGroups = round.groups.flatMap(group => 
          group.teams.map(team => team.id)
        )
        
        if (teamIdsInGroups.length > 0) {
          await prisma.team.updateMany({
            where: { 
              id: { in: teamIdsInGroups }
            },
            data: { 
              roundId: null,
              isSelected: false,
              groupId: null 
            }
          })
        }
      }

      // Delete all matches in this round
      if (round.matches && round.matches.length > 0) {
        await prisma.match.deleteMany({
          where: { roundId: roundId }
        })
      }

      // Delete all groups in this round
      if (round.groups && round.groups.length > 0) {
        await prisma.group.deleteMany({
          where: { roundId: roundId }
        })
      }
  
      console.log("Round to delete:", round)
      console.log("Matches in round:", round.matches?.length || 0)
      console.log("Groups in round:", round.groups?.length || 0)
  
   
      const deletedRound = await prisma.round.delete({
        where: { id: roundId },
        include: { 
          matches: true, 
          groups: true
        },
      })

      console.log("Successfully deleted round:", deletedRound)
  
      return deletedRound
    } catch (error) {
      console.error("Error deleting round:", error)
      handleError(error)
      throw new Error("Failed to delete round")
    }
  }
  




