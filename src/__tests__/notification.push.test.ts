// Rely on global Jest types via @types/jest
import * as service from '../services/notification.service';

jest.mock('expo-server-sdk', () => {
  class ExpoMock {
    static isExpoPushToken(token: string) { return token.startsWith('ExponentPushToken'); }
    chunkPushNotifications(messages: any[]) { return [messages]; }
    async sendPushNotificationsAsync(chunk: any[]) { return chunk.map(() => ({ id: 'ticket-1', status: 'ok' })); }
    chunkPushNotificationReceiptIds(ids: string[]) { return [ids]; }
    async getPushNotificationReceiptsAsync() { return {}; }
  }
  return { Expo: ExpoMock };
});

describe('NotificationService - push', () => {
  it('sends push to valid expo tokens', async () => {
    const tickets = await service.sendPushNotification(
      ['ExponentPushToken[abc]'],
      'Title',
      'Body',
      { k: 'v' }
    );
    expect(Array.isArray(tickets)).toBe(true);
    expect(tickets.length).toBeGreaterThan(0);
  });
});


