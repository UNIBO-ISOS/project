<script>
  import Button from "@smui/button/";
  import NewOrder from "./pages/NewOrder.svelte";

  let newOrder = false;
</script>

<main>
  <div class="container">
    <h1>Benvenuto su ACMEat</h1>
    {#if !newOrder}
      <h2>Vuoi effettuare un nuovo ordine?</h2>
      <div class="page-choice">
        <Button variant="raised" on:click={() => (newOrder = true)}
          >Nuovo ordine</Button
        >
      </div>
    {/if}

    {#if newOrder}
      <NewOrder />
    {/if}
  </div>
</main>

<style>
  .container {
    margin: auto;
    width: 65vw;
    background-color: white;
    padding: 2.5vh 2.5vw;
    min-height: 95vh;
  }
  .page-choice {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
  }
  h1 {
    text-align: center;
  }
</style>
