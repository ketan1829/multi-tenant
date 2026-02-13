import dotenv from 'dotenv';
dotenv.config();

export const config = {
    
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 5000,
    mongoUri: process.env.MONGODB_URI,
    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    },
    
    clientOrigin: process.env.CLIENT_ORIGIN || 'https://agent-698eda0e3424eda3e1d47--multi-tenant-client.netlify.app',
};
