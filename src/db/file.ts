import { prisma } from "../../prisma/prisma";

export const addFile = async (filename: string, childOfFolderId: number, size: number) => {
    const createdFile = await prisma.file.create({
        data: {filename, size, childOfFolderId}
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