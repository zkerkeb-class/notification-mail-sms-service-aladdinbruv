// Rely on global Jest types via @types/jest

const mockSend = jest.fn();
const mockSetApiKey = jest.fn();

jest.mock('@sendgrid/mail', () => ({
  setApiKey: mockSetApiKey,
  send: mockSend
}));

// Mock config - must come before any imports that use config
jest.mock('../config', () => ({
  __esModule: true,
  default: {
    sendgridApiKey: 'test_api_key',
    senderEmail: 'test@example.com'
  }
}));

import * as service from '../services/notification.service';

describe('NotificationService - email', () => {
  beforeEach(() => {
    mockSend.mockClear();
    mockSetApiKey.mockClear();
    jest.clearAllMocks();
  });

  it('sends email via sendgrid', async () => {
    mockSend.mockResolvedValue([{ statusCode: 202 }]);
    await expect(service.sendEmail('to@example.com', 'Hi', '<b>Body</b>')).resolves.toBeUndefined();
    
    expect(mockSend).toHaveBeenCalledWith({
      to: 'to@example.com',
      from: 'test@example.com',
      subject: 'Hi',
      html: '<b>Body</b>'
    });
  });

  it('throws error when sender email is not configured', async () => {
    // Mock config without sender email
    jest.doMock('../config', () => ({
      default: {
        sendgridApiKey: 'test_api_key',
        senderEmail: undefined
      }
    }));

    // Re-import service to get new config
    jest.resetModules();
    const serviceWithoutSender = require('../services/notification.service');
    
    await expect(serviceWithoutSender.sendEmail('to@example.com', 'Hi', '<b>Body</b>'))
      .rejects.toThrow('Sender email is not configured.');
  });

  it('handles sendgrid API errors', async () => {
    const error = new Error('SendGrid API error');
    mockSend.mockRejectedValue(error);

    await expect(service.sendEmail('to@example.com', 'Hi', '<b>Body</b>'))
      .rejects.toThrow('SendGrid API error');
  });
});


