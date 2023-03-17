<script>
    import provider from "./../data/provider";
    import { navigate } from "svelte-routing";
    import Swal from "sweetalert2";

    let loginAs;

    const login = async () => {
        
        if (!loginAs) {
            await Swal.fire("anda Belum memilih salah satu Opsi");
            return;
        }
        await provider.send("eth_requestAccounts", []);
        await navigate('/home/' + loginAs)
    };

</script>

<div class="conatiner mx-auto px-4 bg-slate-200 h-screen flex justify-center items-center flex-col">

    <div class=" my-10 w-full h-auto">
        <p class=" text-sm text-center h-6  tracking-wide">Anda Masuk Sebagai :</p>
        <div class=" flex justify-center items-center mt-1 mb-2 p-2 w-full h-auto">
            <ul>
                <li class=" relative block list-none mb-2">
                    <button class="w-full h-10 py-2 px-28 bg-white rounded-xl outline-none active:bg-blue-300 focus:ring-2 ring-blue-500" id="user" on:click={() => {
                        loginAs = 'acceptor';
                    }}>
                        <span class="absolute top-1 left-1 w-8 h-8 rounded-full bg-slate-100">
                            <svg aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" stroke-linecap="round" stroke-linejoin="round"></path>
                            </svg>
                        </span> 
                        <label for="acceptor" class=" absolute top-2 left-12">Acceptor</label>
                    </button>
                </li>
                <li class=" relative block list-none mt-5">
                    <button class="w-full h-10 bg-white rounded-xl outline-none active:bg-blue-300 focus:ring-2 ring-blue-500" on:click={() => {
                        loginAs = 'user';
                    }}>
                        <span class="absolute top-1 left-1 w-8 h-8 rounded-full bg-slate-100">
                            <svg aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" stroke-linecap="round" stroke-linejoin="round"></path>
                            </svg>
                        </span> 
                        <label for="acceptor" class=" absolute top-2 left-12">User</label>
                    </button>
                </li>
            </ul>
        </div>
        <button on:click={login} class="flex justify-center  mx-auto items-center text-sm text-center px-4 py-1 my-2 rounded-lg tracking-wide bg-blue-500 hover:bg-white text-white hover:text-blue-700">Login</button>
    </div>

    <div class="absolute top-3/4 bottom-0 translate-y-28 h-8 text-center items-center text-sm tracking-wide select-none">
        <p class="italic">powered by <span class=" not-italic uppercase opacity-30">soihib</span></p>
    </div>

</div>


<style>
</style>