import { prisma } from "../../prisma/prisma";

export const createRootFolder = async (userId: number) => {
    return await prisma.folder.create({
        data: {
            foldername: "root",
            postedByUserId: userId
        }
    });
}