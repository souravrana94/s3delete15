import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
    apiKey: 'AIzaSyCUKQQy08lHqjsMAUM_jcr4pTd-y9oAeRI',
    authDomain: 'evolv-auth.firebaseapp.com',
    projectId: 'evolv-auth',
    storageBucket: 'evolv-auth.appspot.com',
    messagingSenderId: '481132885562',
    appId: '1:481132885562:web:1a189aa9147db1f3bbe703',
    measurementId: 'G-H3NXNPYFWZ',
}

const app = initializeApp(firebaseConfig)

const auth = getAuth(app)
export default auth
