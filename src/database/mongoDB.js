import mongoose from 'mongoose';

async function connectDB() {
    return mongoose.connect(process.env.MONGO_URL_CONNECT, { dbName: process.env.MONGODB_DATABASE_NAME });
}

export { connectDB };
