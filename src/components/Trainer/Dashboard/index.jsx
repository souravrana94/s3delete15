import React, { useContext, useEffect, useState } from 'react'
import InComponentNavBar from '../../Common/InComponentNavBar'
import ClientView from './ClientView'
import FeedbackView from './FeedbackView'
import AppContext from '../../../store/context'
import { useHistory } from 'react-router-dom'

const waitingImage =
    'https://storage.googleapis.com/evolv-assets/MVP/waiting.png'
const TrainerDashboard = () => {
    const userContext = useContext(AppContext)
    const history = useHistory()

    useEffect(() => {
        if (!userContext.profileRef) {
            history.push('/trainer-onboarding')
        }
    }, [userContext.profileRef])
    return (
        // <InComponentNavBar
        //     navitems={[
        //         {
        //             title: 'Clients',
        //             component: <ClientView />,
        //         },
        //         {
        //             title: 'Feedback',
        //             component: <FeedbackView />,
        //         },
        //     ]}
        // />
        <>
            {userContext.verified ? (
                <ClientView />
            ) : (
                <div>
                    <div className="d-flex justify-content-center">
                        <img src={waitingImage} height="200px" width="200px" />
                    </div>
                    <h1 className="d-flex justify-content-center pt-5 pb-3">
                        Verification Pending{' '}
                    </h1>
                    {/* <h5 className="d-flex justify-content-center p-5">
                        Meanwhile, complete your profile by clicking on your
                        profile picture at the top right corner
                    </h5> */}
                </div>
            )}
        </>
    )
}

export default TrainerDashboard
