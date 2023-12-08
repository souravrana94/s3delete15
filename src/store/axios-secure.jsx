import axios from 'axios'
import authHeader from './service/auth-header'
import BASE_URL from './baseUrl'
import auth from '../firebase-config'

const defaultOptions = {
    baseURL: BASE_URL,
}

let instance = axios.create(defaultOptions)

instance.interceptors.request.use(async (config) => {
    config.headers = await authHeader()
    return config
})

instance.interceptors.response.use(
    (res) => {
        return res
    },
    (err) => {
        if (err?.response?.status === 401) {
            auth.signOut().then(() => console.log('User signed out!'))
        }
        throw err
    },
)

export default instance
