<script>
  import CancelOrder from "../lib/CancelOrder.svelte";
  import CartSummary from "../lib/CartSummary.svelte";
  import SelectMenu from "../lib/SelectMenu.svelte";
  import SelectRestaurant from "../lib/SelectRestaurant.svelte";
  import StartPage from "./StartPage.svelte";

  // Control the flow of the app
  let city;
  
  let hour;  
  
  let address = '';
  let nextStep = false;

  let restaurant;
  $: isRestaurantSelected = restaurant != undefined;

  let cart;
  $: isCartSelected = cart != undefined && cart.length > 0;
  $: console.log(cart);

  let orderEmitted = false;

  // When changing restaurant, reset the cart
  // $: restaurant, cart = []
</script>

<div>
  {#if !orderEmitted}
    {#if !nextStep}
      <StartPage bind:city bind:address bind:hour bind:nextStep />
    {/if}

    <div style="display: flex; gap: 10px; justify-content: space-around;">
      {#if nextStep}
        <div style="flex: 3">
          <SelectRestaurant bind:restaurant {city} />

          {#if isRestaurantSelected}
            <SelectMenu bind:cart {restaurant} />
          {/if}
        </div>
      {/if}

      {#if isCartSelected}
        <div style="flex: 1">
          <CartSummary bind:orderEmitted bind:cart {hour} {address} />
        </div>
      {/if}
    </div>
  {:else}
    <CancelOrder />
  {/if}
</div>
