// Rely on global Jest types via @types/jest

const mockCreate = jest.fn();
jest.mock('twilio', () => {
  return () => ({
    messages: {
      create: mockCreate
    }
  });
});

// Mock config - must come before any imports that use config
jest.mock('../config', () => ({
  __esModule: true,
  default: {
    twilioAccountSid: 'test_sid',
    twilioAuthToken: 'test_token',
    twilioPhoneNumber: '+1234567890'
  }
}));

import * as service from '../services/notification.service';

describe('NotificationService - sms', () => {
  beforeEach(() => {
    mockCreate.mockClear();
    jest.clearAllMocks();
  });

  it('sends sms via twilio', async () => {
    mockCreate.mockResolvedValue({ sid: 'SM123' });
    const resp = await service.sendSms('+1000000000', 'Hello');
    expect(resp).toEqual(expect.objectContaining({ sid: expect.any(String) }));
    expect(mockCreate).toHaveBeenCalledWith({
      body: 'Hello',
      from: '+1234567890',
      to: '+1000000000'
    });
  });

  it('throws error when twilio phone number is not configured', async () => {
    // Mock config without phone number
    jest.doMock('../config', () => ({
      default: {
        twilioAccountSid: 'test_sid',
        twilioAuthToken: 'test_token',
        twilioPhoneNumber: undefined
      }
    }));

    // Re-import service to get new config
    jest.resetModules();
    const serviceWithoutPhone = require('../services/notification.service');
    
    await expect(serviceWithoutPhone.sendSms('+1000000000', 'Hello'))
      .rejects.toThrow('Twilio phone number is not configured.');
  });

  it('handles twilio API errors', async () => {
    const error = new Error('Twilio API error');
    mockCreate.mockRejectedValue(error);

    await expect(service.sendSms('+1000000000', 'Hello'))
      .rejects.toThrow('Twilio API error');
  });
});


