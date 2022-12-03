<script>
  import CancelOrder from "../lib/CancelOrder.svelte";
  import CartSummary from "../lib/CartSummary.svelte";
  import SelectCity from "../lib/SelectCity.svelte";
  import SelectHour from "../lib/SelectHour.svelte";
  import SelectMenu from "../lib/SelectMenu.svelte";
  import SelectRestaurant from "../lib/SelectRestaurant.svelte";

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

  let orderEmitted = false;

  // When changing restaurant, reset the cart
  // $: restaurant, cart = []
</script>

<div>
  {#if !orderEmitted}
    <div style="display: flex; gap: 10px; justify-content: space-around;">
      {#if !isHourSelected || !isCitySelected}
        <SelectCity bind:city />
        <SelectHour bind:hour />
      {/if}

      {#if isHourSelected && isCitySelected}
        <div style="flex: 3">
          <SelectRestaurant bind:restaurant {city} />

          {#if isRestaurantSelected}
            <SelectMenu bind:cart {restaurant} />
          {/if}
        </div>
      {/if}

      {#if isCartSelected}
        <div style="flex: 1">
          <CartSummary bind:orderEmitted bind:cart {hour} />
        </div>
      {/if}
    </div>
  {:else}
    <CancelOrder />
  {/if}
</div>
