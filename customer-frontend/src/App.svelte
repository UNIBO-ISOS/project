<script>
  import MenuCard from "./lib/MenuCard.svelte";
  import RestaurantCard from "./lib/RestaurantCard.svelte";
  import SelectCity from "./lib/SelectCity.svelte";
  import SelectRestaurant from "./lib/SelectRestaurant.svelte";

  // Control the flow of the app
  let city;
  $: isCitySelected = city != undefined;

  const sampleRestaurant = { name: "Restaurant Name", hours: [] };

  const restaurants = Array(5).fill(sampleRestaurant);

  const sampleMenu = {
    name: "Menu Name",
    desc: "Menu Description",
    price: 10,
    items: [
      { name: "Item 1", category: "Category 1" },
      { name: "Item 2", category: "Category 1" },
    ],
  };

  let restaurant;
  $: isRestaurantSelected = restaurant != undefined;

  let menu;
</script>

<main>
  <div class="container">
    <h1>Benvenuto su ACMEat</h1>

    {#if !isCitySelected}
      <SelectCity bind:city />
    {/if}

    {#if isCitySelected}
      <SelectRestaurant {restaurant} {city} />
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
    {/if}

    {#if isRestaurantSelected}
      <MenuCard menu={sampleMenu} />
    {/if}
  </div>
</main>

<style>
  .container {
    margin: auto;
    width: 65vw;
    background-color: white;
    padding: 2.5vh 2.5vw;
    min-height: 95vh;
  }

  .restaurant-carousel {
    display: flex;
    flex-direction: row;
    gap: 1vw;
    flex-wrap: wrap;
  }

  h1 {
    text-align: center;
  }
</style>
