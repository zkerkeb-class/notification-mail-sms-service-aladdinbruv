// Rely on global Jest types via @types/jest
import * as service from '../services/notification.service';

jest.mock('twilio', () => {
  return () => ({
    messages: {
      create: jest.fn().mockResolvedValue({ sid: 'SM123' })
    }
  });
});

describe('NotificationService - sms', () => {
  it('sends sms via twilio', async () => {
    const resp = await service.sendSms('+1000000000', 'Hello');
    expect(resp).toEqual(expect.objectContaining({ sid: expect.any(String) }));
  });
});


