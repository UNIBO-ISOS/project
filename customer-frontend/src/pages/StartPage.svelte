<script>
    import Button from "@smui/button";
    import RoadField from "../lib/RoadField.svelte";
    import SelectCity from "../lib/SelectCity.svelte";
    import SelectHour from "../lib/SelectHour.svelte";

    export let city, hour, address, nextStep;

    const handleClick = () => {
        nextStep = true;
    };
</script>

<div>
    <div style="display: flex; flex-direction: row; gap: 10px">
        <SelectCity bind:city />
        <SelectHour bind:hour />
    </div>
    <RoadField bind:address />
    <Button
        style="margin-top: 10px"
        variant="raised"
        disabled={!city || !hour || !address}
        on:click={handleClick}>Prosegui</Button
    >
</div>
