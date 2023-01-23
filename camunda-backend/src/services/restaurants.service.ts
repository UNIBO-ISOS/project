import axios from "axios";
import { HandlerArgs, Variables } from "camunda-external-task-client-js";
import { Types } from "mongoose";
import { Calendar, Restaurant } from "../repository/restaurants.repo";
import { variablesFrom } from "./couriers.service";

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

    const restuarantServiceEndpoint = process.env.RESTAURANT_SERVER_URL!
    await axios.get(`${restuarantServiceEndpoint}/api/restaurants/${restaurant}/availability`, {
        params: {
            bk: task.businessKey
        }
    })
}

export const VerifyUpdateConditions = async ({ task, taskService }: HandlerArgs) => {
    let pv = variablesFrom(task.variables);
    const todoUpdate = pv.get('update')
    const updateDate = new Date(todoUpdate.date)

    const now = new Date()

    // Update date must be > today
    // if not today must be < 10
    console.log(updateDate)
    console.log(now)
    if (updateDate.getDate() > now.getDate() + 1) {
        pv.set('canUpdate', true);
        await taskService.complete(task, pv);
    } else if (updateDate.getDate() <= now.getDate()) {
        pv.set('canUpdate', false);
        await taskService.complete(task, pv);
    }

    pv.set('canUpdate', now.getHours() < 10);
    await taskService.complete(task, pv);
}

export const UpdateRestaurantInfo = async ({ task, taskService }: HandlerArgs) => {
    try {
        const restaurantUpdate = task.variables.get('update');

        console.log(restaurantUpdate);
        const restaurantId = task.variables.get('restaurantId');
        switch (restaurantUpdate.type) {
            case 'unavailability':
                delete restaurantUpdate.type
                console.log('hello')
                const { date, motivation } = restaurantUpdate
                console.log(restaurantUpdate);

                const calendar = new Calendar({ date, motivation, id_restaurant: restaurantId });
                await calendar.save();
                break
            case 'menu':
                delete restaurantUpdate.type

                await Restaurant.findOneAndUpdate({ _id: restaurantId }, restaurantUpdate)
                break
            default:
                console.log('Unknown update type')
        }
    } catch (error) {
        console.log(error)
    } finally {
        await taskService.complete(task, task.variables);
    }
}

export const SendRestaurantNotUpdated = async ({ task, taskService }: HandlerArgs) => {
    const reastaurantId = task.variables.get('restaurantId');
    const restuarantServiceEndpoint = process.env.RESTAURANT_SERVER_URL!
    await axios.post(`${restuarantServiceEndpoint}/api/restaurants/${reastaurantId}/updateResponse`, {
        message: 'You could not update your restaurant info',
        result: false
    }, {
        params: {
            businessKey: task.businessKey
        }
    })
    console.log('You could not update your restaurant info')

    await taskService.complete(task, task.variables);
}

export const SendRestaurantUpdated = async ({ task, taskService }: HandlerArgs) => {
    const reastaurantId = task.variables.get('restaurantId');
    const restuarantServiceEndpoint = process.env.RESTAURANT_SERVER_URL!
    await axios.post(`${restuarantServiceEndpoint}/api/restaurants/${reastaurantId}/updateResponse`, {
        message: 'Restaurant information updated suscessfully',
        result: true
    }, {
        params: {
            businessKey: task.businessKey
        }
    })
    console.log('Restaurant information updated suscessfully')

    await taskService.complete(task, task.variables);
}