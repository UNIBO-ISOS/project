<script>
    import Select, { Option } from "@smui/select";
    export let hour;

    const range = (a, b, step) => {
        let arr = [];
        for (let i = a; i <= b; i += step) {
            arr.push(i);
        }

        return arr;
    };

    const toHour = (num) => {
        let hour = Math.floor(num);
        let minutes = Math.floor((num - hour) * 60);

        return `${hour}:${minutes < 10 ? "0" : ""}${minutes}`;
    };

    const hourRange = (start, end, step) => {
        return range(start, end, step).map(toHour);
    };

    const currentHour = new Date().getHours();

    // dev only
    const lunch = 12
    // const lunch = Math.max(12, currentHour);
    
    // dev only
    const dinner = 19
    // const dinner = Math.max(19, currentHour);

    const hours = [
        ...hourRange(lunch, 14, 0.25),
        ...hourRange(dinner, 21, 0.25),
    ];
</script>

<div style="flex: 1">
    <h2>Seleziona l'orario di consegna</h2>
    {#if hours.length <= 0}
    <div> Il servizio non è più attivo per oggi. </div>
    {:else}
        <Select variant="outlined" bind:value={hour} style="width: 100%">
            {#each hours as hour}
                <Option value={hour}>{hour}</Option>
            {/each}
        </Select>
    {/if}
</div>
