const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { generateResponse } = require('../services/langchain.service');

const prisma = new PrismaClient();

router.post('/', async (req, res) => {
    try {
        const { userId, message, lifestyle, personality } = req.body;

        if (!userId || !message) {
            return res.status(400).json({ error: 'Missing userId or message' });
        }


        const user = await prisma.user.upsert({
            where: { id: userId },
            update: {
                personality: personality || undefined,
            },
            create: {
                id: userId,
                personality: personality || 'Encouragement Seeker',
                usageDays: 1,
                name: `User ${userId}`,
                email: `${userId}@example.com`,
            },
        });

        // Update usage stats
        const now = new Date();
        const createdAt = new Date(user.createdAt);
        const diffTime = Math.abs(now - createdAt);
        const calculatedUsageDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));


        await prisma.user.update({
            where: { id: userId },
            data: {
                coins: { increment: 1 }
            }
        });

        let usageDays = req.body.usageDays;

        if (usageDays === undefined || usageDays === null) {
            usageDays = calculatedUsageDays;
        }

        const context = {
            personality: user.personality,
            usageDays: Number(usageDays),
            lifestyle: lifestyle || {},
        };

        const aiResponseContent = await generateResponse(userId, message, context);

        await prisma.message.create({
            data: {
                role: 'user',
                content: message,
                userId: userId,
            },
        });

        const aiMessage = await prisma.message.create({
            data: {
                role: 'ai',
                content: aiResponseContent,
                userId: userId,
            },
        });


        const updatedUser = await prisma.user.findUnique({
            where: { id: userId },
            select: { coins: true }
        });

        res.json({
            message: aiMessage.content,
            role: 'ai',
            timestamp: aiMessage.createdAt,
            coins: updatedUser.coins
        });

        // Cleanup: Keep only the last 20 messages for this user
        const oldMessages = await prisma.message.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            skip: 20,
            select: { id: true }
        });

        if (oldMessages.length > 0) {
            const idsToDelete = oldMessages.map(m => m.id);
            await prisma.message.deleteMany({
                where: {
                    id: { in: idsToDelete }
                }
            });
        }

    } catch (error) {
        console.error('Error in chat endpoint:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/history/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const messages = await prisma.message.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 20,
        });
        res.json(messages.reverse());
    } catch (error) {
        console.error('Error fetching history:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
