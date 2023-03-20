<script>
	import { Router, Route } from "svelte-routing";
	import Login from "./routes/Login.svelte";
	import Index from "./routes/Index.svelte";
	import User from "./routes/User.svelte";
	import Acceptor from "./routes/Acceptor.svelte";
	import UserSettings from "./routes/UserSettings.svelte";
	import NotFound from "./routes/NotFound.svelte"

	const canUsing = !!window.ethereum;

	export let url = "";
</script>

{#if canUsing}
	<Router url="{url}">
		<Route path="/home/user/settings" component={UserSettings} />
		<Route path="/home/user" component={User} />
		<Route path="/home/acceptor" component={Acceptor} />
		<Route path="/login" component={Login} />
		<Route path="/" component={Index} />
		<Route path="*" component={NotFound} />
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
