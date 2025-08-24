import request from 'supertest';
import express from 'express';
import notificationRoutes from '../routes/notification.routes';
import * as notificationController from '../controllers/notification.controller';

// Mock the controller
jest.mock('../controllers/notification.controller');

const app = express();
app.use(express.json());
app.use('/api/notifications', notificationRoutes);

describe('Notification Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/notifications/sms', () => {
    it('calls handleSendSms controller', async () => {
      const mockHandleSendSms = notificationController.handleSendSms as jest.Mock;
      mockHandleSendSms.mockImplementation((req, res) => {
        res.status(200).json({ message: 'SMS sent successfully.' });
      });

      const response = await request(app)
        .post('/api/notifications/sms')
        .send({ to: '+1234567890', body: 'Test message' });

      expect(mockHandleSendSms).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'SMS sent successfully.' });
    });

    it('accepts POST method', async () => {
      const mockHandleSendSms = notificationController.handleSendSms as jest.Mock;
      mockHandleSendSms.mockImplementation((req, res) => {
        res.status(200).json({ message: 'SMS sent successfully.' });
      });

      const response = await request(app)
        .post('/api/notifications/sms')
        .send({ to: '+1234567890', body: 'Test message' });

      expect(response.status).toBe(200);
    });

    it('rejects non-POST methods', async () => {
      const response = await request(app)
        .get('/api/notifications/sms');

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/notifications/email', () => {
    it('calls handleSendEmail controller', async () => {
      const mockHandleSendEmail = notificationController.handleSendEmail as jest.Mock;
      mockHandleSendEmail.mockImplementation((req, res) => {
        res.status(200).json({ message: 'Email sent successfully.' });
      });

      const response = await request(app)
        .post('/api/notifications/email')
        .send({ to: 'test@example.com', subject: 'Test', html: '<p>Test</p>' });

      expect(mockHandleSendEmail).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Email sent successfully.' });
    });

    it('accepts POST method', async () => {
      const mockHandleSendEmail = notificationController.handleSendEmail as jest.Mock;
      mockHandleSendEmail.mockImplementation((req, res) => {
        res.status(200).json({ message: 'Email sent successfully.' });
      });

      const response = await request(app)
        .post('/api/notifications/email')
        .send({ to: 'test@example.com', subject: 'Test', html: '<p>Test</p>' });

      expect(response.status).toBe(200);
    });

    it('rejects non-POST methods', async () => {
      const response = await request(app)
        .get('/api/notifications/email');

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/notifications/push', () => {
    it('calls handleSendPushNotification controller', async () => {
      const mockHandleSendPushNotification = notificationController.handleSendPushNotification as jest.Mock;
      mockHandleSendPushNotification.mockImplementation((req, res) => {
        res.status(200).json({ message: 'Push notification sent successfully.', tickets: 1 });
      });

      const response = await request(app)
        .post('/api/notifications/push')
        .send({ userId: 'user123', title: 'Test', body: 'Test body' });

      expect(mockHandleSendPushNotification).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Push notification sent successfully.', tickets: 1 });
    });

    it('accepts POST method', async () => {
      const mockHandleSendPushNotification = notificationController.handleSendPushNotification as jest.Mock;
      mockHandleSendPushNotification.mockImplementation((req, res) => {
        res.status(200).json({ message: 'Push notification sent successfully.', tickets: 1 });
      });

      const response = await request(app)
        .post('/api/notifications/push')
        .send({ userId: 'user123', title: 'Test', body: 'Test body' });

      expect(response.status).toBe(200);
    });

    it('rejects non-POST methods', async () => {
      const response = await request(app)
        .get('/api/notifications/push');

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/notifications/push/register', () => {
    it('calls handleRegisterPushToken controller', async () => {
      const mockHandleRegisterPushToken = notificationController.handleRegisterPushToken as jest.Mock;
      mockHandleRegisterPushToken.mockImplementation((req, res) => {
        res.status(200).json({ message: 'Push token registered successfully.' });
      });

      const response = await request(app)
        .post('/api/notifications/push/register')
        .send({ userId: 'user123', pushToken: 'token123' });

      expect(mockHandleRegisterPushToken).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Push token registered successfully.' });
    });

    it('accepts POST method', async () => {
      const mockHandleRegisterPushToken = notificationController.handleRegisterPushToken as jest.Mock;
      mockHandleRegisterPushToken.mockImplementation((req, res) => {
        res.status(200).json({ message: 'Push token registered successfully.' });
      });

      const response = await request(app)
        .post('/api/notifications/push/register')
        .send({ userId: 'user123', pushToken: 'token123' });

      expect(response.status).toBe(200);
    });

    it('rejects non-POST methods', async () => {
      const response = await request(app)
        .get('/api/notifications/push/register');

      expect(response.status).toBe(404);
    });
  });

  describe('Route not found', () => {
    it('returns 404 for undefined routes', async () => {
      const response = await request(app)
        .post('/api/notifications/undefined-route');

      expect(response.status).toBe(404);
    });
  });
});
