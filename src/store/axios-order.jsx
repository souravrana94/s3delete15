/** @format */

import axios from 'axios'

import BASE_URL from './baseUrl'

const instance = axios.create({
    baseURL: BASE_URL,
})

instance.interceptors.request.use((config) => {
    config.headers = {
        'Content-Type': 'application/json',
    }
    return config
})

export default instance
