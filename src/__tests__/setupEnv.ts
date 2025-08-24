process.env.NODE_ENV = 'test';
process.env.PORT = '0';

// Notification service config fallbacks for tests
process.env.SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || 'test-sendgrid';
process.env.SENDER_EMAIL = process.env.SENDER_EMAIL || 'noreply@example.com';
process.env.TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || 'ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
process.env.TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || 'auth-token';
process.env.TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER || '+10000000000';


