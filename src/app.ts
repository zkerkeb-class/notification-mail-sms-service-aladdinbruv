import express from 'express';
import cors from 'cors';
import notificationRoutes from './routes/notification.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/notifications', notificationRoutes);

export default app; 