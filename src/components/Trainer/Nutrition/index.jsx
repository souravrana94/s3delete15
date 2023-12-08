import React, { useState } from 'react'
import Completed from './Completed'
import Remaining from './Remaining'

const NutritionScreenComp = ({ clientId, client }) => {
    const [latestCompletedSession, setLatestCompletedSession] = useState(null)
    const [graphData, setGraphData] = useState({
        fat: 0,
        carbs: 0,
        protein: 0,
        calories: 0,
        takenFat: 0,
        takenCarbs: 0,
        takenCalories: 0,
        takenProtein: 0,
    })
    const [cycle, setCycle] = useState(false)
    return (
        <>
            <Completed
                graphData={graphData}
                setGraphData={setGraphData}
                clientId={clientId}
                client={client}
                setLatestCompletedSession={setLatestCompletedSession}
                cycle={cycle}
                setCycle={(cycle) => setCycle(cycle)}
            />
            <Remaining
                graphData={graphData}
                setGraphData={setGraphData}
                clientId={clientId}
                latestCompletedSession={latestCompletedSession}
                cycle={cycle}
                setCycle={(cycle) => setCycle(cycle)}
            />
        </>
    )
}
export default NutritionScreenComp
