# SK8 Notification Service 📧📱💬

A powerful, multi-channel notification microservice for the SK8 skateboarding platform. This service handles email, SMS, and push notifications to keep users engaged and informed about their skateboarding journey.

## 🌟 Features

### 📧 Email Notifications
- **SendGrid Integration**: Professional email delivery with high deliverability
- **HTML Templates**: Rich, styled email content support
- **Custom Sender**: Branded emails from your domain
- **Delivery Tracking**: Built-in error handling and logging

### 📱 SMS Notifications
- **Twilio Integration**: Reliable SMS delivery worldwide
- **International Support**: Send SMS to global phone numbers
- **Instant Delivery**: Real-time SMS notifications
- **Fallback Support**: Graceful error handling

### 🔔 Push Notifications
- **Expo Push Service**: Native mobile push notifications
- **Multi-device Support**: Send to multiple user devices
- **Rich Notifications**: Title, body, and custom data payload
- **Token Management**: User device registration and management
- **Receipt Tracking**: Delivery confirmation and error handling

### 🚀 Core Capabilities
- **Multi-channel Messaging**: Email, SMS, and push in one service
- **User Registration**: Device token management for push notifications
- **Error Resilience**: Graceful failure handling that doesn't block main app
- **Scalable Architecture**: Ready for high-volume notification delivery
- **RESTful API**: Simple, intuitive endpoints for all notification types

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                SK8 Notification Service                        │
├─────────────────────────────────────────────────────────────────┤
│                      API Layer                                 │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐             │
│  │    Email    │ │     SMS     │ │    Push     │             │
│  │  Endpoint   │ │  Endpoint   │ │  Endpoint   │             │
│  └─────────────┘ └─────────────┘ └─────────────┘             │
├─────────────────────────────────────────────────────────────────┤
│                    Service Layer                               │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐             │
│  │ Notification│ │   Token     │ │   Receipt   │             │
│  │   Service   │ │ Management  │ │  Handling   │             │
│  └─────────────┘ └─────────────┘ └─────────────┘             │
├─────────────────────────────────────────────────────────────────┤
│                   External APIs                                │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐             │
│  │  SendGrid   │ │   Twilio    │ │    Expo     │             │
│  │   (Email)   │ │    (SMS)    │ │   (Push)    │             │
│  └─────────────┘ └─────────────┘ └─────────────┘             │
└─────────────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- SendGrid account (for email)
- Twilio account (for SMS)
- Expo account (for push notifications)

### Installation

#### Using npm
```bash
# Clone the repository
git clone https://github.com/zkerkeb-class/notification-mail-sms-service-aladdinbruv.git
cd notification-mail-sms-service-aladdinbruv

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

#### Using Docker
```bash
# Build and run with Docker
docker build -t sk8-notification-service .
docker run -p 3004:3004 --env-file .env sk8-notification-service
```

## ⚙️ Environment Configuration

Create a `.env` file in the project root:

```env
# Server Configuration
PORT=3004
NODE_ENV=development

# SendGrid Configuration (Email Service)
SENDGRID_API_KEY=your_sendgrid_api_key_here
SENDER_EMAIL=noreply@sk8app.com

# Twilio Configuration (SMS Service)  
TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890

# Optional: Enhanced Logging
LOG_LEVEL=info
```

### 🔑 Getting API Keys

#### SendGrid (Email Service)
1. Visit [SendGrid](https://sendgrid.com) and create a free account
2. Navigate to Settings → API Keys
3. Create a new API key with "Full Access" permissions
4. Verify your sender email address in the SendGrid dashboard
5. Add the API key to your `.env` file

**Free Tier**: 100 emails/day forever

#### Twilio (SMS Service)
1. Visit [Twilio](https://twilio.com) and create a trial account
2. Get your Account SID and Auth Token from the Console Dashboard
3. Purchase a phone number or use the trial number for testing
4. Add credentials to your `.env` file

**Free Trial**: $15 credit for testing

#### Expo (Push Notifications)
- No API key required for basic push notifications
- Uses the free Expo Push Notification service
- Enhanced features available with Expo paid plans

## 📚 API Documentation

### Base URL
```
http://localhost:3004/api/notifications
```

### 📧 Email Notifications

#### Send Email
```http
POST /email
Content-Type: application/json

