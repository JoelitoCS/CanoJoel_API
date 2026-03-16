import mongoose from "mongoose";

export async function ConnectDB(){
  
  try{
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("Connected to MongoDB successfully")

    }catch(err){
        
        console.error('Error connectant a MongoDB:', err.message);
        process.exit(1);
    }

}