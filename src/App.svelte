<script>
	import Router from 'svelte-spa-router';
	import routes from './routes';

	const canUsing = !!(window.ethereum)
</script>


{#if canUsing}
<Router {routes} />
{:else}
<div class="h-screen w-full fixed z-auto flex items-center bg-gray-200 px-5">
	<div class="w-full text-center text-4xl">
		<p>Tidak bisa menggunakan situs ini. Pastikan ektensi metamask sudah terinstall. Jika menggunakan mobile mohon gunakan browser brave</p>
	</div>
</div>
{/if}

<style>
</style>
