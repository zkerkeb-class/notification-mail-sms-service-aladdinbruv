import dotenv from 'dotenv';

dotenv.config();

const config = {
  port: process.env.PORT || 3004,
  twilioAccountSid: process.env.TWILIO_ACCOUNT_SID,
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
  twilioPhoneNumber: process.env.TWILIO_PHONE_NUMBER,
  sendgridApiKey: process.env.SENDGRID_API_KEY,
  senderEmail: process.env.SENDER_EMAIL,
};

export default config; 