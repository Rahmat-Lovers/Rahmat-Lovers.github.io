<script>
    import provider from "../data/provider";
    import getContract from "../data/getContract";

    let name;
    let address;
    let loading = true;

    let targetAddress;

    (async () => {
        const signer = await provider.getSigner();
        const contract = await getContract(signer);

        address = await signer.getAddress();
        name = await contract.getName(address);

        loading = false;
    })();
</script>

<div>
    {#if !loading}
        <p>Halo {name}</p>
        <p>Address : {address}</p>

        <input type="text" bind:value={targetAddress} placeholder="Alamat wallet">
        <button>Setujui</button>
    {:else}
        <p>loading</p>
    {/if}
</div>
