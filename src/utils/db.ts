// mongoose for mongodb connect 
import mongoose from 'mongoose';

// mongoose for mongodb connect
import { KEYS } from '../../config/keys'
export const connectToDb = async () =>{
  try {
    await mongoose.connect(KEYS.MONGO_URI)
    console.log("connected to db")
  } catch (error) {
    throw new Error(`error connecting to db  ${error}`)
  }
}