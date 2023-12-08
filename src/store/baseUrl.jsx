/* eslint-disable no-unused-vars */
const MAIN_APPLICATION_CONTEXT_PATH = '/s2'

const BASE_URL = process.env.REACT_APP_BASE_URL + MAIN_APPLICATION_CONTEXT_PATH
const LOCALHOST_BASE_URL = 'http://localhost:5000'
const NGROK_URL =
    'https://19d9ec50a9a1.ngrok.io' + MAIN_APPLICATION_CONTEXT_PATH

export default BASE_URL