{
  "to": "user@example.com",
  "subject": "Welcome to SK8! 🛹",
  "html": "<h1>Welcome skater!</h1><p>Ready to discover epic spots?</p>"
}
```

**Example cURL:**
```bash
curl -X POST http://localhost:3004/api/notifications/email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "user@example.com",
    "subject": "Spot Analysis Complete! 🛹",
    "html": "<h1>Your spot analysis is ready!</h1><p>Check out the results in the app.</p>"
  }'
```

**Response:**
```json
{
  "message": "Email sent successfully."
}
```

### 📱 SMS Notifications

#### Send SMS
```http
POST /sms
Content-Type: application/json

{
  "to": "+1234567890",
  "body": "Your SK8 spot analysis is complete! Check the app for results. 🛹"
}
```

**Example cURL:**
```bash
curl -X POST http://localhost:3004/api/notifications/sms \
  -H "Content-Type: application/json" \
  -d '{
    "to": "+1234567890",
    "body": "New epic spot discovered near you! Open SK8 to check it out 🛹"
  }'
```

**Response:**
```json
{
  "message": "SMS sent successfully."
}
```

### 🔔 Push Notifications

#### Register Push Token
```http
POST /push/register
Content-Type: application/json

{
  "userId": "user123",
  "pushToken": "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]"
}
```

**Example cURL:**
```bash
curl -X POST http://localhost:3004/api/notifications/push/register \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "pushToken": "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]"
  }'
```

#### Send Push Notification
```http
POST /push
Content-Type: application/json

{
  "userId": "user123",
  "title": "New Spot Discovered! 🛹",
  "body": "An epic stair set was found 2 blocks away from you!",
  "data": {
    "spotId": "spot456",
    "type": "spot_discovered"
  }
}
```

**Example cURL:**
```bash
curl -X POST http://localhost:3004/api/notifications/push \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "title": "Achievement Unlocked! 🏆",
    "body": "You completed your first spot analysis!",
    "data": {
      "achievementId": "first_analysis",
      "type": "achievement"
    }
  }'
```

**Response:**
```json
{
  "message": "Push notification sent successfully.",
  "tickets": 2
}
```

## 🎯 Use Cases & Integration

### 🔄 User Registration Flow
```javascript
// Send welcome email after user registration
await fetch('http://localhost:3004/api/notifications/email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    to: user.email,
    subject: 'Welcome to SK8! 🛹',
    html: `
      <h1>Welcome ${user.name}!</h1>
      <p>Ready to discover the best skateboarding spots in your city?</p>
      <p>Download the app and start exploring!</p>
    `
  })
});
```

### 🤖 AI Analysis Completion
```javascript
// Notify user when spot analysis is complete
await fetch('http://localhost:3004/api/notifications/push', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: analysis.userId,
    title: 'Analysis Complete! 🤖',
    body: `Your ${analysis.spotType} analysis is ready. Difficulty: ${analysis.difficulty}`,
    data: {
      analysisId: analysis.id,
      type: 'analysis_complete'
    }
  })
});
```

### 🏆 Achievement Unlocked
```javascript
// Celebrate user achievements
await fetch('http://localhost:3004/api/notifications/email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    to: user.email,
    subject: 'Achievement Unlocked! 🏆',
    html: `
      <h1>Congratulations!</h1>
      <p>You've unlocked the "${achievement.name}" achievement!</p>
      <p>Keep skating and discovering new spots!</p>
    `
  })
});
```

### 🔐 Password Reset
```javascript
// Send password reset email
await fetch('http://localhost:3004/api/notifications/email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    to: user.email,
    subject: 'Reset Your SK8 Password',
    html: `
      <h1>Password Reset Request</h1>
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}">Reset Password</a>
      <p>This link expires in 1 hour.</p>
    `
  })
});
```

## 🧪 Testing

### Manual Testing
```bash
# Test all notification channels
npm test

