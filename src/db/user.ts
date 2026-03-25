import { prisma } from "../../prisma/prisma";

export const getUserFromUsername = (username: string) => {
    return prisma.user.findUnique({
        where: {
            username: username
        }
    });
}

export const getUserWithId = (user_id: number) => {
    return prisma.user.findUnique({
        where: {id: user_id}
    })
}