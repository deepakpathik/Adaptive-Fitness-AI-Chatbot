const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { generateResponse } = require('../services/langchain.service');

const prisma = new PrismaClient();

router.post('/', async (req, res) => {
    try {
        const { userId, message, lifestyle } = req.body;

        if (!userId || !message) {
            return res.status(400).json({ error: 'Missing userId or message' });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const now = new Date();
        const createdAt = new Date(user.createdAt);
        const diffTime = Math.abs(now - createdAt);
        const usageDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        const context = {
            personality: user.personality,
            usageDays: usageDays,
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

        res.json({
            message: aiMessage.content,
            role: 'ai',
            timestamp: aiMessage.createdAt,
        });

    } catch (error) {
        console.error('Error in chat endpoint:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
