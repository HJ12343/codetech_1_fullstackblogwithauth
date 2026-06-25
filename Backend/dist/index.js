import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import prisma from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import postRoutes from './routes/post.routes.js';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.get('/api/health', (req, res) => {
    res.json({
        status: 'success',
        message: 'Full-Stack Blog API (TypeScript + Prisma) is running smoothly',
        timestamp: new Date()
    });
});
const startServer = async () => {
    try {
        await prisma.$connect();
        console.log('Database connection has been established successfully via Prisma.');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
        });
    }
    catch (error) {
        console.error('Unable to connect to the database or start the server:', error);
        await prisma.$disconnect();
        process.exit(1);
    }
};
startServer();
