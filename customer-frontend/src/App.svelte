<script>
  import CartSummary from "./lib/CartSummary.svelte";
  import SelectCity from "./lib/SelectCity.svelte";
  import SelectHour from "./lib/SelectHour.svelte";
  import SelectMenu from "./lib/SelectMenu.svelte";
  import SelectRestaurant from "./lib/SelectRestaurant.svelte";

  // Control the flow of the app
  let city;
  $: isCitySelected = city != undefined;

  let restaurant;
  $: isRestaurantSelected = restaurant != undefined;

  let hour;
  $: isHourSelected = hour != undefined;

  $: firstCondition = isHourSelected && isCitySelected;
  $: console.log(firstCondition);

  let cart;
  $: isCartSelected = cart != undefined && cart.length > 0;
  $: console.log(cart);

  // When changing restaurant, reset the cart
  // $: restaurant, cart = []
</script>

<main>
  <div class="container">
    <h1>Benvenuto su ACMEat</h1>
    <div style="display: flex;">
      <div style="flex: 3">
        {#if !isHourSelected || !isCitySelected}
          <SelectCity bind:city />
          <SelectHour bind:hour />
        {/if}

        <!-- {#if isHourSelected} -->
        {#if isHourSelected && isCitySelected}
          <SelectRestaurant bind:restaurant {city} />
        {/if}

        {#if isRestaurantSelected}
          <SelectMenu bind:cart {restaurant} />
        {/if}
      </div>

      {#if isCartSelected}
        <div style="flex: 1">
          <CartSummary bind:cart {hour} />
        </div>
      {/if}
    </div>
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

  h1 {
    text-align: center;
  }
</style>
