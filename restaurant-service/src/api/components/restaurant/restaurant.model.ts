import { GeoJsonTypes } from 'geojson';
import { Schema, model, ObjectId, Date } from 'mongoose';

interface ICity {
    name: String,
    location: {
        type: GeoJsonTypes, coordinates: number[]
    }
}

const citySchema = new Schema<ICity>({
    name: { type: String, required: true },
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
    }
})

interface IRestaurant {
    name: String,
    city: ObjectId,
    location: {
        type: GeoJsonTypes, coordinates: number[]
    },
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
    //user: { type: Schema.Types.ObjectId, ref: 'user', required: true },
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

restaurantSchema.index({ 'location': '2dsphere' })

interface IclosedRestaurantCalendar {
    id_restaurant: ObjectId,
    date: Date,
    motivation: String
}

const closedRestaurantCalendar = new Schema<IclosedRestaurantCalendar>({
    id_restaurant: { type: Schema.Types.ObjectId, ref: 'restaurants', required: true },
    date: { type: Date, required: true, default: (new Date()).setHours(0, 0, 0, 0) },
    motivation: { type: String, required: true}
});

closedRestaurantCalendar.index({ id_restaurant: 1, date: 1 }, { unique: true })

const City = model<ICity>('cities', citySchema, 'cities')
const Restaurant = model<IRestaurant>('restaurants', restaurantSchema, 'restaurants')
const Calendar = model<IclosedRestaurantCalendar>('calendar', closedRestaurantCalendar, 'calendar')

export { Restaurant, Calendar, City }