# Test email only
curl -X POST http://localhost:3004/api/notifications/email \
  -H "Content-Type: application/json" \
  -d '{"to":"test@example.com","subject":"Test","html":"<h1>Test</h1>"}'

# Test SMS only  
curl -X POST http://localhost:3004/api/notifications/sms \
  -H "Content-Type: application/json" \
  -d '{"to":"+1234567890","body":"Test message"}'
```

### Integration Testing
```javascript
// Example integration test
describe('Notification Service', () => {
  test('should send email notification', async () => {
    const response = await request(app)
      .post('/api/notifications/email')
      .send({
        to: 'test@example.com',
        subject: 'Test Subject',
        html: '<h1>Test HTML</h1>'
      });
    
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Email sent successfully.');
  });
});
```

## 📊 Error Handling & Resilience

### Error Response Format
```json
{
  "error": "Failed to send email.",
  "details": "Invalid SendGrid API key"
}
```

### Common Error Scenarios
- **Invalid API Keys**: Service returns 500 with configuration error
- **Invalid Phone Numbers**: SMS fails with validation error  
- **Invalid Email Addresses**: Email fails with validation error
- **Rate Limiting**: Temporary failures with retry suggestions
- **Network Issues**: Graceful degradation with fallback options

### Graceful Degradation
```javascript
// The service is designed to fail gracefully
try {
  await sendNotification(user, message);
} catch (error) {
  // Log error but don't block main application flow
  console.error('Notification failed:', error);
  // Continue with main application logic
}
```

## 🔒 Security Features

- **Input Validation**: All requests validated for required fields
- **Rate Limiting**: Protection against spam and abuse
- **API Key Security**: Secure storage of third-party credentials
- **Email Sanitization**: HTML content sanitization
- **Phone Number Validation**: International phone number format validation
- **Error Message Sanitization**: No sensitive data in error responses

## 📈 Performance & Monitoring

### Caching Strategy
- **Token Storage**: In-memory push token storage (upgradeable to Redis)
- **Rate Limiting**: Built-in request throttling
- **Connection Pooling**: Efficient API client management

### Monitoring Metrics
- **Email Delivery Rate**: Track SendGrid delivery success
- **SMS Delivery Rate**: Monitor Twilio delivery status  
- **Push Notification Receipts**: Expo delivery confirmation
- **Error Rates**: Track failed notifications by type
- **Response Times**: Monitor API performance

### Logging
```javascript
// Structured logging for monitoring
console.log('Email sent successfully', {
  to: recipient,
  subject: subject,
  timestamp: new Date().toISOString(),
  service: 'sendgrid'
});
```

## 🚀 Deployment

### Docker Deployment
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3004
CMD ["npm", "start"]
```

### Environment-Specific Configurations

#### Development
```env
NODE_ENV=development
LOG_LEVEL=debug
# Use trial accounts for testing
```

#### Production
```env
NODE_ENV=production
LOG_LEVEL=info
# Use production API keys
# Add monitoring and alerting
```

### Health Check Endpoint
```http
GET /health
```

Response:
```json
{
  "status": "healthy",
  "service": "sk8-notification-service",
  "timestamp": "2024-01-15T10:30:00Z",
  "version": "1.0.0"
}
```

## 🔗 Integration Examples

### React Native Integration
```javascript
// Register for push notifications
import * as Notifications from 'expo-notifications';

const registerForPushNotifications = async (userId) => {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') return;
  
  const token = (await Notifications.getExpoPushTokenAsync()).data;
  
  await fetch('http://localhost:3004/api/notifications/push/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, pushToken: token })
  });
};
```

