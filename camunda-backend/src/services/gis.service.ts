import axios from "axios";
import { HandlerArgs } from "camunda-external-task-client-js";
import { City } from "../repository/cities.repo";

export const AskCouriersInRange = async ({ task, taskService }: HandlerArgs) => {
    const id = task.variables.get("cityId");
    const city = await City.findById(id)
    await taskService.complete(task, task.variables)
    console.log("Asking couriers in range completed after task complete");

    const gisServiceEndpoint = process.env.GIS_SERVER_URL!
    await axios.get(`${gisServiceEndpoint}/gis/couriers`, {
        params: {
            bk: task.businessKey,
            lat: city?.location.coordinates[1],
            lng: city?.location.coordinates[0],
        }
    });
}