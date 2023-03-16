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
					name = new_name;
					loading = false;
				} catch (e) {
					loading = false;
					Swal.fire({
						icon: "error",
						text: "Gagal",
					});
				}
			}
		});
	};

	const deposit = async () => {
		Swal.fire({
			title: "Masukan jumlah deposit",
			input: "number",
			inputAttributes: {
				autocapitalize: "off",
			},
			showCancelButton: true,
			confirmButtonText: "Ok",
		}).then(async (result) => {
			if (result.isConfirmed) {
				const total = result.value * 1_000_000;

				const signer = await provider.getSigner();
				const contract = await getContract(signer);
				const contractUsd = await getUsdContract(signer);

				if (
					total >
					(await contractUsd.balanceOf(await signer.getAddress()))
				) {
					await Swal.fire({
						icon: "error",
						text: "Saldo wallet tidak mencukupi",
					});
					return;
				}

				loading = true;

				try {
					await (
						await contract.store(total, {
							gasLimit: 150_000,
						})
					).wait();

					balance += parseInt(result.value)
					undepositBalance -= parseInt(result.value)
				} catch (err) {
					await Swal.fire({
						icon: 'error',
						text: "Transaksi gagal"
					});
				}

				loading = false;
			}
		});
	};

	const withdraw = async () => {
		Swal.fire({
			title: "Masukan jumlah withdraw",
			input: "number",
			inputAttributes: {
				autocapitalize: "off",
			},
			showCancelButton: true,
			confirmButtonText: "Ok",
		}).then(async (result) => {
			if (result.isConfirmed) {
				const total = result.value * 1_000_000;

				const signer = await provider.getSigner();
				const contract = await getContract(signer);

				if (
					total >
					(await contract.getBalance())
				) {
					await Swal.fire({
						icon: "error",
						text: "Saldo deposit tidak mencukupi",
					});
					return;
				}

				loading = true;

				try {
					console.log(await contract.setTargetBalance(total))
					await (
						await contract.withdraw(total, {
							gasLimit: 150_000,
						})
					).wait();

					balance += result.value
					undepositBalance -= result.value
				} catch (err) {
					await Swal.fire({
						icon: 'error',
						text: "Transaksi gagal"
					});
				}

				loading = false;
			}
		});
	};

	const canDepositRequest = async () => {
		const signer = await provider.getSigner();
		const contract = await getContract(signer);
		const contractUsd = await getUsdContract(signer);

		loading = true;

		try {
			const trx = await contractUsd.approve(
				contract.address,
				10_000_000_000
			);
			await trx.wait();
			canDeposit = true;
		} finally {
			loading = false;
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

<div class="w-full h-12 mb-5 flex items-center px-5">
	<div class="w-12 h-12 bg-gray-700 rounded-full" />
	<div class="ml-4">
		<div class="flex items-center">
			<p class="text-md md:text-lg lg:text-xl">{name}</p>
			<button class="ml-2" on:click={changeName}
				><i
					class="fa-regular fa-pen-to-square text-xs outline-none"
				/></button
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
			<p>Saldo Deposit</p>
			<p>{balance} USD</p>
			<button
				on:click={deposit}
				class="bg-yellow-400 hover:bg-yellow-300 text-white p-1 mt-1 shadow-lg rounded"
				>Deposit</button
			>
			<button
			on:click={withdraw}
			class="bg-yellow-400 hover:bg-yellow-300 text-white p-1 mt-1 shadow-lg rounded"
			>Withdraw</button
		>
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

	{#if !canDeposit}
		<div class="bg-yellow-400 rounded text-white p-2 mt-2">
			<p>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="w-6 h-6 inline"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
					/>
				</svg>
				Smart Contract Belum Diberi Akses Ke USDC
				<button
					on:click={canDepositRequest}
					class="bg-blue-500 hover:bg-blue-400 p-1 rounded shadow-lg "
					>Beri Akses</button
				>
			</p>
		</div>
	{/if}
</div>
