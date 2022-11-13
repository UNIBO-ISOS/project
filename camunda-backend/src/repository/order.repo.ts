import { model, Schema } from "mongoose";

interface IOrder {
    status: string;
    courierId?: string;
    restaurantId?: string;
    price?: number;
}

const orderSchema = new Schema<IOrder>({
    status: { type: String, required: true },
    courierId: { type: String, required: false },
    restaurantId: { type: String, required: false },
    price: { type: Number, required: true }
});

export const Order = model<IOrder>('orders', orderSchema, 'orders');