<script>
    import Button from "@smui/button";
    import Dialog, { Actions, Content, Title } from "@smui/dialog";
    import List, { Item, Text } from "@smui/list";
    import SnackBar, { Label } from "@smui/snackbar";
    import TextField from "@smui/textfield";
    import axios from "axios";
    export let cart;
    export let hour;
    export let address;
    export let orderEmitted;

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

    const toList = (d) => {
        let arr = [];
        for (let key in d) {
            arr.push(d[key]);
        }

        return arr;
    };

    $: finalPrice = cart.reduce((acc, curr) => acc + curr.price, 0);

    let openDialog = false;

    let dialogOrderUnavailable = false;
    let processingOrder = false;
    const handlePayment = async () => {
        localStorage.setItem("price", finalPrice);
        processingOrder = true;
        try {
            console.log(cart.map((m) => m._id));
            await axios.post(
                "http://localhost:3001/orders/",
                {
                    restaurantId: cart[0].restaurantId,
                    price: finalPrice,
                    menu: cart.map((m) => m._id),
                    hour,
                    address
                },
                {
                    params: {
                        businessKey: localStorage.getItem("businessKey"),
                    },
                }
            );
                
            processingOrder = false;
            openDialog = true;
            window.open("http://localhost:9090", "_blank").focus();
        } catch (err) {
            processingOrder = false;
            dialogOrderUnavailable = true;
        }
    };

    let snackBar;
    let snackBarText = "";
    const handleSendToken = async () => {
        try {
            await axios.post(
                "http://localhost:3001/orders/sendToken",
                { token, amount: finalPrice },
                {
                    params: {
                        businessKey: localStorage.getItem("businessKey"),
                    },
                }
            );

            snackBarText = "Token convalidato correttamente";
            orderEmitted = true;
        } catch (err) {
            console.log(err);
            snackBarText = "Errore nell'invio del token";
        } finally {
            openDialog = false;
            console.log("end");
            snackBar.open();
        }
    };

    let token = "";
</script>

<div>
    <h2>Il tuo carrello</h2>
    <Dialog bind:open={processingOrder} escapeKeyAction="" scrimClickAction="">
        <Title>Attendi</Title>
        <Content>Stiamo processando il tuo ordine</Content>
    </Dialog>
    
    <Dialog bind:open={openDialog} escapeKeyAction="" scrimClickAction="">
        <Title>Token</Title>
        <Content>
            Inserisci il token ricevuto dalla tua banca
            <TextField style={"width: 100%"} bind:value={token} label="Token" />
        </Content>
        <Actions>
            <Button
                on:click={() => {
                    handleSendToken();
                }}>Invia</Button
            >
        </Actions>
    </Dialog>

    <Dialog bind:open={dialogOrderUnavailable}>
        <Title>Ordine non disponibile</Title>
        <Content>Il tuo ordine non è disponibile.</Content>
        <Actions>
            <Button
                on:click={() => {
                    dialogOrderUnavailable = false;
                }}>Ok</Button
            >
        </Actions>
    </Dialog>

    <SnackBar bind:this={snackBar}>
        <Label>{snackBarText}</Label>
    </SnackBar>

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
        <Button on:click={() => handlePayment()} variant="raised"
            >Conferma</Button
        >
    </div>
</div>

<style>
    .summary-confirm {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
</style>
