import { createServer } from 'http';
import app from './app.js';
import { prisma } from './lib/prisma.js';

const PORT = process.env.PORT || 5000;

const server = createServer(app);

async function startServer() {
    try {
        await prisma.$connect();
        console.log('Connected to database');

        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server: ', error);
        await prisma.$disconnect();
        process.exit(1);
    }
}

startServer();
