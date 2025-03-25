import mongoose from 'mongoose'

export const connectDb = async () => {
    try{
       const conn = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`Connected to database ${conn.connection.host}`)
        
    } catch (error){
        console.log('Sorry something went wrong', error)
        process.exit(1);

    }
}