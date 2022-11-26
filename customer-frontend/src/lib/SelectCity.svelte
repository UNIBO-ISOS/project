<script>
    import Select, { Option } from "@smui/select";
    import axios from "axios";

    const loadOptions = async () => {
        // const response = await axios.get("http://localhost:3001/cities")
        // response.json()
        // const response = await axios.get("http://customer-server:3001/cities");
        const response = await axios.get("http://localhost:3001/cities/");
        // const response = await axios.get("https://customer-server:3001/cities");

        // console.log(response.json());

        return response.data;
    };

    const options = loadOptions();
    // $: console.log(options)

    // const options = [
    //     { id: "mil01", name: "Milano" },
    //     { id: "rom01", name: "Roma" },
    // ];

    export let city;

    // console.log(options)
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
