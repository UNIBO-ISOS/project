<script>
    // @ts-nocheck

    import Button, { Label } from "@smui/button";
    import Card, { Actions, Content } from "@smui/card";
    /* 
    - name: string
    - hours: Array
    */
    export let restaurant;
    export let onClick;
</script>

<div class="card-container">
    <Card style="width: 20vw">
        <Content class>
            {restaurant.name}
        </Content>
        <Actions fullBleed>
            <Button on:click={onClick}>
                <Label>View Menu</Label>
            </Button>
        </Actions>
    </Card>
</div>

<style>
</style>
