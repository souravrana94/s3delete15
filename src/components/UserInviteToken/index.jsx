import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import axios from '../../store/axios-secure'
import Loader from '../Common/Loader'
import ErrorPage from '../Common/ErrorPage'
import './index.scss'

const InviteUserToken = () => {
    const location = useLocation()
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(true)

    const acceptInvite = async (token) => {
        try {
            await axios.post('workout/client/request/accept', {
                token,
            })
        } catch (error) {
            setError(true)
        }
        setLoading(false)
    }

    useEffect(() => {
        const parts = location?.search?.split('=')
        if (parts.length < 2) {
            setError(false)
        }
        const token = parts[1]
        acceptInvite(token)
    }, [])

    return loading ? (
        <Loader />
    ) : error ? (
        <ErrorPage
            customType="The invite has expired"
            customMessage="Please ask your trainer to resend the invite or contact us at contact@evolvfit.in to get it resolved"
        />
    ) : (
        <ErrorPage
            customType="Verification Completed"
            customMessage="Please continue to user onboarding page"
        />
    )
}

export default InviteUserToken
