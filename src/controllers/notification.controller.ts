import { Request, Response } from 'express';
import * as notificationService from '../services/notification.service';

// Simple in-memory store for push tokens (in production, use a database)
export const userPushTokens: Record<string, string[]> = {};

export const handleSendSms = async (req: Request, res: Response) => {
  const { to, body } = req.body;
  if (!to || !body) {
    return res.status(400).json({ error: 'Missing "to" or "body" in request.' });
  }

  try {
    await notificationService.sendSms(to, body);
    res.status(200).json({ message: 'SMS sent successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send SMS.' });
  }
};

export const handleSendEmail = async (req: Request, res: Response) => {
    const { to, subject, html } = req.body;
    if (!to || !subject || !html) {
        return res.status(400).json({ error: 'Missing "to", "subject", or "html" in request.' });
    }

    try {
        await notificationService.sendEmail(to, subject, html);
        res.status(200).json({ message: 'Email sent successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to send email.' });
    }
};

export const handleSendPushNotification = async (req: Request, res: Response) => {
    const { userId, title, body, data } = req.body;
    
    if (!userId || !title || !body) {
        return res.status(400).json({ error: 'Missing "userId", "title", or "body" in request.' });
    }

    try {
        const tokens = userPushTokens[userId] || [];
        if (tokens.length === 0) {
            return res.status(404).json({ error: 'No push tokens found for user.' });
        }

        const tickets = await notificationService.sendPushNotification(tokens, title, body, data);
        res.status(200).json({ 
            message: 'Push notification sent successfully.',
            tickets: tickets.length 
        });
    } catch (error) {
        console.error('Push notification error:', error);
        res.status(500).json({ error: 'Failed to send push notification.' });
    }
};

export const handleRegisterPushToken = async (req: Request, res: Response) => {
    const { userId, pushToken } = req.body;
    
    if (!userId || !pushToken) {
        return res.status(400).json({ error: 'Missing "userId" or "pushToken" in request.' });
    }

    try {
        // Initialize array if it doesn't exist
        if (!userPushTokens[userId]) {
            userPushTokens[userId] = [];
        }
        
        // Add token if it's not already registered
        if (!userPushTokens[userId].includes(pushToken)) {
            userPushTokens[userId].push(pushToken);
        }

        console.log(`Registered push token for user ${userId}: ${pushToken}`);
        res.status(200).json({ message: 'Push token registered successfully.' });
    } catch (error) {
        console.error('Token registration error:', error);
        res.status(500).json({ error: 'Failed to register push token.' });
    }
};

// Helper function to send welcome back notification
export const sendWelcomeBackNotification = async (userId: string) => {
    try {
        const tokens = userPushTokens[userId] || [];
        if (tokens.length > 0) {
            await notificationService.sendPushNotification(
                tokens, 
                'Welcome back skater! 🛹', 
                'Ready to discover some epic spots?',
                { type: 'welcome_back' }
            );
            console.log(`Welcome back notification sent to user ${userId}`);
        }
    } catch (error) {
        console.error('Failed to send welcome back notification:', error);
    }
}; 