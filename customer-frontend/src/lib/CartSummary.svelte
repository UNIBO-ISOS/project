<script>
    import Button from "@smui/button";
    import List, { Item, Text } from "@smui/list";
    export let cart;

    const handleClick = (menu) => {
        cart = cart.filter((m) => m._id !== menu._id);
    };

    $: groupedCart = cart.reduce((acc, menu) => {
        if (acc[menu._id]) {
            acc[menu._id].quantity += 1;
        } else {
            acc[menu._id] = { ...menu, quantity: 1 };
        }

        return acc;
    }, {});
    $: console.log(groupedCart);

    const toList = (d) => {
        let arr = [];
        for (let key in d) {
            arr.push(d[key]);
        }

        return arr;
    };

    $: finalPrice = cart.reduce((acc, curr) => acc + curr.price, 0);
</script>

<div>
    <h2>Il tuo carrello</h2>
    <List>
        {#each toList(groupedCart) as menu}
            <Item
                style={"display: flex; justify-content: space-between; align-items: center;"}
                on:click={() => handleClick(menu)}
            >
                <Text>
                    {menu.name}: {menu.price}€
                </Text>
                <Text>{menu.quantity}</Text>
            </Item>
        {/each}
    </List>
    <div class="summary-confirm">
        <h3>Totale: {finalPrice}€</h3>
        <Button variant="raised">Conferma</Button>
    </div>
</div>

<style>
    .item {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
    .summary-confirm {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
</style>
