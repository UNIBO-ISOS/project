<script>
    import Select, { Option } from "@smui/select";
    import axios from "axios";

    const loadOptions = async () => {
        const response = await axios.get(
            "http://localhost:3001/cities/",
        );
        const { businessKey, cities } = response.data;
        localStorage.setItem("businessKey", businessKey);

        return cities;
    };

    const options = loadOptions();

    export let city;
</script>

<div style="margin-top: 1rem;">
    <div>
        <h2>Seleziona il tuo comune</h2>

        {#await options}
            <div>Caricamento</div>
        {:then options}
            <Select variant="outlined" bind:value={city} style="width: 45vw;">
                {#each options as option}
                    <Option value={option}>{option.name}</Option>
                {/each}
            </Select>
        {:catch error}
            <div>Errore {error}</div>
        {/await}
    </div>
</div>
