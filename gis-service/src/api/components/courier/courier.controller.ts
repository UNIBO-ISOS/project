import { Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { moveTokenGetCouriers } from '../../helper/helper';
import { Courier } from './courier.model';


const getCouriers = async (req: Request, res: Response, next: any) => {
    try {
        if (!req.query.lat || !req.query.lng || !req.query.bk) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: ReasonPhrases.BAD_REQUEST })
        }
        let courierPoint: any = {
            type: 'Point',
            coordinates: [parseFloat(req.query.lng.toString()), parseFloat(req.query.lat.toString())]
        }
        const documents = await Courier.find({
            location: {
                $near: {
                    $geometry: courierPoint,
                    $maxDistance: parseInt(process.env.MAX_DISTANCE!)
                }
            }
        });

        await moveTokenGetCouriers(documents.map((c: any) => c._id), req.query.bk)

        return res.status(StatusCodes.OK).json({ documents })
    } catch (err) {
        return next(err)
    }
}

export { getCouriers };
