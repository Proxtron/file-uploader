import { prisma } from "../../prisma/prisma.js";

export const getUserFromUsername = async (username: string) => {
    return await prisma.user.findUnique({
        where: {
            username: username
        }
    });
}

export const getUserWithId = async (user_id: number) => {
    return await prisma.user.findUnique({
        where: {id: user_id},
        include: {folders: true}
    })
}

export const addUser = async (username: string, password: string) => {
    return await prisma.user.create({
        data: {
            username, password
        }
    })
}