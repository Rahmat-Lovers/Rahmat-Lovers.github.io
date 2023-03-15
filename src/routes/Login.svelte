<script>
    import provider from "./../data/provider";
    import { replace } from "svelte-spa-router"

    const login = async () => {
        await provider.send("eth_requestAccounts", []);
        await replace('/home')
    };
</script>


<!-- <div class="conatiner mx-auto px-4 bg-blue-400 h-screen flex justify-center items-center flex-col"> -->
<div class="conatiner mx-auto px-4 bg-slate-200 h-screen flex justify-center items-center flex-col">

    <div class=" my-10 w-full h-auto">
        <p class=" text-sm text-center h-6  tracking-wide">Anda Masuk Sebagai :</p>
        <div class=" flex justify-center items-center mt-1 mb-2 p-2 w-full h-auto">
            <ul>
                <li class=" relative block list-none mb-2">
                    <span class="absolute top-1 left-1 w-8 h-8 rounded-full bg-gray-700"><i class="fa fa-user-circle-o text-sm" aria-hidden="true"></i></span> 
                    <input type="text" id="acceptor" class=" rounded-xl py-2 px-4 hover:bg-sky-500 checked:bg-blue-500">
                    <label for="acceptor" class=" absolute top-2 left-12">Acceptor</label>
                </li>
                <li class=" relative block list-none mt-5">
                    <span class="absolute top-1 left-1 w-8 h-8 rounded-full bg-gray-700"><i class="fa fa-user-circle-o text-sm" aria-hidden="true"></i></span> 
                    <input type="text" id="user"  class=" rounded-xl py-2 px-4 hover:bg-sky-500">
                    <label for="acceptor" class=" absolute top-2 left-12">User</label>
                </li>
            </ul>
        </div>
        <button on:click={login} class="flex justify-center  mx-auto items-center text-sm text-center px-4 py-1 my-2 rounded-lg tracking-wide bg-blue-500 hover:bg-white text-white hover:text-blue-700">Login</button>
    </div>

</div>

<style>
</style>
