import { Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { Types } from 'mongoose';
import { EventEmitter } from 'stream';
import { moveToken, newProcess } from '../../util/util';
import { Calendar, Restaurant } from './restaurant.model';

let eventEmitter = new EventEmitter();

const getAllRestaurants = async (req: Request, res: Response, next: any) => {
    try {
        const start = new Date()
        start.setHours(0, 0, 0, 0)

        const end = new Date()
        end.setHours(23, 59, 59, 99)


        const todayUnavailability = await Calendar.find({ date: { $gte: start.toISOString(), $lt: end.toISOString() } }, { id_restaurant: true })

        let query: any = {
            _id: { $nin: todayUnavailability.map((item) => { return item.id_restaurant }) }
        }

        if (req.query.cityId) {
            const cityId: string = req.query.cityId.toString()
            query.city = new Types.ObjectId(cityId)
        }

        if (req.query.search) {
            query.name = new RegExp(req.query.search.toString(), 'i')
        }

        if (req.query.lat && req.query.lng) {
            query.location = {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(req.query.lat.toString()), parseFloat(req.query.lng.toString())]
                    },
                    $minDistance: req.query.minDistance ? parseInt(req.query.minDistance.toString()) : parseInt(process.env.MIN_DISTANCE!),
                    $maxDistance: req.query.maxDistance ? parseInt(req.query.maxDistance.toString()) : parseInt(process.env.MAX_DISTANCE!)
                }
            }
        }

        const documents = await Restaurant.find(query)
            .populate('city')

        return res.status(StatusCodes.OK).json({ restaurants: documents })
    } catch (err) {
        return next(err)
    }
}

const updateRestaurants = async (req: Request, res: Response, next: any) => {
    try {
        const document = req.body
        const idRestaurant = req.params.restaurantId

        const updatedDocument = await Restaurant.findOneAndUpdate({ _id: idRestaurant }, document, { runValidators: true })

        if (!updatedDocument) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: ReasonPhrases.NOT_FOUND })
        }

        return res.status(StatusCodes.OK).json({ id: updatedDocument._id })

    } catch (err) {
        return next(err);
    }
}

const notifyUnavailability = async (req: Request, res: Response, next: any) => {
    try {
        let document = req.body
        const idRestaurant = req.params.restaurantId

        document.id_restaurant = idRestaurant

        const unavailabilityToSave = new Calendar(document)
        const doc = await unavailabilityToSave.save()

        return res.status(StatusCodes.CREATED).json({ id: doc._id })
    } catch (err) {
        return next(err)
    }
}

const getRestaurant = async (req: Request, res: Response, next: any) => {
    try {
        const restaurantId = req.params.restaurantId

        const restaurant = await Restaurant.findById(restaurantId)

        if (!restaurant) {
            return res.status(StatusCodes.OK).json({ error: ReasonPhrases.NOT_FOUND })
        }

        return res.status(StatusCodes.OK).json({ restaurant: restaurant })

    } catch (err) {
        return next(err)
    }
}

const getRestaurantAvailability = async (req: Request, res: Response, next: any) => {
    const restaurantId = req.params.restaurantId
    const bk = req.query.bk
    if (!restaurantId || !bk) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: ReasonPhrases.BAD_REQUEST })
    }
    console.log(restaurantId)
    const restaurant = await Restaurant.findById(restaurantId)
    if (!restaurant) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: ReasonPhrases.BAD_REQUEST })
    }
    const timestamp = Date.now()
    // const availability = timestamp % 2 == 0
    const availability = true

    console.log(`Restaurant: ${restaurant.name} Timetsamp: ${timestamp} Availability: ${availability}`)

    const message = availability ? process.env.MESSAGE_RESTAURANT_AVAILABLE! : process.env.MESSAGE_RESTAURANT_UNAVAILABLE!

    //todo: aggiornare, body POST a seconda dei dati necessari ad acme
    const body = {
        "messageName": message,
        "businessKey": bk,
        // "processVariables": {
        //     "restaurants": {
        //         "value": availability,
        //         "type": "Boolean"
        //     }
        // }
    }

    await moveToken(body)

    return res.status(StatusCodes.OK).json({ restaurant: restaurant.name, timestamp: timestamp, avilability: availability })
}

export const updateRestaurantInfo = async (req: Request, res: Response, next: any) => {
    try {
        const restaurantId = req.params.restaurantId
        const update = req.body

        const restaurant = await Restaurant.findById(restaurantId)
        if (!restaurant) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: ReasonPhrases.NOT_FOUND })
        }

        const bk = await newProcess(process.env.RESTAURANT_UPDATE_PROCESS!)

        const body = {
            "messageName": process.env.MESSAGE_RESTAURANT_UPDATE!,
            "businessKey": bk,
            "processVariables": {
                "restaurantId": {
                    "value": restaurantId,
                    "type": "String"
                },
                "update": {
                    "value": JSON.stringify(update),
                    "type": "Json"
                }
            }
        }
        moveToken(body)

        eventEmitter.once(bk, (data) => {
            console.log('inside once')
            console.log(data)
            if (data.success) {
                return res.status(StatusCodes.OK).json(data)
            } else {
                return res.status(StatusCodes.BAD_REQUEST).json(data)
            }
        })
    } catch (err) {
        next(err)
    }
}

export const waitForUpdateResponse = async (req: Request, res: Response, next: any) => {
    // const { businessKey } = req.query
    const businessKey = req.query.businessKey as string
    const update = req.body

    console.log(businessKey)

    eventEmitter.emit(businessKey, update)

    return res.status(StatusCodes.OK).json({ message: 'ok' })
}

export { getAllRestaurants, updateRestaurants, notifyUnavailability, getRestaurant, getRestaurantAvailability };
