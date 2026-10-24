const mongoose = require('mongoose');
const dns = require('dns');
require('dotenv').config();

// Fix for Windows Node.js querySrv ECONNREFUSED when connecting to MongoDB Atlas
try {
    dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {
    console.warn('DNS server override not supported:', e.message);
}

let mongoMemoryInstance = null;

const connectDB = async () => {
    try {
        console.log('Connecting to MongoDB...');
        let uri = process.env.MONGO_URI;

        if (!uri) {
            console.log('MongoDB URI not defined. Initializing local MongoMemoryServer...');
            const { MongoMemoryServer } = require('mongodb-memory-server');
            mongoMemoryInstance = await MongoMemoryServer.create();
            uri = mongoMemoryInstance.getUri();
            process.env.MONGO_URI = uri;
        }

        console.log('MongoDB URI:', uri.replace(/\/\/.*:.*@/, '//***:***@'));

        let connect;
        try {
            connect = await mongoose.connect(uri, {
                serverSelectionTimeoutMS: 8000,
                socketTimeoutMS: 45000,
            });
        } catch (initialError) {
            console.warn('⚠️ Primary MongoDB connection failed:', initialError.message);
            console.log('🔄 Initializing local MongoMemoryServer fallback...');
            const { MongoMemoryServer } = require('mongodb-memory-server');
            mongoMemoryInstance = await MongoMemoryServer.create();
            uri = mongoMemoryInstance.getUri();
            process.env.MONGO_URI = uri;
            console.log('Fallback MongoDB URI:', uri);
            connect = await mongoose.connect(uri, {
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000,
            });
        }

        console.log('✅ MongoDB connected successfully!');

        // Auto-seed initial test data if DB is empty
        try {
            const { seedIfNeeded } = require('../utils/autoSeeder');
            await seedIfNeeded();
        } catch (seedErr) {
            console.error('Auto seed error:', seedErr);
        }

        mongoose.connection.on('error', err => {
            console.error('MongoDB connection error: ', err);
        });
        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
        });
        mongoose.connection.on('reconnected', () => {
            console.log('MongoDB reconnected');
        });

        return connect;
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;