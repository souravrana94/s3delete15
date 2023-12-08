import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Tasks.scss'
import axios from '../../store/axios-order'
import Loader from '../Common/Loader'
import ClientContainer from '../Trainer/Dashboard/ClientView/ClientContainer'
import RemainingTodos from './remainingTodos'
import PastTodos from './pastTodos'

const Tasks = () => {
    const [clientId, setClientId] = useState(0)
    const [client, setClient] = useState({})
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const location = useLocation()
    const setClientDetails = () => {
        setClient(location.state)
    }

    useEffect(() => {
        const clientId = location.pathname.split('/')[2]
        setClientId(clientId)
        setClientDetails()
    }, [])
    return loading || clientId === 0 ? (
        <Loader />
    ) : (
        <div className="taskScreen container-xl pb-5">
            <div className="clientHeader">
                <div className="clienth">
                    <ClientContainer
                        showAccordian={false}
                        showBackButton={true}
                        showContainer={false}
                        clientList={[client]}
                        showWorkoutButton={false}
                        showLastWorkout={false}
                    />
                </div>
            </div>
            <PastTodos clientId={clientId} />
            <RemainingTodos clientId={clientId} />
        </div>
    )
}

export default Tasks
