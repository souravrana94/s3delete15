import axios from '../axios-secure'

const getVerificationStatus = () => {
    return axios.get('workout/trainer/profile/profile-status')
}

export default {
    getVerificationStatus,
}
