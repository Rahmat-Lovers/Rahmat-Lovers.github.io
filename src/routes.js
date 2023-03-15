import Login from './routes/Login.svelte'
import Home from './routes/Home.svelte'
import NotFound from './routes/NotFound.svelte'

export default {
    '/': Login,
    '/home': Home,
    '*': NotFound
};
