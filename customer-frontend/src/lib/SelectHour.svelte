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

    const hours = [...hourRange(12, 14, 0.25), ...hourRange(19, 21, 0.25)];
</script>

<div style="flex: 1">
    <h2>Seleziona l'orario di consegna</h2>
    <Select variant="outlined" bind:value={hour} style="width: 100%">
        {#each hours as hour}
            <Option value={hour}>{hour}</Option>
        {/each}
    </Select>
</div>