### Backend Service Integration
```javascript
// Send notification from your main application
const sendSpotAnalysisNotification = async (user, analysis) => {
  try {
    // Send push notification
    await fetch('http://localhost:3004/api/notifications/push', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.id,
        title: 'Analysis Complete! 🤖',
        body: `Your ${analysis.type} analysis is ready!`,
        data: { analysisId: analysis.id }
      })
    });
    
    // Send follow-up email
    await fetch('http://localhost:3004/api/notifications/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: user.email,
        subject: 'Your Spot Analysis Results 🛹',
        html: `
          <h1>Analysis Complete!</h1>
          <p>Spot Type: ${analysis.type}</p>
          <p>Difficulty: ${analysis.difficulty}</p>
          <p>Open the app to see full details!</p>
        `
      })
    });
  } catch (error) {
    console.error('Failed to send notifications:', error);
  }
};
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/enhanced-sms`)
3. Commit your changes (`git commit -m 'Add SMS retry logic'`)
4. Push to the branch (`git push origin feature/enhanced-sms`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Add tests for new notification channels
- Update API documentation for new endpoints
- Ensure error handling for all external API calls
- Test with real API keys before submitting

## 🛠️ Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Email Service**: SendGrid API
- **SMS Service**: Twilio API  
- **Push Notifications**: Expo Push Service
- **Validation**: Built-in Express validation
- **Testing**: Jest (ready for implementation)
- **Containerization**: Docker

## 📋 Notification Templates

### Email Templates
```html
<!-- Welcome Email -->
<div style="font-family: Arial, sans-serif; max-width: 600px;">
  <h1 style="color: #2563eb;">Welcome to SK8! 🛹</h1>
  <p>Ready to discover the best skateboarding spots in your city?</p>
  <a href="https://sk8app.com/download" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
    Get Started
  </a>
</div>

<!-- Analysis Complete -->
<div style="font-family: Arial, sans-serif; max-width: 600px;">
  <h1 style="color: #059669;">Analysis Complete! 🤖</h1>
  <p>Your spot analysis is ready with these results:</p>
  <ul>
    <li><strong>Type:</strong> {{spotType}}</li>
    <li><strong>Difficulty:</strong> {{difficulty}}</li>
    <li><strong>Score:</strong> {{score}}/10</li>
  </ul>
  <a href="https://sk8app.com/analysis/{{analysisId}}" style="background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
    View Results
  </a>
</div>
```

### SMS Templates
```javascript
const smsTemplates = {
  welcome: "Welcome to SK8! 🛹 Discover epic skating spots near you. Download the app: sk8app.com",
  analysisComplete: "Your spot analysis is complete! {{spotType}} detected with {{difficulty}} difficulty. Check the app for details! 🤖",
  newSpot: "New {{spotType}} discovered {{distance}} away! Perfect for {{suggestedTricks}}. Open SK8 to explore! 🛹",
  achievement: "Achievement unlocked: {{achievementName}}! 🏆 Keep skating and discovering new spots!"
};
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- **Email**: support@sk8app.com
- **GitHub Issues**: Create an issue in this repository
- **Documentation**: Check the [SETUP.md](./SETUP.md) for additional configuration details

## 🗺️ Roadmap

- [ ] **Email Templates**: Rich HTML templates with customization
- [ ] **Notification History**: Database storage for sent notifications  
- [ ] **User Preferences**: Opt-in/opt-out settings per notification type
- [ ] **Scheduled Notifications**: Delayed and recurring notifications
- [ ] **A/B Testing**: Template and timing optimization
- [ ] **Analytics Dashboard**: Delivery rates and engagement metrics
- [ ] **Webhook Support**: Real-time delivery status updates
- [ ] **Multi-language Support**: Localized notification content
- [ ] **Message Queue Integration**: Redis/RabbitMQ for high volume
- [ ] **Advanced Push Features**: Rich media, action buttons, grouping

---

Made with ❤️ for the SK8 skateboarding community 🛹📧📱
