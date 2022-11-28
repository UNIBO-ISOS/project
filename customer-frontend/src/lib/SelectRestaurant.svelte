<script>
    import axios from "axios";
    import RestaurantCard from "./RestaurantCard.svelte";

    export let city;
    export let restaurant;

    const getRestaurants = async () => {
        const response = await axios.get("http://localhost:3001/restaurants/", {
            params: {
                cityId: city._id,
                businessKey: localStorage.getItem("businessKey"),
            },
        });

        return response.data;
    };

    const restaurants = getRestaurants();
</script>

<div>
    <h2>
        Questi sono i nostri ristoranti a {city.name}
    </h2>
    {#await restaurants}
        <p>Stiamo caricando i ristoranti...</p>
    {:then restaurants}
        <div class="restaurant-carousel">
            {#each restaurants as r}
                <RestaurantCard
                    restaurant={r}
                    onClick={() => {
                        restaurant = r;
                    }}
                />
            {/each}
        </div>
    {:catch error}
        <p>Error: {error}</p>
    {/await}
</div>

<style>
    .restaurant-carousel {
        display: flex;
        flex-direction: row;
        gap: 1vw;
        flex-wrap: wrap;
    }
</style>
