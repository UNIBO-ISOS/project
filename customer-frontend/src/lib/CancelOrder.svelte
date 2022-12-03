<script>
    import Button from "@smui/button";
    import Dialog, { Actions, Content, Title } from "@smui/dialog";
    import axios from "axios";

    let dialog = false;
    let dialogCancelOk = false;
    let dialogNoCancel = false;

    const handleCancelOrder = async () => {
        try {
            await axios.get(
                "http://localhost:3001/orders/cancel",
                {
                    params: {
                        businessKey: localStorage.getItem("businessKey"),
                    },
                }
            );
            dialogCancelOk = true;
        } catch (err) {
            dialogNoCancel = true;
            console.log(err);
        }
    };
</script>

<div>
    <Dialog bind:open={dialog}>
        <Title>Attenzione</Title>
        <Content>Sei sicuro di voler annullare l'ordine?</Content>
        <Actions>
            <Button
                variant="raised"
                on:click={() => {
                    handleCancelOrder();
                }}
            >
                Si
            </Button>
            <Button variant="raised" on:click={() => (dialog = false)}>
                No
            </Button>
        </Actions>
    </Dialog>

    <Dialog bind:open={dialogCancelOk}>
        <Title>Ordine annullato</Title>
        <Content>L'ordine è stato annullato.</Content>
        <Actions>
            <Button
                variant="raised"
                on:click={() => {
                    dialogCancelOk = false;
                }}
            >
                Ok
            </Button>
        </Actions>
    </Dialog>

    <Dialog bind:open={dialogNoCancel}>
        <Title>Ordine non annullato</Title>
        <Content>Non abbiamo potuto annullare il tuo ordine.</Content>
        <Actions>
            <Button
                variant="raised"
                on:click={() => {
                    dialogNoCancel = false;
                }}
            >
                Ok
            </Button>
        </Actions>
    </Dialog>

    <h2>Ordine correttamente effettuato</h2>
    Se desideri annullare l'ordine clicca il pulsante qui sotto.
    <p>
        <i>
            ATTENZIONE: non chiudere questa finestra se vuoi annullare l'ordine
        </i>
    </p>
    <Button variant="raised" on:click={() => (dialog = true)}
        >Annulla ordine</Button
    >
</div>
