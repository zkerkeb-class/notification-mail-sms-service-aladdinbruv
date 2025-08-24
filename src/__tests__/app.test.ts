import request from 'supertest';
import app from '../app';
import * as notificationController from '../controllers/notification.controller';

// Mock the controller
jest.mock('../controllers/notification.controller');

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Express App Configuration', () => {
    it('has CORS enabled', async () => {
      const mockHandleSendSms = notificationController.handleSendSms as jest.Mock;
      mockHandleSendSms.mockImplementation((req, res) => {
        res.status(200).json({ message: 'SMS sent successfully.' });
      });

      const response = await request(app)
        .post('/api/notifications/sms')
        .set('Origin', 'http://localhost:3000')
        .send({ to: '+1234567890', body: 'Test' });

      expect(response.headers['access-control-allow-origin']).toBeDefined();
    });

    it('parses JSON requests', async () => {
      const mockHandleSendSms = notificationController.handleSendSms as jest.Mock;
      mockHandleSendSms.mockImplementation((req, res) => {
        // Check that req.body is properly parsed
        expect(req.body).toEqual({ to: '+1234567890', body: 'Test message' });
        res.status(200).json({ message: 'SMS sent successfully.' });
      });

      await request(app)
        .post('/api/notifications/sms')
        .send({ to: '+1234567890', body: 'Test message' });

      expect(mockHandleSendSms).toHaveBeenCalled();
    });

    it('mounts notification routes at /api/notifications', async () => {
      const mockHandleSendSms = notificationController.handleSendSms as jest.Mock;
      mockHandleSendSms.mockImplementation((req, res) => {
        res.status(200).json({ message: 'SMS sent successfully.' });
      });

      const response = await request(app)
        .post('/api/notifications/sms')
        .send({ to: '+1234567890', body: 'Test' });

      expect(response.status).toBe(200);
      expect(mockHandleSendSms).toHaveBeenCalled();
    });

    it('returns 404 for unmounted routes', async () => {
      const response = await request(app)
        .get('/api/unmounted');

      expect(response.status).toBe(404);
    });

    it('handles malformed JSON gracefully', async () => {
      const response = await request(app)
        .post('/api/notifications/sms')
        .set('Content-Type', 'application/json')
        .send('{ invalid json }');

      expect(response.status).toBe(400);
    });
  });

  describe('Health check functionality', () => {
    it('app exports correctly', () => {
      expect(app).toBeDefined();
      expect(typeof app).toBe('function');
    });

    it('handles preflight OPTIONS requests', async () => {
      const response = await request(app)
        .options('/api/notifications/sms')
        .set('Origin', 'http://localhost:3000')
        .set('Access-Control-Request-Method', 'POST');

      // Should be handled by CORS middleware
      expect(response.status).toBe(204);
    });
  });
});
