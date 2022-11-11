import { GeoJsonTypes } from "geojson";
import { model, Schema } from "mongoose";

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
});

const City = model<ICity>('cities', citySchema, 'cities');

export { City };
