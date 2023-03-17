<script>
	import provider from "../data/provider";
	import getContract from "../data/getContract";
	import getUsdContract from "../data/getUsdContract";
	import Swal from "sweetalert2";
	import { navigate } from "svelte-routing"
	import axios from "axios";

	let loading = true;
	let address = "";
	let name;
	let balance = 0;
	let undepositBalance = 0;
	let avaxBalance = 0;

	let targetBalance = 0;

	let canDeposit = false;
	let canWithdraw;

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

		targetBalance = await contract.getTargetBalance();
		canWithdraw = await contract.canWithdraw();
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

					balance += parseInt(result.value);
					undepositBalance -= parseInt(result.value);
				} catch (err) {
					await Swal.fire({
						icon: "error",
						text: "Transaksi gagal",
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

				if (total > (await contract.getBalance())) {
					await Swal.fire({
						icon: "error",
						text: "Saldo deposit tidak mencukupi",
					});
					return;
				}

				loading = true;

				try {
					await (
						await contract.withdraw(total, {
							gasLimit: 150_000,
						})
					).wait();

					balance -= parseInt(result.value);
					undepositBalance += parseInt(result.value);
				} catch (err) {
					await Swal.fire({
						icon: "error",
						text: "Transaksi gagal",
					});
				}

				loading = false;
			}
		});
	};

	const buyAvax = async () => {
		Swal.fire({
			title: "Masukan jumlah topup",
			input: "number",
			inputAttributes: {
				autocapitalize: "off",
			},
			showCancelButton: true,
			confirmButtonText: "Ok",
		}).then(async (result) => {
			if (result.isConfirmed) {
				const amount = parseInt(result.value);
				if (amount < 10000) {
					Swal.fire({
						icon: "error",
						text: "Minimal Rp. 10.000",
					});
				} else {
					loading = true;
					const response = await axios.post(
						"http://localhost:8000/buy/avax",
						{
							amount,
							address,
						}
					);
					window.open(response.data.data.checkout_url, "_blank");
					loading = false;
				}
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

<div class="w-full h-12 mb-5 flex items-center px-5 justify-between">
	<div class="flex">
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
	<div>
		<button
			on:click={async () => {
				await navigate("/home/user/settings");
			}}
			><svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="w-6 h-6"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
				/>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
				/>
			</svg>
		</button>
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
			{#if canWithdraw}
				<button
					on:click={withdraw}
					class="bg-yellow-400 hover:bg-yellow-300 text-white p-1 mt-1 shadow-lg rounded"
					>Withdraw</button
				>
			{:else}
				<button
					class="bg-stone-300 text-white p-1 mt-1 shadow-lg rounded"
					disabled>Withdraw</button
				>
			{/if}
		</div>
		<div class="bg-blue-400 text-white px-2 py-7 shadow rounded">
			<p>Saldo Wallet</p>
			<p>{undepositBalance} USD</p>
		</div>
		<div class="bg-red-500 text-white px-2 py-7 shadow rounded">
			<p>Saldo AVAX</p>
			<p>{avaxBalance} AVAX</p>
			<button
				on:click={buyAvax}
				class="bg-yellow-400 hover:bg-yellow-300 text-white p-1 mt-1 shadow-lg rounded"
				>Beli</button
			>
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

	<div class="mt-2">
		{#if targetBalance > 0}
			<div class="bg-blue-100 border border-blue-500 py-1 px-2 rounded">
				<p>Anda bisa mencairkan saldo deposit saat sudah mencapai {targetBalance / 1_000_000} USD</p>
			</div>
		{/if}
	</div>
</div>
