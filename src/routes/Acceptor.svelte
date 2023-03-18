<script>
    import provider from "../data/provider";
    import getContract from "../data/getContract";
    import Swal from "sweetalert2";

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

        <input
            type="text"
            bind:value={targetAddress}
            placeholder="Alamat wallet"
        />
        
        <button
            on:click={async () => {
                const signer = await provider.getSigner();
                const contract = await getContract(signer);

                Swal.fire({
                    icon: 'info',
                    text: `Apakah anda ingin mensetujui ${await contract.getName(targetAddress)}?`,
                    showCancelButton: true,
                    showConfirmButton: true
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        loading = true
                        await (await contract.accept(targetAddress)).wait()
                        loading = false;
                    }
                })
            }}>Setujui</button
        >
    {:else}
        <p>loading</p>
    {/if}
</div>
