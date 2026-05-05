import { prisma } from "../../prisma/prisma.js";

export const createRootFolder = async (userId: number) => {
    return await prisma.folder.create({
        data: {
            foldername: "root",
            postedByUserId: userId
        }
    });
}

export const getRootFolderId = async (userId: number) => {
    return await prisma.folder.findFirst({
        select: {id: true},
        where: {postedByUserId: userId, foldername: "root", childOfFolderId: null}
    });
}

export const getChildrenOfFolder = async (folderId: number, userId: number) => {
    return await prisma.folder.findUnique({
        where: {id: folderId, postedByUserId: userId},
        include: {files: true, subFolders: true},
    })
}

export const getChildrenOfFolderWithoutUser = async (folderId: number) => {
    return await prisma.folder.findUnique({
        where: {id: folderId},
        include: {files: true, subFolders: true},
    });
}

export const insertFolder = async (foldername: string, childOfFolderId: number, postedByUserId: number) => {
    return await prisma.folder.create({
        data: {foldername, childOfFolderId, postedByUserId}
    });
}

export const deleteFolder = async (folderId: number, userId: number) => {
    return await prisma.folder.delete({
        where: {id: folderId, postedByUserId: userId}
    })
}

export const updateFolder = async (newFolderName: string, folderId: number, postedByUserId: number) => {
    return await prisma.folder.update({
        data: {foldername: newFolderName},
        where: {id: folderId, postedByUserId: postedByUserId}
    })
}