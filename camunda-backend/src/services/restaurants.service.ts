import axios from "axios";
import { HandlerArgs, Variables } from "camunda-external-task-client-js";
import { Types } from "mongoose";
import { Calendar, Restaurant } from "../repository/restaurants.repo";

export const RetreiveRestaurants = async ({ task, taskService }: HandlerArgs) => {
    const start = new Date()
    start.setHours(0, 0, 0, 0)

    const end = new Date()
    end.setHours(23, 59, 59, 99)

    const cityId = task.variables.get('cityId');

    const todayUnavailability = await Calendar.find({ date: { $gte: start.toISOString(), $lt: end.toISOString() } }, { id_restaurant: true })
    let query: any = {
        _id: { $nin: todayUnavailability.map((item) => { return item.id_restaurant }) }
    }
    query.city = new Types.ObjectId(cityId)

    const restaurants = await Restaurant.find(query)
        .populate('city')


    let variables = new Variables();
    variables.setAll(task.variables.getAll());
    variables.set('restaurants', restaurants);

    await taskService.complete(task, variables);
}

export const ReturnRestaurants = async ({ task, taskService }: HandlerArgs) => {
    const restaurants = task.variables.get('restaurants');

    const bk = task.businessKey;
    await axios.post('http://customer-server:3001/restaurants', restaurants, { headers: { businessKey: bk } });

    // Complete the task
    await taskService.complete(task, task.variables);
}

export const AskRestaurantAvailability = async ({ task, taskService }: HandlerArgs) => {
    const restaurant = task.variables.get('restaurant');

    await taskService.complete(task, task.variables);

    await axios.get(`http://restaurant-service:5000/api/restaurants/${restaurant}/availability`, {
        params: {
            bk: task.businessKey
        }
    })

}