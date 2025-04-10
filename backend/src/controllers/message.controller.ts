import { Request, Response } from "express";
import prisma from "../db/prisma.js";

export const sendMessage = async (req: Request, res: Response) => {
    try {
        const { message } = req.body;
        const { id: reciverId } = req.params;
        const senderId = req.user.id;
        let conversation = await prisma.conversation.findFirst({
            where: {
                participantIds: {
                    hasEvery: [senderId, reciverId]
                }
            }
        })
        if (!conversation) {
            conversation = await prisma.conversation.create({
                data: {
                    participantIds: {
                        set: [senderId, reciverId]
                    }
                }
            })
        }
        const newMessage = await prisma.message.create({
            data: {
                senderId,
                body: message,
                conversationId: conversation.id,
            }
        })
        if (newMessage) {
            conversation = await prisma.conversation.update({
                where: {
                    id: conversation.id
                },
                data: {
                    messages: {
                        connect: { id: newMessage.id }
                    }
                }
            })
        }

        res.status(201).json(newMessage)

    } catch (error: any) {
        console.log("Error in sendMessage controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
export const getMessage = async (req: Request, res: Response) => {
    try {
        const { id: reciverId } = req.params;
        const senderId = req.user.id;

        const conversation = await prisma.conversation.findFirst({
            where: {
                participantIds: {
                    hasEvery: [senderId, reciverId]
                }
            },
            include: {
                messages: {
                    orderBy: {
                        createdAt: 'asc'
                    }
                }
            }
        })

        if (!conversation) {
            return res.status(200).json([])
        }
        res.status(200).json(conversation.messages)

    } catch (error: any) {
        console.log("Error in sendMessage controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
export const getConversations = async (req: Request, res: Response) => {
    try {

        const users = await prisma.user.findMany({
            where: {
                id: {
                    not: req.user.id
                }
            },
            select:{
                id:true,
                fullName:true,
                profilePic:true,
            }
        })
        res.status(200).json(users)
    } catch (error: any) {
        console.log("Error in getConversations controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}