import Login from './routes/Login.svelte'
import User from './routes/User.svelte'
import UserSettings from './routes/UserSettings.svelte'
import Acceptor from './routes/Acceptor.svelte'
import NotFound from './routes/NotFound.svelte'

export default {
    '/': Login,
    '/home/user': User,
    '/home/user/settings': UserSettings,
    '/home/acceptor': Acceptor,
    '*': NotFound
};
