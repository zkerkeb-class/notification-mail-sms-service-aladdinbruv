// Rely on global Jest types via @types/jest
import * as service from '../services/notification.service';

jest.mock('@sendgrid/mail', () => ({
  setApiKey: jest.fn(),
  send: jest.fn().mockResolvedValue([{ statusCode: 202 }])
}));

describe('NotificationService - email', () => {
  it('sends email via sendgrid', async () => {
    await expect(service.sendEmail('to@example.com', 'Hi', '<b>Body</b>')).resolves.toBeUndefined();
  });
});


