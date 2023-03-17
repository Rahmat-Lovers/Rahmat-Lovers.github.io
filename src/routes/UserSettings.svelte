<script>
    import provider from "../data/provider";
    import getContract from "../data/getContract";
    import Swal from "sweetalert2";

    let loading = true;
    let canWdByAcceptor = true;
    let canWdByAtBalance = true;
    let canWdByAtTime = true;

    let targetSaldo ;

    (async () => {
        const signer = await provider.getSigner();
        const contract = await getContract(signer);
        canWdByAcceptor = !(await contract.isAcceptorDisabled());
        canWdByAtTime = !(await contract.isUnlockAtTimeDisabled());
        canWdByAtBalance = !(await contract.isUnlockAtBalanceDisabled());
        loading = false;
    })();

    const nonactiveWdByAcceptor = async () => {
        const swal = await Swal.fire({
            icon: "warning",
            text: "Jika anda melakukan ini. Anda tidak bisa mencairkan dana meskipun sudah disetujui acceptor",
            showConfirmButton: true,
            showCancelButton: true,
        });

        if (swal.isConfirmed) {
            const swal2 = await Swal.fire({
                icon: "warning",
                text: "Apakah anda yakin? ANDA TIDAK BISA MENCAIRKAN DANA MESKIPUN SUDAH DISETUJUI ACCEPTOR",
                showConfirmButton: true,
                showCancelButton: true,
            });

            if (swal2.isConfirmed) {
                const signer = await provider.getSigner();
                const contract = await getContract(signer);

                try {
                    loading = true;
                    await (await contract.disableAcceptor()).wait();
                    canWdByAcceptor = false;
                } catch (err) {
                    Swal.fire({
                        icon: "error",
                        text: "Transaksi gagal",
                    });
                } finally {
                    loading = false;
                }
            }
        }
    };

    const nonactiveWdAtTime = async () => {
        const swal = await Swal.fire({
            icon: "warning",
            text: "Jika anda melakukan ini. Anda tidak bisa mencairkan dana meskipun waktu sudah tercapai",
            showConfirmButton: true,
            showCancelButton: true,
        });

        if (swal.isConfirmed) {
            const swal2 = await Swal.fire({
                icon: "warning",
                text: "Apakah anda yakin? ANDA TIDAK BISA MENCAIRKAN DANA MESKIPUN SUDAH WAKTU SUDAH TERCAPAI",
                showConfirmButton: true,
                showCancelButton: true,
            });

            if (swal2.isConfirmed) {
                const signer = await provider.getSigner();
                const contract = await getContract(signer);

                try {
                    loading = true;
                    await (await contract.disableUnlockAtTIme()).wait();
                    canWdByAtTime = false;
                } catch (err) {
                    Swal.fire({
                        icon: "error",
                        text: "Transaksi gagal",
                    });
                } finally {
                    loading = false;
                }
            }
        }
    };

    const nonactiveWdAtBalance = async () => {
        const swal = await Swal.fire({
            icon: "warning",
            text: "Jika anda melakukan ini. Anda tidak bisa mencairkan dana meskipun target sudah tercapai",
            showConfirmButton: true,
            showCancelButton: true,
        });

        if (swal.isConfirmed) {
            const swal2 = await Swal.fire({
                icon: "warning",
                text: "Apakah anda yakin? ANDA TIDAK BISA MENCAIRKAN DANA MESKIPUN TARGET SUDAH TERCAPAI",
                showConfirmButton: true,
                showCancelButton: true,
            });

            if (swal2.isConfirmed) {
                const signer = await provider.getSigner();
                const contract = await getContract(signer);

                try {
                    loading = true;
                    await (await contract.disableUnlockAtBalance()).wait();
                    canWdByAtTime = false;
                } catch (err) {
                    Swal.fire({
                        icon: "error",
                        text: "Transaksi gagal",
                    });
                } finally {
                    loading = false;
                }
            }
        }
    };
</script>

{#if loading}
    <div class="h-screen w-full fixed z-40 flex items-center bg-gray-200">
        <div class="w-full text-center animate-bounce text-4xl">
            <p>Loading</p>
        </div>
    </div>
{/if}

<div class="mt-2 mx-5">
    <div class="flex border border-red-600 bg-red-100 p-3 rounded">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6 block text-red-600"
        >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
            />
        </svg>
        <p>
            BERHATI-HATILAH UNTUK MELAKUKAN SETTING! KARENA BERSIFAT
            IRREVERSIBLE
        </p>
    </div>

    <div class="border border-red-600 bg-red-100 p-3 rounded mt-2">
        {#if canWdByAcceptor}
            <button
                class="bg-red-500 hover:bg-red-400 rounded p-2 text-white w-full my-1"
                on:click={nonactiveWdByAcceptor}
                >Nonaktifkan Withdraw By Acceptor</button
            >
        {/if}

        {#if canWdByAtBalance}
            <button
                class="bg-red-500 hover:bg-red-400 rounded p-2 text-white w-full my-1"
                on:click={nonactiveWdAtBalance}
                >Nonaktifkan Withdraw At Balance</button
            >
        {/if}

        {#if canWdByAtTime}
            <button
                class="bg-red-500 hover:bg-red-400 rounded p-2 text-white w-full my-1"
                on:click={nonactiveWdAtTime}
                >Nonaktifkan Withdraw At Time</button
            >
        {/if}
    </div>
    {#if canWdByAtBalance}
        <div
            class="bg-blue-100 border border-blue-500 rounded p-2 text-white my-1"
        >
            <p class="text-black">
                Atur supaya saldo terkunci sampai target tercapai
            </p>
            <input
                type="number"
                placeholder="Jumlah target saldo"
                bind:value={targetSaldo}
                class="text-black outline-none border border-blue-500 rounded w-1/2 py-1 px-2"
            />
            <button
                class="rounded p-1 bg-blue-500"
                on:click={async () => {
                    const signer = await provider.getSigner();
                    const contract = await getContract(signer);

                    await contract.setTargetBalance(targetSaldo * 1_000_000)
                }}>Submit</button
            >
        </div>
    {/if}
</div>
