<script>
    import MenuCard from "./MenuCard.svelte";

    export let restaurant;
    export let cart = [];
    console.log(restaurant)

    const handleAddToCart = (item) => {
        if (cart.length > 0 && cart[0].restaurantId !== restaurant._id) {
            alert("Non puoi aggiungere piatti di ristoranti diversi!");
            return;
        }

        cart = [...cart, { ...item, restaurantId: restaurant._id }];
    };
</script>

<div>
    <h2>
        Questo è il menu di {restaurant.name}
    </h2>
    <div class="menu-container">
        {#each restaurant.menu as m}
            <MenuCard handleAddToCart={() => handleAddToCart(m)} menu={m} />
        {/each}
    </div>
</div>

<style>
    .menu-container {
        display: flex;
        flex-direction: row;
        gap: 1vw;
        flex-wrap: wrap;
    }
</style>
