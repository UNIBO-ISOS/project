import { Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import axios from 'axios'

const checkDeadline = async (req: Request, res: Response, next: any) => {
    const deadLineToday = new Date()
    deadLineToday.setHours(10, 0, 0, 0)
    const deadlineMillis = deadLineToday.getMilliseconds()

    const nowMillis = Date.now()

    // check if the menù of the restaurants is updated before the 10:00am
    if(nowMillis > deadlineMillis) { 
        return res.status(StatusCodes.PRECONDITION_FAILED).json({ error: ReasonPhrases.PRECONDITION_FAILED})
    }

    next()
}

const checkUnavailability = async (req: Request, res: Response, next: any) => {
    const deadLineToday = new Date()
    deadLineToday.setHours(10, 0, 0, 0)
    const todayMillis = deadLineToday.getMilliseconds()

    const nowMillis = Date.now()

    // if the unavailability is the current day the notification must be done before 10:00am
    if(!req.body.date && nowMillis > todayMillis) { 
        return res.status(StatusCodes.PRECONDITION_FAILED).json({ error: ReasonPhrases.PRECONDITION_FAILED})
    }

    if(req.body.date) {
        const bodyDate = new Date(req.body.date)
        bodyDate.setHours(0, 0, 0, 0)

        deadLineToday.setHours(0, 0, 0, 0)
        deadLineToday.setDate(deadLineToday.getDate() + 1)

        // if the day is specified in the body of the request, check if that day is already passed
        if(bodyDate.getMilliseconds < deadLineToday.getMilliseconds) {
            return res.status(StatusCodes.PRECONDITION_FAILED).json({ error: ReasonPhrases.PRECONDITION_FAILED })
        }
    }

    return next()
}

const moveToken = async (body: any) => {
    await axios.post(process.env.CAMUNDA_URL!, body)
}

export { checkDeadline, checkUnavailability, moveToken }