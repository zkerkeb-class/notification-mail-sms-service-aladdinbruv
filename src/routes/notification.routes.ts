import { Router } from 'express';
import { 
    handleSendSms, 
    handleSendEmail, 
    handleSendPushNotification,
    handleRegisterPushToken 
} from '../controllers/notification.controller';

const router = Router();

// Route to handle sending SMS
router.post('/sms', handleSendSms);

// Route to handle sending Email
router.post('/email', handleSendEmail);

// Route to handle sending push notifications
router.post('/push', handleSendPushNotification);

// Route to register push tokens
router.post('/push/register', handleRegisterPushToken);

export default router;