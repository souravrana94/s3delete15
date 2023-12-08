import React, { useContext, useEffect, useState } from 'react'
import Loader from '../../../Common/Loader'
import InternalServerError from '../../../Common/ErrorPage/InternalServerErrorPage'
import axios from '../../../../store/axios-secure'
import ClientContainer from './ClientContainer'
import './index.scss'
import AppContext from '../../../../store/context'

const ClientView = () => {
    const [finalClientList, setFinalClientList] = useState([])
    const [loading, setLoading] = useState()
    const { clientList, setClientList } = useContext(AppContext)
    // const fetchClientList = async () => {
    //     try {
    //         const response = await axios.get('/trainers/users')
    //         setClientList([[clientList[0][0], response?.data]])
    //     } catch (error) {
    //         setError('unable fetch client list, please try again later')
    //     }
    // }
    // useEffect(() => {
    //     fetchClientList()
    // }, [])
    // useEffect(() => {
    //     let newClientList = JSON.parse(JSON.stringify(clientList))
    //     let finalList = {
    //         NoProgram: [],
    //     }
    //     newClientList.forEach((client) => {
    //         if (client?.currentProgramName) {
    //             let newGroup = finalList[client.currentProgramName] || []
    //             newGroup.push(client)
    //             finalList[client.currentProgramName] = newGroup
    //         } else {
    //             let newGroup = finalList['NoProgram'] || []
    //             newGroup.push(client)
    //             finalList['NoProgram'] = newGroup
    //         }
    //     })
    //     setFinalClientList(finalList)
    // }, [clientList])
    const displayData = (
        <div className="main-dashboard-container padding-top">
            <ClientContainer
                showAccordian={true}
                showBackButton={false}
                clientList={clientList}
                showContainer={true}
                showWorkoutButton={true}
                showStepsCount={true}
                showLastWorkout={true}
            />
        </div>
    )

    return loading ? <Loader /> : displayData
}

export default ClientView
