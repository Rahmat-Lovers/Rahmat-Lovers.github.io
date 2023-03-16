<script>
	import provider from "../data/provider";
	import getContract from "../data/getContract";
	import getUsdContract from "../data/getUsdContract";
	import Swal from "sweetalert2";

	let loading = true;
	let address = "";
	let name;
	let balance = 0;
	let undepositBalance = 0;
	let avaxBalance = 0;

	let canDeposit = false;

	let new_name = "";
	let totalDeposit = 0;

	(async () => {
		const signer = await provider.getSigner();
		address = await signer.getAddress();

		const contract = await getContract(signer);
		const contractUsd = await getUsdContract(signer);

		canDeposit =
			parseFloat(await contractUsd.allowance(address, contract.address)) >
			0;

		name = await contract.getName(address);
		balance = parseFloat(await contract.getBalance()) / 1000000;
		undepositBalance =
			(await contractUsd.balanceOf(await signer.getAddress())) /
			1_000_000;
		avaxBalance =
			parseFloat(await signer.getBalance()) / 1_000_000_000_000_000_000;
		loading = false;
	})();

	const changeName = async () => {
		Swal.fire({
			title: "Kirimkan nama baru kamu",
			input: "text",
			inputAttributes: {
				autocapitalize: "off",
			},
			showCancelButton: true,
			confirmButtonText: "Ok",
		}).then(async (result) => {
			if (result.isConfirmed) {
				const new_name = result.value;

				const signer = await provider.getSigner();
				const contract = await getContract(signer);

				try {
					loading = true;
					await (await contract.setName(new_name)).wait();
					name = new_name
					loading = false;
				} catch (e) {
					loading = false;
					Swal.fire({
						icon: 'error',
						text: "Gagal",
					})
				}
			}
		});
	};

	const deposit = async () => {
		const total = totalDeposit * 1_000_000;

		const signer = await provider.getSigner();
		const contract = await getContract(signer);

		const trx = await contract.deposi(total, {
			gasLimit: 150_000,
		});
		loading = true;

		try {
			await trx.wait();
		} catch (err) {
			alert(
				"transaksi gagal! pastikan akses token usd sudah diberikan akses / pastikan saldo cukup"
			);
		}

		loading = false;
	};

	const canDepositRequest = async () => {
		const signer = await provider.getSigner();
		const contract = await getContract(signer);
		const contractUsd = await getUsdContract(signer);

		const trx = await contractUsd.approve(contract.address, 10_000_000_000);
		await trx.wait();
		canDeposit = true;
	};
</script>

{#if loading}
	<div class="h-screen w-full fixed z-50 flex items-center bg-gray-200">
		<div class="w-full text-center animate-bounce text-4xl">
			<p>Loading</p>
		</div>
	</div>
{/if}

<div class="w-full h-12 mb-5 flex items-center px-5">
	<div class="w-12 h-12 bg-gray-700 rounded-full" />
	<div class="ml-4">
		<div class="flex items-center">
			<p class="text-md md:text-lg lg:text-xl">{name}</p>
			<button class="ml-2" on:click={changeName}
				><i class="fa-regular fa-pen-to-square text-xs outline-none" /></button
			>
		</div>
		<p class="text-gray-400 text-xs md:text-base">
			{address}
			<button
				on:click={() => {
					navigator.clipboard.writeText(address);
				}}><i class="fa-regular fa-clipboard text-black" /></button
			>
		</p>
	</div>
</div>

<div class="mx-5">
	<div class="grid grid-cols-1 md:grid-cols-3 gap-2">
		<div class="bg-blue-500 text-white px-2 py-7 shadow rounded">
			<p>Saldo Tabungan</p>
			<p>{balance} USD</p>
		</div>
		<div class="bg-blue-400 text-white px-2 py-7 shadow rounded">
			<p>Saldo Wallet</p>
			<p>{undepositBalance} USD</p>
		</div>
		<div class="bg-red-500 text-white px-2 py-7 shadow rounded">
			<p>Saldo AVAX</p>
			<p>{avaxBalance} AVAX</p>
		</div>
	</div>
</div>
