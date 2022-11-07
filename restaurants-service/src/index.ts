import express, { Express, Request, Response, ErrorRequestHandler } from 'express';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import dotenv from 'dotenv';
import cors from 'cors';

// load environment
dotenv.config();

import util from 'util';

import { connectToDatabase } from "./database/connection"

// import API
import { router as api } from "./api/index"
import mongoose from 'mongoose';

const port = process.env.PORT || 3000;
const app: Express = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded( { extended: true } ));
app.use(cors({
    origin: "http://localhost"
}))

app.use('/api', api);

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {

    console.log(err)

    if(err instanceof mongoose.Error.ValidationError) {
        return res.status(StatusCodes.BAD_REQUEST).json({error: 'Validation Error (MongoDB)'})
    }

    if(err.name === 'MongoServerError' && err.code === 11000){
        return res.status(StatusCodes.CONFLICT).json({error: 'Duplicate'})
    }

    if(err.name === 'UnauthorizedError') {
        return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Invalid Token' })
    }

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: ReasonPhrases.INTERNAL_SERVER_ERROR })
}
app.use(errorHandler)

process.on('unhandledRejection', (reason, promise) => {
    const promiseString = util.inspect(promise, true);
    const reasonString = util.inspect(reason, true);
    const log = util.format('LOG: Unhandled rejection at %s reason %s', promiseString, reasonString)
    console.log(log)
})

process.on('uncaughtException', (error, origin) => {
    const errorString = util.inspect(error, true);
    const log = util.format('LOG: Caught exception: %s\n Exception origin: %s', errorString, origin)
    console.log(log)
})

connectToDatabase()

app.listen(port, () => {
    console.log("Listening on " + port)
})