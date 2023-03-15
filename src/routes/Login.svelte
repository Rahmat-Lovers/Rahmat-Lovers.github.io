<script>
    import provider from "./../data/provider";
    import { replace } from "svelte-spa-router"

    const login = async () => {
        await provider.send("eth_requestAccounts", []);
        await replace('/home')
    };
</script>

<div>
    <button on:click={login}>Login</button>
</div>

<style>
</style>
