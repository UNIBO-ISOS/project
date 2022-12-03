import { model, ObjectId, Schema } from "mongoose";

export interface IOrder {
    status: string;
    courierId?: ObjectId;
    restaurantId: ObjectId;
    price: number;
    menu: string[];
    hour: string;
}

const orderSchema = new Schema<IOrder>({
    status: { type: String, required: true },
    courierId: { type: Schema.Types.ObjectId, ref: 'couriers', required: false },
    restaurantId: { type: Schema.Types.ObjectId, ref: 'restaurants', required: true },
    price: { type: Number, required: true },
    menu: [{
        type: String
    }],
    hour: { type: String, required: true }
});

export const Order = model<IOrder>('orders', orderSchema, 'orders');