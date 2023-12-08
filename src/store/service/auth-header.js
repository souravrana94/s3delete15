import auth from '../../firebase-config'

export default async function authHeader() {
    let idToken = await auth.currentUser.getIdToken(true)
    if (idToken) {
        return {
            Authorization: 'Bearer ' + idToken,
        }
    } else {
        return {}
    }
}
