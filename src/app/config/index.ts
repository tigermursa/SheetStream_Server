// Import the 'dotenv' library which loads environment variables from a .env file into process.env
import dotenv from 'dotenv';
// Import the 'path' library which helps with handling and transforming file paths
import path from 'path';

// Load the environment variables from the .env file located in the current working directory
dotenv.config({ path: path.join(process.cwd(), '.env') });

// Export an object with the necessary configuration settings for the application
export default {
    port: process.env.PORT, // The port number on which the server will run, taken from the environment variables
    dbUrl: process.env.DATABASE_URL, // The database URL, taken from the environment variables
    bcrypt_salt: process.env.BCRYPT_SALT_ROUNDS, // The number of salt rounds for bcrypt (used for hashing passwords), taken from the environment variables
};
