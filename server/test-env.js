import dotenv from 'dotenv';
dotenv.config();

console.log('Environment Variables:');
console.log('USE_MONGODB:', process.env.USE_MONGODB);
console.log('Type:', typeof process.env.USE_MONGODB);
console.log('Comparison result:', process.env.USE_MONGODB === 'true');
console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);