import { HandlerArgs, Variables } from "camunda-external-task-client-js";

export const RetreiveRestaurants = async ({ task, taskService }: HandlerArgs) => {
    // FIXME: retrieve restaurants from db
    const restaurants = [
        {
            city: "Modena",
            name: "Ristorante Pizzeria La Taverna",
        },
        {
            city: "Modena",
            name: "Ristorante Pizzeria La Taverna 2",
        },
        {
            city: "Bologna",
            name: "Ristorante 2",
        },
        {
            city: "Bologna",
            name: "Ristorante 3",
        },
        {
            city: "Ferrara",
            name: "Ristorante 4",
        },
        {
            city: "Ferrara",
            name: "Ristorante 5",
        },
    ];

    console.log(task.variables.getAll())
    const city = task.variables.get('city');
    console.log("city:", city)

    let variables = new Variables();
    variables.setAll(task.variables.getAll());
    variables.set('restaurants', restaurants.filter(r => r.city === city));

    await taskService.complete(task, variables);
}

export const ReturnRestaurants = async ({ task, taskService }: HandlerArgs) => {
    const restaurants = task.variables.get('restaurants');
    // TODO: send restaurants to endpoint

    // Complete the task
    await taskService.complete(task, task.variables);
}