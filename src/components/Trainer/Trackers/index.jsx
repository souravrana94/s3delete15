import React from 'react'
import './index.scss'
import StepsTracker from './stepsTracker'
import WeightTracker from './weightTracker'
import WaterTracker from './WaterTracker'
import WeightTransformation from './WeightTransformation/indes'
import ProgramStatistics from './ProgramSatistics'

const Trackers = ({ clientId }) => {
    return (
        <>
            <div className="trackers">
                <StepsTracker clientId={clientId} />
                <WeightTracker clientId={clientId} />
            </div>
            <div className="trackers">
                <WaterTracker clientId={clientId} />
                <WeightTransformation clientId={clientId} />
            </div>
            <div className="trackers">
                <ProgramStatistics clientId={clientId} />
            </div>
        </>
    )
}

export default Trackers
