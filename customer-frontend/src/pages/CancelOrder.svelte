<script>
    import Button from "@smui/button";
    import Textfield from "@smui/textfield";
    let order = "";
    $: canCancel = order == "";

    const delay = (ms) => new Promise((res) => setTimeout(res, ms));
    const getData = async () => {
        await delay(1000);
        return true;
    };

    let esito;
</script>

<div class="container">
    <h2>Inserisci il codice dell'ordine</h2>
    <Textfield
        variant="outlined"
        bind:value={order}
        label="ID"
        style={"width:100%"}
    />

    <Button
        variant="raised"
        disabled={canCancel}
        on:click={() => (esito = getData())}>Annulla ordine</Button
    >
    {#await esito}
        Wait...
    {:then esito}
        {#if esito != undefined}
            {esito}
        {/if}
    {:catch error}
        Error: {error.message}
    {/await}
</div>

<style>
    .container {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
</style>
