# 📧 SK8 Notification Service Setup

## Required Environment Variables

Create a `.env` file in the `sk8notificationservice` directory:

```bash
# Server Configuration
PORT=3004

# SendGrid Configuration (Required for emails)
SENDGRID_API_KEY=your_sendgrid_api_key_here
SENDER_EMAIL=noreply@sk8app.com

# Twilio Configuration (Required for SMS)
TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
TWILIO_PHONE_NUMBER=+12768008254

# Optional: Database for notification tracking
DATABASE_URL=your_database_url_here
```

## Getting API Keys

### SendGrid (Email Service)
1. Go to [SendGrid](https://sendgrid.com)
2. Create a free account (up to 100 emails/day)
3. Go to Settings > API Keys
4. Create a new API key with "Full Access"
5. Copy the API key to `SENDGRID_API_KEY`
6. Verify a sender email in SendGrid dashboard

### Twilio (SMS Service)
1. Go to [Twilio](https://twilio.com)
2. Create a free trial account
3. Get your Account SID and Auth Token from the dashboard
4. Buy a phone number or use the trial number
5. Add credentials to `.env`

## Running the Service

```bash
cd sk8notificationservice
npm install
npm run dev
```

The service will run on `http://localhost:3004`

## Testing the Service

### Test Email Endpoint:
```bash
curl -X POST http://localhost:3004/api/notifications/email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@example.com",
    "subject": "Test Email",
    "html": "<h1>Hello from SK8!</h1>"
  }'
```

### Test SMS Endpoint:
```bash
curl -X POST http://localhost:3004/api/notifications/sms \
  -H "Content-Type: application/json" \
  -d '{
    "to": "+1234567890",
    "body": "Hello from SK8!"
  }'
```

## Integration Status

✅ **Welcome Emails** - Sent on user registration  
✅ **Spot Discovery** - Sent when users discover new spots  
✅ **Achievement Unlocks** - Sent when users unlock achievements  
✅ **Password Reset** - Available for auth flows  
🔧 **Collection Sharing** - Ready for implementation  
🔧 **SMS Alerts** - Ready for urgent notifications

## Error Handling

The notification service is designed to fail gracefully:
- If SendGrid/Twilio APIs are down, the main app continues working
- Non-critical notifications won't block user actions
- All errors are logged for debugging

## Scaling Considerations

For production:
- Use a message queue (Redis/RabbitMQ) for high volume
- Add rate limiting to prevent spam
- Store notification history in database
- Add unsubscribe functionality
- Use email templates for consistency 