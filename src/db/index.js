import mongoose from "mongoose";
import {DB_NAME} from "./constants.js"


const connectDb = async ()=>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
       console.log(`\n MONGODB CONNECTED UWU  ${connectionInstance.connection.host}`);
       
        app.on("error",(error)=>{
            console.log(error);
            process.exit(1);
        })

    } catch (error) {
        console.log("mongo err", err);
        throw err;
    }
}

export default connectDb