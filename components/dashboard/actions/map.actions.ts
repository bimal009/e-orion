"use server"
import { prisma } from "@/lib/prisma"
import { handleError } from "@/lib/utils"

export const getMaps=async()=>{
    try {
        const maps=await prisma.map.findMany({
            include:{
                matches:true
            }
        })
        return maps
    } catch (error) {
        handleError(error)
        throw new Error("Failed to get maps")
    }
}