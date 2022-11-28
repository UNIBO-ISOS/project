<script>
    // @ts-nocheck

    import Button, { Label } from "@smui/button";
    import Card, { Content } from "@smui/card";
    import List, { Item, Text } from "@smui/list";

    /**
     * - name: string
     * - desc: string
     * - price: number
     * - items: [name, category]
     */
    export let menu;

    export let handleAddToCart;
</script>

<div class="card-container">
    <Card>
        <Content>
            <h3>{menu.name}</h3>
            {menu.desc}
            <List>
                {#each menu.items as item}
                    <Item>
                        <Text>{item.name}</Text>
                    </Item>
                {/each}
            </List>
            Price: ${menu.price}
        </Content>
        <Button on:click={() => handleAddToCart()}>
            <Label>Aggiungi al carrello</Label>
        </Button>
    </Card>
</div>

<style>
    .card-container {
        margin: 2rem 0;
        width: 20vw;
    }
</style>
