import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import axios from '../../../../store/axios-secure'
import Session from '../Session'
import './index.scss'

const Completed = ({
    clientId,
    client,
    showTitle = true,
    breakpoints,
    setLatestCompletedSession,
    cycle,
    setCycle,
}) => {
    const [sessions, setSessions] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)

    const fetchCompletedCardsData = async () => {
        setLoading(true)
        try {
            const response = await axios.get(
                `trainers/sessions/completed?userRef=${clientId}`,
            )
            setLatestCompletedSession(response?.data ? response.data[0] : null)
            setSessions(response?.data)
            setError(false)
            setLoading(false)
        } catch (error) {
            setError('Unable to fetch client details, please try again later')
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCompletedCardsData()
    }, [])

    return (
        <>
            {showTitle && (
                <div className="workout-completed-title">Completed</div>
            )}
            <Session
                loading={loading}
                error={error}
                sessions={sessions}
                completed={true}
                clientId={clientId}
                client={client}
                breakpoints={breakpoints}
                cycle={cycle}
                setCycle={(cycle) => setCycle(cycle)}
            />
        </>
    )
}

Completed.propTypes = {
    clientId: PropTypes.string,
    showTitle: PropTypes.bool,
}

export default Completed
