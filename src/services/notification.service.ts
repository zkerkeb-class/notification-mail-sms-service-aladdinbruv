import twilio from 'twilio';
import sgMail from '@sendgrid/mail';
import { Expo, ExpoPushMessage } from 'expo-server-sdk';
import config from '../config';

if (config.sendgridApiKey) {
  sgMail.setApiKey(config.sendgridApiKey);
}

const twilioClient = twilio(config.twilioAccountSid, config.twilioAuthToken);
const expo = new Expo();

export const sendSms = async (to: string, body: string) => {
  if (!config.twilioPhoneNumber) {
    throw new Error('Twilio phone number is not configured.');
  }
  try {
    const message = await twilioClient.messages.create({
      body,
      from: config.twilioPhoneNumber,
      to,
    });
    console.log(`SMS sent to ${to}. SID: ${message.sid}`);
    return message;
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw error;
  }
};

export const sendEmail = async (to: string, subject: string, html: string) => {
  if (!config.senderEmail) {
    throw new Error('Sender email is not configured.');
  }
  const msg = {
    to,
    from: config.senderEmail, // Use a verified sender
    subject,
    html,
  };

  try {
    await sgMail.send(msg);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export const sendPushNotification = async (
  pushTokens: string[],
  title: string,
  body: string,
  data?: any
) => {
  // Check that all your push tokens are valid Expo push tokens
  const messages: ExpoPushMessage[] = [];
  
  for (let pushToken of pushTokens) {
    // Check that the token is a valid Expo push token
    if (!Expo.isExpoPushToken(pushToken)) {
      console.error(`Push token ${pushToken} is not a valid Expo push token`);
      continue;
    }

    // Construct a message
    messages.push({
      to: pushToken,
      sound: 'default',
      title,
      body,
      data,
    });
  }

  // Send the push notifications
  const chunks = expo.chunkPushNotifications(messages);
  const tickets = [];
  
  for (let chunk of chunks) {
    try {
      const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      tickets.push(...ticketChunk);
    } catch (error) {
      console.error('Error sending push notification chunk:', error);
    }
  }

  return tickets;
};

export const handlePushNotificationReceipts = async (tickets: any[]) => {
  const receiptIds = tickets
    .filter(ticket => ticket.id)
    .map(ticket => ticket.id);

  const receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
  
  for (let chunk of receiptIdChunks) {
    try {
      const receipts = await expo.getPushNotificationReceiptsAsync(chunk);
      
      for (let receiptId in receipts) {
        const receipt = receipts[receiptId];
        
        if (receipt.status === 'ok') {
          continue;
        } else if (receipt.status === 'error') {
          console.error(`There was an error sending a notification: ${receipt.message || 'Unknown error'}`);
          if (receipt.details && receipt.details.error) {
            console.error(`The error code is ${receipt.details.error}`);
          }
        }
      }
    } catch (error) {
      console.error('Error handling push notification receipts:', error);
    }
  }
}; 