import axios from 'axios';
import { HandlerArgs, Variables } from "camunda-external-task-client-js";
import { City } from "../repository/cities.repo";

export const RetreiveCities = async ({ task, taskService }: HandlerArgs) => {
    const cities = (await City.find({}, { name: true }))


    let variables = new Variables();
    variables.set('cities', cities);

    // Complete the task
    await taskService.complete(task, variables);
}

export const ReturnCities = async ({ task, taskService }: HandlerArgs) => {
    const cities = task.variables.get('cities');

    console.log(`Cities: ${JSON.stringify(cities)}`);
    const bk = task.businessKey;

    const customerEndpoint = process.env.CUSTOMER_SERVER_URL!
    await axios.post(`${customerEndpoint}/cities`, cities, { headers: { businessKey: bk } });
    console.log(`Posted to customer-server`);

    // console.log(`return-cities service: ${cities}`);

    // Complete the task
    await taskService.complete(task, task.variables);
}