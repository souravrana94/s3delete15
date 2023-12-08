import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
// import SessionTable from '../../../Workout/Session/SessionTable'
import SessionTable from '../../Session/SessionTable'
import './index.scss'
import { estimatedWorkoutTime } from '../../../../../utilities/utilities'
// import SessionThemePicker from '../../Workout/Session/SessionThemePicker'
// import SessionThemeCard from '../../Workout/Session/SessionThemePicker/SessionThemeCard'
import { Icon } from '@iconify/react'
import PieChart from '../../../../Common/NutritionPieChart'

const DayDetails = ({
    RowCycle,
    clientId,
    routine,
    setRoutine,
    graphData,
    setGraphData,
    exerciseError,
    exerciseErrorMessage,
    // sessionThemes,
    global,
    isThisClient,
}) => {
    const [workoutTime, setWorkoutTime] = useState(0)
    const [selectedSessionTheme, setSelectedSessionTheme] = useState(
        routine?.sessionThemeRef,
    )
    // useEffect(() => {
    //     setWorkoutTime(estimatedWorkoutTime(routine?.exercises))
    //     setSelectedSessionTheme(routine?.sessionThemeRef)
    // }, [routine])
    // useEffect(() => {
    //     const updatedRoutine = { ...routine }
    //     updatedRoutine['sessionThemeRef'] = selectedSessionTheme
    //     setRoutine(updatedRoutine)
    // }, [selectedSessionTheme])
    const changeRoutineName = (value) => {
        const updatedRoutine = { ...routine }
        updatedRoutine.name = value
        setRoutine(updatedRoutine)
    }

    // const setExercises = (exercises) => {
    //     const updatedRoutine = { ...routine }
    //     updatedRoutine.exercises = exercises
    //     setRoutine(updatedRoutine)
    // }
    return routine?.restDay ? (
        <div className="cycle-routine-container rest-day-nutrition">
            <span>Rest Day</span>
        </div>
    ) : (
        <>
            <div className="cycle-routine-container">
                <div className="routine-summary">
                    {global ? (
                        <div className="routine-name-nutrition">
                            {routine?.name}
                        </div>
                    ) : (
                        <input
                            className="routine-name-nutrition"
                            type="text"
                            value={routine?.name}
                            onChange={(evt) =>
                                changeRoutineName(evt?.target?.value)
                            }
                        />
                    )}
                    <div className="footer-container marginLeft">
                        {/* <PieChart renderScreen='cycle' protein={40} fat={20} carbs={500}/> */}
                        <PieChart
                            renderScreen="cycle"
                            protein={graphData?.protein}
                            fat={graphData?.fat}
                            carbs={graphData?.carbs}
                            calories={graphData?.calories}
                        />
                        {/* <div className="summary-row">
                            <Icon icon={'mdi:weight-lifter'} height={18} />
                            <span>
                                {routine?.exercises?.length} exercise(s)
                            </span>
                        </div>
                        <div className="summary-row">
                            <Icon icon={'mdi:arm-flex-outline'} height={18} />
                            <span>
                                {routine?.exercises?.reduce(
                                    (sum, curr) =>
                                        sum + curr?.exerciseSets?.length,
                                    0,
                                )}
                                {' set(s)'}
                            </span>
                        </div>
                        <div className="summary-row">
                            <Icon icon={'fa6-solid:clock'} height={18} />
                            <span>{workoutTime} min</span>
                        </div> */}
                    </div>
                </div>
                <SessionTable
                    graphData={graphData}
                    setGraphData={setGraphData}
                    RowCycle={RowCycle}
                    clientId={clientId}
                    key={routine?._id}
                    // exercises={routine?.exercises}
                    // setExercises={setExercises}
                    foodItems={routine?.foodItems}
                    setFoodItems={(foodItems) => {
                        setRoutine({ ...routine, foodItems })
                    }}
                    isEditing={!global}
                    completed={false}
                    isError={exerciseError}
                    errorMessage={exerciseErrorMessage}
                    modal={true}
                    autoPrefill={isThisClient}
                    showFeedback={false}
                    forCycle={true}
                />
            </div>
        </>
    )
}

DayDetails.propTypes = {
    routine: PropTypes.object,
    setRoutine: PropTypes.func,
}

export default DayDetails
