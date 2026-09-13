import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaClient } from '../generated/prisma/client.js';

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
const pool = new Pool({
    connectionString,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
    ssl: {
        rejectUnauthorized: false,
    },
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export { prisma };
