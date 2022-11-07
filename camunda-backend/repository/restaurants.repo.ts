import { GeoJsonTypes } from "geojson";
import { model, ObjectId, Schema } from "mongoose";


interface IRestaurant {
    name: String,
    city: ObjectId,
    user: ObjectId,
    location: {
        type: GeoJsonTypes, coordinates: number[]
    },
    hours: [
        {
            day: String,
            timetable: [
                {
                    start: String,
                    finish: String
                }
            ]
        }
    ],
    menu: [
        {
            name: String,
            desc: String,
            price: number,
            items: [
                {
                    name: String,
                    category: number
                }
            ],
            categories: [
                String
            ]
        }
    ]
}


const restaurantSchema = new Schema<IRestaurant>({
    name: { type: String, required: true },
    city: { type: Schema.Types.ObjectId, ref: 'cities', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    hours: [
        {
            _id: false,
            day: {
                type: String,
                enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                required: true
            },
            timetable: [
                {
                    _id: false,
                    start: { type: String, required: true },
                    finish: { type: String, required: true }
                }
            ]
        }
    ],
    menu: [
        {
            name: { type: String, required: true },
            desc: { type: String, required: true },
            items: [
                {
                    name: { type: String, required: true },
                    price: { type: Number, required: true },
                    category: [
                        { type: Number, required: true }
                    ]
                }
            ],
            categories: [
                { type: String, required: true }
            ]
        }
    ]
});

export const Restaurant = model<IRestaurant>('restaurants', restaurantSchema, 'restaurants');

interface IclosedRestaurantCalendar {
    id_restaurant: ObjectId,
    date: Date,
    motivation: String
}

const closedRestaurantCalendar = new Schema<IclosedRestaurantCalendar>({
    id_restaurant: { type: Schema.Types.ObjectId, ref: 'restaurant', required: true },
    date: { type: Date, required: true, default: (new Date()).setHours(0, 0, 0, 0) },
    motivation: { type: String, required: true }
});

closedRestaurantCalendar.index({ id_restaurant: 1, date: 1 }, { unique: true })

export const Calendar = model<IclosedRestaurantCalendar>('calendar', closedRestaurantCalendar, 'calendar')
