"use server"

import { authOptions } from "@/auth"
import { prisma } from "@/lib/prisma"
import {  PointTableCreateInput, RoundCreateInput } from "@/lib/types"
import { handleError } from "@/lib/utils"
import { getServerSession } from "next-auth"




export const createPointTable = async (data: PointTableCreateInput) => {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      throw new Error("User not authenticated")
    }

    const pointTable = await prisma.pointsTable.createMany({
      data: {
        tournamentId: data.tournamentId,
        ranks: data.ranks,
        killPoint: data.killPoint,
        pointTableName: data.pointTableName,
      },
      
    })
    
    return pointTable
  } catch (error) {
    handleError(error)
    throw new Error("Failed to create round")
  }
}



  

export const getPointsTable = async (tournamentId: string) => {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      throw new Error("User not authenticated")
    }
    if (!tournamentId) {
      throw new Error("Tournament ID is required")
    }
    const pointsTables = await prisma.pointsTable.findMany({
      where: { tournamentId },
      orderBy: { createdAt: "desc" },
      include: {
        tournament: true,
      },
    })
    return pointsTables
  } catch (error) {
    handleError(error)
    throw new Error("Failed to fetch points tables")
  }
}

export const updatePointTable = async (id: string, data: PointTableCreateInput) => {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      throw new Error("User not authenticated")
    }
    const updated = await prisma.pointsTable.update({
      where: { id },
      data: {
        ranks: data.ranks,
        killPoint: data.killPoint,
        tournamentId: data.tournamentId,
        pointTableName: data.pointTableName,
      },
      
    })
    return updated
  } catch (error) {
    handleError(error)
    throw new Error("Failed to update points table")
  }
}

export const deletePointTable = async (id: string) => {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      throw new Error("User not authenticated")
    }
    const deleted = await prisma.pointsTable.delete({
      where: { id },
    })
    return deleted
  } catch (error) {
    handleError(error)
    throw new Error("Failed to delete points table")
  }
}
  




