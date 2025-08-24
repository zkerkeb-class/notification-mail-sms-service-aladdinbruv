import { Request, Response } from 'express';
import * as controller from '../controllers/notification.controller';
import { userPushTokens } from '../controllers/notification.controller';
import * as notificationService from '../services/notification.service';

// Mock the notification service
jest.mock('../services/notification.service');

describe('NotificationController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    
    req = {
      body: {}
    };
    
    res = {
      status: mockStatus,
      json: mockJson
    };

    jest.clearAllMocks();
  });

  describe('handleSendSms', () => {
    it('sends SMS successfully', async () => {
      req.body = { to: '+1234567890', body: 'Test message' };
      (notificationService.sendSms as jest.Mock).mockResolvedValue({ sid: 'SM123' });

      await controller.handleSendSms(req as Request, res as Response);

      expect(notificationService.sendSms).toHaveBeenCalledWith('+1234567890', 'Test message');
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({ message: 'SMS sent successfully.' });
    });

    it('returns 400 when "to" is missing', async () => {
      req.body = { body: 'Test message' };

      await controller.handleSendSms(req as Request, res as Response);

      expect(notificationService.sendSms).not.toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Missing "to" or "body" in request.' });
    });

    it('returns 400 when "body" is missing', async () => {
      req.body = { to: '+1234567890' };

      await controller.handleSendSms(req as Request, res as Response);

      expect(notificationService.sendSms).not.toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Missing "to" or "body" in request.' });
    });

    it('returns 500 when service throws error', async () => {
      req.body = { to: '+1234567890', body: 'Test message' };
      (notificationService.sendSms as jest.Mock).mockRejectedValue(new Error('Service error'));

      await controller.handleSendSms(req as Request, res as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Failed to send SMS.' });
    });
  });

  describe('handleSendEmail', () => {
    it('sends email successfully', async () => {
      req.body = { to: 'test@example.com', subject: 'Test Subject', html: '<p>Test</p>' };
      (notificationService.sendEmail as jest.Mock).mockResolvedValue(undefined);

      await controller.handleSendEmail(req as Request, res as Response);

      expect(notificationService.sendEmail).toHaveBeenCalledWith('test@example.com', 'Test Subject', '<p>Test</p>');
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({ message: 'Email sent successfully.' });
    });

    it('returns 400 when "to" is missing', async () => {
      req.body = { subject: 'Test Subject', html: '<p>Test</p>' };

      await controller.handleSendEmail(req as Request, res as Response);

      expect(notificationService.sendEmail).not.toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Missing "to", "subject", or "html" in request.' });
    });

    it('returns 400 when "subject" is missing', async () => {
      req.body = { to: 'test@example.com', html: '<p>Test</p>' };

      await controller.handleSendEmail(req as Request, res as Response);

      expect(notificationService.sendEmail).not.toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Missing "to", "subject", or "html" in request.' });
    });

    it('returns 400 when "html" is missing', async () => {
      req.body = { to: 'test@example.com', subject: 'Test Subject' };

      await controller.handleSendEmail(req as Request, res as Response);

      expect(notificationService.sendEmail).not.toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Missing "to", "subject", or "html" in request.' });
    });

    it('returns 500 when service throws error', async () => {
      req.body = { to: 'test@example.com', subject: 'Test Subject', html: '<p>Test</p>' };
      (notificationService.sendEmail as jest.Mock).mockRejectedValue(new Error('Service error'));

      await controller.handleSendEmail(req as Request, res as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Failed to send email.' });
    });
  });

  describe('handleSendPushNotification', () => {
    beforeEach(() => {
      // Setup push tokens for testing
      userPushTokens['user123'] = ['token1', 'token2'];
    });

    it('sends push notification successfully', async () => {
      req.body = { userId: 'user123', title: 'Test Title', body: 'Test Body', data: { key: 'value' } };
      (notificationService.sendPushNotification as jest.Mock).mockResolvedValue([{ id: 'ticket1' }, { id: 'ticket2' }]);

      await controller.handleSendPushNotification(req as Request, res as Response);

      expect(notificationService.sendPushNotification).toHaveBeenCalledWith(['token1', 'token2'], 'Test Title', 'Test Body', { key: 'value' });
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({ 
        message: 'Push notification sent successfully.',
        tickets: 2 
      });
    });

    it('returns 400 when "userId" is missing', async () => {
      req.body = { title: 'Test Title', body: 'Test Body' };

      await controller.handleSendPushNotification(req as Request, res as Response);

      expect(notificationService.sendPushNotification).not.toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Missing "userId", "title", or "body" in request.' });
    });

    it('returns 400 when "title" is missing', async () => {
      req.body = { userId: 'user123', body: 'Test Body' };

      await controller.handleSendPushNotification(req as Request, res as Response);

      expect(notificationService.sendPushNotification).not.toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Missing "userId", "title", or "body" in request.' });
    });

    it('returns 400 when "body" is missing', async () => {
      req.body = { userId: 'user123', title: 'Test Title' };

      await controller.handleSendPushNotification(req as Request, res as Response);

      expect(notificationService.sendPushNotification).not.toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Missing "userId", "title", or "body" in request.' });
    });

    it('returns 404 when no push tokens found for user', async () => {
      req.body = { userId: 'unknown_user', title: 'Test Title', body: 'Test Body' };

      await controller.handleSendPushNotification(req as Request, res as Response);

      expect(notificationService.sendPushNotification).not.toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ error: 'No push tokens found for user.' });
    });

    it('returns 500 when service throws error', async () => {
      req.body = { userId: 'user123', title: 'Test Title', body: 'Test Body' };
      (notificationService.sendPushNotification as jest.Mock).mockRejectedValue(new Error('Service error'));
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      await controller.handleSendPushNotification(req as Request, res as Response);

      expect(consoleSpy).toHaveBeenCalledWith('Push notification error:', expect.any(Error));
      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Failed to send push notification.' });
      consoleSpy.mockRestore();
    });
  });

  describe('handleRegisterPushToken', () => {
    beforeEach(() => {
      // Reset tokens
      Object.keys(userPushTokens).forEach(key => delete userPushTokens[key]);
    });

    it('registers new push token successfully', async () => {
      req.body = { userId: 'user123', pushToken: 'token123' };
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await controller.handleRegisterPushToken(req as Request, res as Response);

      expect(userPushTokens['user123']).toContain('token123');
      expect(consoleSpy).toHaveBeenCalledWith('Registered push token for user user123: token123');
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({ message: 'Push token registered successfully.' });
      consoleSpy.mockRestore();
    });

    it('does not duplicate existing tokens', async () => {
      userPushTokens['user123'] = ['token123'];
      req.body = { userId: 'user123', pushToken: 'token123' };

      await controller.handleRegisterPushToken(req as Request, res as Response);

      expect(userPushTokens['user123']).toEqual(['token123']);
      expect(userPushTokens['user123'].length).toBe(1);
    });

    it('adds new token to existing user tokens', async () => {
      userPushTokens['user123'] = ['token123'];
      req.body = { userId: 'user123', pushToken: 'token456' };

      await controller.handleRegisterPushToken(req as Request, res as Response);

      expect(userPushTokens['user123']).toContain('token123');
      expect(userPushTokens['user123']).toContain('token456');
      expect(userPushTokens['user123'].length).toBe(2);
    });

    it('returns 400 when "userId" is missing', async () => {
      req.body = { pushToken: 'token123' };

      await controller.handleRegisterPushToken(req as Request, res as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Missing "userId" or "pushToken" in request.' });
    });

    it('returns 400 when "pushToken" is missing', async () => {
      req.body = { userId: 'user123' };

      await controller.handleRegisterPushToken(req as Request, res as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Missing "userId" or "pushToken" in request.' });
    });

    // Note: Error case for push token registration is difficult to test reliably 
    // since userPushTokens is a simple object. In production, this would use a database
    // where connection errors could occur.
  });

  describe('sendWelcomeBackNotification', () => {
    beforeEach(() => {
      userPushTokens['user123'] = ['token1', 'token2'];
    });

    it('sends welcome back notification when user has tokens', async () => {
      (notificationService.sendPushNotification as jest.Mock).mockResolvedValue([]);
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await controller.sendWelcomeBackNotification('user123');

      expect(notificationService.sendPushNotification).toHaveBeenCalledWith(
        ['token1', 'token2'],
        'Welcome back skater! 🛹',
        'Ready to discover some epic spots?',
        { type: 'welcome_back' }
      );
      expect(consoleSpy).toHaveBeenCalledWith('Welcome back notification sent to user user123');
      consoleSpy.mockRestore();
    });

    it('does nothing when user has no tokens', async () => {
      await controller.sendWelcomeBackNotification('unknown_user');

      expect(notificationService.sendPushNotification).not.toHaveBeenCalled();
    });

    it('handles service errors gracefully', async () => {
      (notificationService.sendPushNotification as jest.Mock).mockRejectedValue(new Error('Service error'));
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      await controller.sendWelcomeBackNotification('user123');

      expect(consoleSpy).toHaveBeenCalledWith('Failed to send welcome back notification:', expect.any(Error));
      consoleSpy.mockRestore();
    });
  });
});
