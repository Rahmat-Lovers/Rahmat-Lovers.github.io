<script>
	import provider from "./../data/provider";
	import getContract from "./../data/getContract";
	import getUsdContract from "./../data/getUsdContract";

	let loading = true;
	let address;
	let name;
	let balance = 0
	let undepositBalance = 0;

	let canDeposit = false;

	let new_name = "";
	let totalDeposit = 0;

	(async () => {
		const signer = await provider.getSigner();
		address = await signer.getAddress();

		const contract = await getContract(signer);
		const contractUsd = await getUsdContract(signer);

		canDeposit = parseFloat(await contractUsd.allowance(address, contract.address)) > 0

		name = await contract.getName(address);
		balance = parseFloat(await contract.getBalance()) / 1000000;
		undepositBalance = await contractUsd.balanceOf(await signer.getAddress()) / 1_000_000
		loading = false;
	})();

	const changeName = async () => {
		const signer = await provider.getSigner();
		const contract = await getContract(signer);

		await contract.setName(new_name);
		name = new_name;
	};

	const deposit = async () => {
		const total = totalDeposit * 1_000_000

		const signer = await provider.getSigner();
		const contract = await getContract(signer);

		const trx = await contract.storeERC20(total, {
			gasLimit: 200_000
		})
		loading = true;

		try {
			await trx.wait()
		} catch(err) {
			alert('transaksi gagal! pastikan akses token usd sudah diberikan akses / pastikan saldo cukup')
		}

		loading = false;
	}

	const canDepositRequest = async () => {
		const signer = await provider.getSigner();
		const contract = await getContract(signer);
		const contractUsd = await getUsdContract(signer);

		const trx = await contractUsd.approve(contract.address, 10_000_000_000)
		await trx.wait()
		canDeposit = true;
	}
</script>

{#if !loading}
	<div>
		<p>Halo {name}!</p>
		<p>Saldo : {balance} USDT</p>
		<p>Saldo yang belum di deposit : {undepositBalance} USDT</p>

		<p>Address {address}</p>
		<input type="text" bind:value={new_name} placeholder="Nama Baru" />
		<button on:click={changeName}>Ganti Nama</button><br><br>
	
		{#if !canDeposit}
		<p>Belum bisa deposit</p>
		<button on:click={canDepositRequest}>Request</button> <br>
		{:else}
		<p>Sudah bisa deposit</p>
		{/if}

		<input type="number" bind:value={totalDeposit} placeholder="Total" />
		<button on:click={deposit}>Deposit</button>
	</div>
{:else}
<p>loading</p>
{/if}
