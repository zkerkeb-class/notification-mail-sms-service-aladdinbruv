// Rely on global Jest types via @types/jest

const mockIsExpoPushToken = jest.fn();
const mockChunkPushNotifications = jest.fn();
const mockSendPushNotificationsAsync = jest.fn();
const mockChunkPushNotificationReceiptIds = jest.fn();
const mockGetPushNotificationReceiptsAsync = jest.fn();

jest.mock('expo-server-sdk', () => {
  class ExpoMock {
    static isExpoPushToken = mockIsExpoPushToken;
    chunkPushNotifications = mockChunkPushNotifications;
    sendPushNotificationsAsync = mockSendPushNotificationsAsync;
    chunkPushNotificationReceiptIds = mockChunkPushNotificationReceiptIds;
    getPushNotificationReceiptsAsync = mockGetPushNotificationReceiptsAsync;
  }
  return { Expo: ExpoMock };
});

import * as service from '../services/notification.service';

describe('NotificationService - push', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockIsExpoPushToken.mockReturnValue(true);
    mockChunkPushNotifications.mockImplementation((messages) => [messages]);
    mockSendPushNotificationsAsync.mockResolvedValue([{ id: 'ticket-1', status: 'ok' }]);
    mockChunkPushNotificationReceiptIds.mockImplementation((ids) => [ids]);
    mockGetPushNotificationReceiptsAsync.mockResolvedValue({});
  });

  it('sends push to valid expo tokens', async () => {
    mockIsExpoPushToken.mockReturnValue(true);
    const tickets = await service.sendPushNotification(
      ['ExponentPushToken[abc]'],
      'Title',
      'Body',
      { k: 'v' }
    );
    expect(Array.isArray(tickets)).toBe(true);
    expect(tickets.length).toBeGreaterThan(0);
  });

  it('skips invalid expo tokens', async () => {
    mockIsExpoPushToken.mockReturnValue(false);
    mockChunkPushNotifications.mockReturnValue([]); // Empty chunks since no valid tokens
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    const tickets = await service.sendPushNotification(
      ['invalid-token'],
      'Title',
      'Body'
    );
    
    expect(consoleSpy).toHaveBeenCalledWith('Push token invalid-token is not a valid Expo push token');
    expect(tickets).toEqual([]);
    consoleSpy.mockRestore();
  });

  it('handles mixed valid and invalid tokens', async () => {
    mockIsExpoPushToken
      .mockReturnValueOnce(true)  // First token valid
      .mockReturnValueOnce(false); // Second token invalid
    
    // Mock chunking to return one message (for the valid token)
    mockChunkPushNotifications.mockImplementation((messages) => [messages]);
    mockSendPushNotificationsAsync.mockResolvedValue([{ id: 'ticket1' }]);
    
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    const tickets = await service.sendPushNotification(
      ['ExponentPushToken[abc]', 'invalid-token'],
      'Title',
      'Body'
    );
    
    expect(consoleSpy).toHaveBeenCalledWith('Push token invalid-token is not a valid Expo push token');
    expect(tickets.length).toBe(1);
    consoleSpy.mockRestore();
  });

  it('handles send push notification chunk errors', async () => {
    const error = new Error('Expo API error');
    mockSendPushNotificationsAsync.mockRejectedValue(error);
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    const tickets = await service.sendPushNotification(
      ['ExponentPushToken[abc]'],
      'Title',
      'Body'
    );
    
    expect(consoleSpy).toHaveBeenCalledWith('Error sending push notification chunk:', error);
    expect(tickets).toEqual([]);
    consoleSpy.mockRestore();
  });

  describe('handlePushNotificationReceipts', () => {
    it('handles successful receipts', async () => {
      const tickets = [{ id: 'ticket-1' }, { id: 'ticket-2' }];
      mockGetPushNotificationReceiptsAsync.mockResolvedValue({
        'ticket-1': { status: 'ok' },
        'ticket-2': { status: 'ok' }
      });

      await expect(service.handlePushNotificationReceipts(tickets)).resolves.toBeUndefined();
      
      expect(mockChunkPushNotificationReceiptIds).toHaveBeenCalledWith(['ticket-1', 'ticket-2']);
      expect(mockGetPushNotificationReceiptsAsync).toHaveBeenCalled();
    });

    it('handles error receipts', async () => {
      const tickets = [{ id: 'ticket-1' }];
      mockGetPushNotificationReceiptsAsync.mockResolvedValue({
        'ticket-1': { 
          status: 'error', 
          message: 'Invalid token',
          details: { error: 'DeviceNotRegistered' }
        }
      });

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      await service.handlePushNotificationReceipts(tickets);
      
      expect(consoleSpy).toHaveBeenCalledWith('There was an error sending a notification: Invalid token');
      expect(consoleSpy).toHaveBeenCalledWith('The error code is DeviceNotRegistered');
      consoleSpy.mockRestore();
    });

    it('handles error receipts without message', async () => {
      const tickets = [{ id: 'ticket-1' }];
      mockGetPushNotificationReceiptsAsync.mockResolvedValue({
        'ticket-1': { status: 'error' }
      });

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      await service.handlePushNotificationReceipts(tickets);
      
      expect(consoleSpy).toHaveBeenCalledWith('There was an error sending a notification: Unknown error');
      consoleSpy.mockRestore();
    });

    it('filters tickets without ids', async () => {
      const tickets = [{ id: 'ticket-1' }, { status: 'error' }, { id: 'ticket-2' }];
      
      await service.handlePushNotificationReceipts(tickets);
      
      expect(mockChunkPushNotificationReceiptIds).toHaveBeenCalledWith(['ticket-1', 'ticket-2']);
    });

    it('handles receipt API errors', async () => {
      const tickets = [{ id: 'ticket-1' }];
      const error = new Error('Receipt API error');
      mockGetPushNotificationReceiptsAsync.mockRejectedValue(error);
      
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      await service.handlePushNotificationReceipts(tickets);
      
      expect(consoleSpy).toHaveBeenCalledWith('Error handling push notification receipts:', error);
      consoleSpy.mockRestore();
    });
  });
});


