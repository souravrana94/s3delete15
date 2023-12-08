import React from 'react'
import Onboarding from './TrainerOnboardingForm'
import AccountHeader from '../../Profile/Components/AccountHeader'
import './index.scss'

const TrainerOnboarding = () => {
    return (
        <div className="trainer-onboarding-container container">
            <AccountHeader />
            <Onboarding />
        </div>
    )
}

export default TrainerOnboarding
