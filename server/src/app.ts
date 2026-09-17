import cors from 'cors';
import express from 'express';
import artistsRoutes from './modules/artists/artists.routes.js';
import authRoutes from './modules/auth/auth.route.js';
import portfolioItemsRoutes from './modules/portfolioItems/portfolioItems.routes.js';
import { globalErrorHandler } from './modules/shared/middleware/error.middleware.js';
import userRoutes from './modules/users/user.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/artists', artistsRoutes);
app.use('/api/v1/portfolioItems', portfolioItemsRoutes);

app.use(globalErrorHandler);

export default app;
