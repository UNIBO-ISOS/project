<script>
    import Textfield from "@smui/textfield";
    export let address;
</script>

<div>
    <h3>Inserisci il tuo indirizzo</h3>
    <Textfield
        bind:value={address}
        label="Indirizzo"
        style={"width: 100%"}
        variant="filled"
    >
        <!-- <HelperLine>Inserisci il tuo indirizzo</HelperLine> -->
    </Textfield>
</div>
