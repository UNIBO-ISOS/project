import mongoose, { ConnectOptions } from "mongoose";

export async function connectToDatabase() {
    const uri = `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`
    console.log(uri)
    const options = {
        /*user: process.env.MONGO_USER,
        pass: process.env.MONGO_PASSWORD,*/
        keepAlive: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
    } as ConnectOptions
    try{
        await mongoose.connect(uri, options)
    } catch(err) {
        console.log('Initial connection error!')
    }
}

mongoose.connection.on('connected', () => {
    console.log('db connected!')
})

// todo: handle disconnection
mongoose.connection.on('error', err => {
    console.log('db error: ', err)
})

mongoose.connection.on('disconnected', () => {
    console.log('db disconnected!')
})