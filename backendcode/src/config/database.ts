import mongoose from 'mongoose';
// In test/development environments where a real MongoDB instance isn't available,
// allow spinning up an in-memory server by setting MONGODB_URI=memory
let memoryServer: any = null;

export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || '';
    if (!mongoURI) {
      throw new Error('MONGODB_URI is not set');
    }

    if (mongoURI === 'memory') {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      memoryServer = await MongoMemoryServer.create();
      const uri = memoryServer.getUri();
      await mongoose.connect(uri);
    } else {
      await mongoose.connect(mongoURI);
    }

    console.log('MongoDB Connected Successfully');
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    process.exit(1);
  }
};

process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    if (memoryServer) {
      await memoryServer.stop();
    }
  } finally {
    process.exit(0);
  }
});
