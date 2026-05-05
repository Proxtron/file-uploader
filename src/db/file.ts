import { prisma } from "../../prisma/prisma.js";

export const addFile = async (filename: string, childOfFolderId: number, size: number, supabasePath: string) => {
    const createdFile = await prisma.file.create({
        data: {filename, size, childOfFolderId, supabasePath}
    });
    return createdFile;
}

export const getFileById = async (fileId: number) => {
    return await prisma.file.findUnique({
        where: {id: fileId}
    });
}

export const deleteFile = async (fileId: number) => {
    return await prisma.file.delete({
        where: {id: fileId}
    })
}