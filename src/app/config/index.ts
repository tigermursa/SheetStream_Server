
import dotenv from 'dotenv';

import path from 'path';


dotenv.config({ path: path.join(process.cwd(), '.env') });


export default {
    port: process.env.PORT, 
    dbUrl: process.env.DATABASE_URL, 
    bcrypt_salt: process.env.BCRYPT_SALT_ROUNDS, 
    dev_frontend: process.env.DEV_FRONTEND_URL,
    prod_frontend: process.env.PROD_FRONTEND_UR,
};
