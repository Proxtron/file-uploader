import { prisma } from "../../prisma/prisma";

export const addFile = async (originalFilename: string, filename: string, postedByUserId: number, size: number) => {
    const createdFile = await prisma.file.create({
        data: {
            originalFilename, filename, postedByUserId, size
        }
    });
    return createdFile;
}

export const getFileById = async (fileId: number) => {
    return await prisma.file.findUnique({
        where: {id: fileId}
    });
}