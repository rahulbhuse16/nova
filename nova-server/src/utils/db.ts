import mongoose from 'mongoose'
import { ENV } from '../config/env'


export const connectDB=async()=>{

    try{

        await mongoose.connect(ENV.DB_URL)
        console.log("connected to db")


    }
    catch(err){
        console.log("conn err",err)
    

    }

}