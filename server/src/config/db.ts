import mongoose from "mongoose";

const connectDb = async (): Promise<void> => { // connection function
    try {
        const connect = await mongoose.connect(process.env.CONNECTION_STRING!); // connection
        console.log(`Database connected: ${connect.connection.host} ${connect.connection.name}`); // connection message
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}

export default connectDb;