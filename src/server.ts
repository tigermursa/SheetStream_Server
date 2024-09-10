// Import the Express app instance from the local 'app' module
import app from "./app";
// Import the 'mongoose' library which is an Object Data Modeling (ODM) library for MongoDB and Node.js
import mongoose from 'mongoose';
// Import the configuration settings from the local 'config' module
import config from "./app/config";

// Define an asynchronous function to start the server
async function server() {
    try {
        // Connect to the MongoDB database using the URL from the configuration
        await mongoose.connect(config.dbUrl as string);
        console.log("Mongoose connected successfully!");

        // Start the Express server on the specified port from the configuration
        app.listen(config.port, () => {
            console.log(`Dear app listening on port ${config.port}`);
        });
    } catch (error) {
        // Log any errors that occur during the connection or server start
        console.log(error);
    }
}

// Call the server function and catch any errors that it might throw
server().catch(err => console.log(err));
