<script>
	import { Router, Link, Route } from "svelte-routing";
	import Login from "./routes/Login.svelte";
	import User from "./routes/User.svelte";
	import UserSettings from "./routes/UserSettings.svelte";

	const canUsing = !!window.ethereum;

	export let url = "";
</script>

{#if canUsing}
	<Router url="{url}">
		<Route path="/home/user/settings" component={UserSettings} />
		<Route path="/home/user" component={User} />
		<Route path="/" component={Login} />
	</Router>
{:else}
	<div
		class="h-screen w-full fixed z-auto flex items-center bg-gray-200 px-5"
	>
		<div class="w-full text-center text-4xl">
			<p>
				Tidak bisa menggunakan situs ini. Pastikan ektensi metamask
				sudah terinstall. Jika menggunakan mobile mohon gunakan browser
				brave
			</p>
		</div>
	</div>
{/if}

<style>
</style>
