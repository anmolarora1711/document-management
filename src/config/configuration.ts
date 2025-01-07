import * as dotenv from 'dotenv';

const environment = process.env.NODE_ENV || 'development';
dotenv.config({ path: `.env.${environment}` });

export default () => {
    console.log(`Configuration is for ${process.env.NODE_ENV} environment`);
    return ({
        port: parseInt(process.env.PORT, 10) || 3000,
        database: {
            host: process.env.DATABASE_HOST,
            port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
            username: process.env.DATABASE_USERNAME,
            password: process.env.DATABASE_PASSWORD,
            name: process.env.DATABASE_NAME,
        },
        nodeEnv: process.env.NODE_ENV,
    });
}