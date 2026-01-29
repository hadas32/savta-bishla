import mongoose from "mongoose";
export async function connectDB(dbName){
    try {
        const DB_URI = `mongodb://localhost:27017/${dbName}`;
        await mongoose.connect(DB_URI);
        console.log('mongo connected succesfuly');
    } catch (error) {
        console.log('ERROR', error.message);
    }
}