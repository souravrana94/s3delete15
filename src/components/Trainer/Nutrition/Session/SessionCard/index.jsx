import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import CompletedHeader from '../CompletedHeader'
import axios from '../../../../../store/axios-secure'
import SessionTable from '../SessionTable'
import RemainingHeader from '../RemainiHeader'
import EvolvButton from '../../../../Common/Button'
import './index.scss'
import CustomModal from '../../../../Common/Modal'
import NutritionFeedback from '../../Feedback'
import { estimatedWorkoutTime } from '../../../../../utilities/utilities'
import DatePickerComponent from '../../../../Common/Form/DatePicker'
import { startOfDay } from 'date-fns'
import { useContext } from 'react'
import AppContext from '../../../../../store/context'

const SessionCard = ({
    session,
    completed,
    clientId,
    removeSession,
    // graphData,
    // setGraphData,
    // sessionThemes,
    client,
    idx,
    editing,
    excludedDates,
    updateEditing,
    showAddButton,
    setAddErrorMessage,
    setSessions,
    minDate,
    timezone,
    cycle,
    setCycle,
}) => {
    const timezoneOffset = new Date().getTimezoneOffset()
    const [startDate, setStartDate] = useState(
        // new Date(
        //     new Date(session?.date).getTime() +
        //         (timezoneOffset - timezone) * 60 * 1000,
        // ),
        new Date(session?.date),
    )

    const [isEditing, setIsEditing] = useState(editing)
    const [updatedSession, setUpdatedSession] = useState(session)
    const [showFeedbackModal, setShowFeedbackModal] = useState(false)
    const [loading, setLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('Error saving card')
    const [tableExerciseErrorMessage, setTableExerciseErrorMessage] = useState({
        message: 'Error',
        index: 1,
    })
    const [tableExerciseError, setTableExerciseError] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [showFeedbackButton, setShowFeedbackButton] = useState(false)
    const [feedbackCompleted, setFeedbackCompleted] = useState(false)
    const [completedPercentage, setCompletedPercentage] = useState(0)
    const [graphData, setGraphData] = useState({
        fat: 0,
        protein: 0,
        carbs: 0,
        calories: 0,
    })
    const { clientList } = useContext(AppContext)
    useEffect(() => {
        updateEditing(idx, isEditing)
    }, [isEditing])
    useEffect(() => {
        setIsEditing(editing)
    }, [editing])
    useEffect(() => {
        if (isError) {
            setTimeout(() => {
                setIsError(false)
            }, 10000)
        }
        if (isSuccess) {
            setTimeout(() => {
                setIsSuccess(false)
            }, 10000)
        }
        if (tableExerciseError) {
            setTimeout(() => {
                setTableExerciseError(false)
            }, 10000)
        }
    }, [isError, isSuccess, tableExerciseError])
    const setSessionName = (name) => {
        setUpdatedSession({ ...updatedSession, name: name })
    }
    const updateStates = () => {
        let length = session?.foodItems?.length
        let completedLength = session?.foodItems?.filter(
            (item) => item.isCompleted === true,
        )?.length
        setCompletedPercentage(completedLength / length)
        // if (session?.pictrues?.length) {
        //     setShowFeedbackButton(true)
        // }
        setShowFeedbackButton(completed)
        // if (
        //     session.feedbackCompleted
        // ) {
        //     setFeedbackCompleted(true)
        // }
    }

    useEffect(() => {
        setUpdatedSession(session)
        updateStates()
        setStartDate(
            // new Date(
            //     new Date(session?.date).getTime() +
            //         (timezoneOffset - timezone) * 60 * 1000,
            // ),
            new Date(session?.date),
        )
    }, [session])
    const getSortedSession = (session) => {
        return {
            ...session,
            exercises: session?.exercises?.map((se) => {
                return {
                    ...se,
                    exerciseSets: se?.exerciseSets
                        ?.sort((s1, s2) => s1?.setNumber - s2?.setNumber)
                        .map((s, id) => {
                            return { ...s, setNumber: id + 1 }
                        }),
                }
            }),
        }
    }

    const validate = () => {
        let foundError = false
        if (updatedSession?.name == '') {
            setErrorMessage('Please enter session name')
            setIsError(true)
            foundError = true
            setLoading(false)
            return foundError
        }
        if (updatedSession?.exercises?.length == 0) {
            setErrorMessage('Please add atleast one exercise')
            setIsError(true)
            foundError = true
            setLoading(false)
            return foundError
        }
        updatedSession?.exercises?.forEach((exercise, idx) => {
            if (exercise?.exerciseInfoRef == '-') {
                setTableExerciseErrorMessage({
                    message: 'Please enter exercise name',
                    index: idx,
                })
                setTableExerciseError(true)
                setLoading(false)
                foundError = true
                return
            }
            //if second value is null then pop it

            // exercise?.exerciseSets?.forEach((set, setIdx) => {
            //     if (set?.suggestedRIRRange?.length > 1) {
            //         if (set?.suggestedRIRRange[1] == null) {
            //             set?.suggestedRIRRange.pop()
            //         }
            //     }
            //     if (set?.suggestedRepRange?.length > 1) {
            //         if (set?.suggestedRepRange[1] == null) {
            //             set?.suggestedRepRange.pop()
            //         }
            //     }
            //     if (set.suggestedWeightRange?.length > 1) {
            //         if (set?.suggestedWeightRange[1] == null) {
            //             set?.suggestedWeightRange.pop()
            //         }
            //     }
            // })
        })
        updatedSession?.exercises?.forEach((exercise, idx) => {
            if (exercise?.exerciseSets?.length == 0) {
                setTableExerciseErrorMessage({
                    message: 'Please add atleast one set',
                    index: idx,
                })
                setTableExerciseError(true)
                setLoading(false)
                foundError = true
                return
            }
            exercise?.exerciseSets?.map((e) => {
                if (
                    e.suggestedWeightRange.length > 1 &&
                    e.suggestedWeightRange[0] != null &&
                    e.suggestedWeightRange[1] != null &&
                    parseInt(e.suggestedWeightRange[0]) >
                        parseInt(e.suggestedWeightRange[1])
                ) {
                    foundError = true
                    setTableExerciseErrorMessage({
                        message:
                            'Second value of weight cannot be less than first one',
                        index: idx,
                    })
                    setTableExerciseError(true)
                    return
                }
                if (
                    e.suggestedRepRange.length > 1 &&
                    e.suggestedRepRange[0] != null &&
                    e.suggestedRepRange[1] != null &&
                    parseInt(e.suggestedRepRange[0]) >
                        parseInt(e.suggestedRepRange[1])
                ) {
                    foundError = true
                    setTableExerciseErrorMessage({
                        message:
                            'Second value of reps cannot be less than first one',
                        index: idx,
                    })
                    setTableExerciseError(true)
                    return
                }
                // if (
                //     e.suggestedRIRRange.length > 1 &&
                //     e.suggestedRIRRange[0] != null &&
                //     e.suggestedRIRRange[1] != null &&
                //     parseInt(e.suggestedRIRRange[0]) >
                //         parseInt(e.suggestedRIRRange[1])
                // ) {
                //     foundError = true
                //     setTableExerciseErrorMessage({
                //         message:
                //             'Second value of RIR cannot be less than first one',
                //         index: idx,
                //     })
                //     setTableExerciseError(true)
                //     return
                // }
            })
        })
        return foundError
    }

    const saveCard = async (date) => {
        const dateString = new Date(
            // startOfDay(date).getTime() -
            //     (new Date().getTimezoneOffset() - timezone) * 60 * 1000,
            date,
        )
        setLoading(true)
        if (validate()) {
            setLoading(false)
            return
        }
        let newSession = structuredClone({
            ...updatedSession,
        })
        newSession.date = dateString
        // newSession.sessionThemeRef = sessionThemeRef
        // newSession?.exercises?.map((exercise) => {
        //     if (typeof exercise._id == 'number') {
        //         delete exercise._id
        //     }
        // })
        try {
            const response = await axios.post('/dietPlan', newSession)
            setSessions({ ...updatedSession, _id: response.data?._id }, idx)
            // if (updatedSession?._id) {
            //     const response = await axios.put(
            //         '/workoutpnp/sessions/update',
            //         newSession,
            //     )

            // } else {
            //     const response = await axios.post(
            //         '/workoutpnp/sessions/add',
            //         newSession,
            //     )
            //     setSessions({ ...updatedSession, _id: response.data?._id }, idx)
            // }
            // clientList.forEach((program) =>
            //     program[1].forEach((client) => {
            //         if (
            //             client.clientId == updatedSession.userRef &&
            //             (!client.lastUpdatedWorkoutDate ||
            //                 client.lastUpdatedWorkoutDate <
            //                     dateString.toISOString())
            //         ) {
            //             client.lastUpdatedWorkoutDate = dateString.toISOString()
            //         }
            //     }),
            // )
            setIsEditing(false)
            setIsError(false)
            setTableExerciseError(false)
            setIsSuccess(true)
        } catch (error) {
            setErrorMessage('Error saving card')
            setIsError(true)
            setIsSuccess(false)
            setIsEditing(true)
        }
        setLoading(false)
    }
    return (
        <div className="session-container">
            <div className="content">
                {completed ? (
                    <CompletedHeader
                        completedPercentage={completedPercentage}
                        routineName={updatedSession?.name}
                        performDate={updatedSession?.date}
                        graphData={graphData}
                        images={updatedSession?.pictrues}
                        // userFeedback={updatedSession?.userFeedback}
                        // activeTime={
                        //     updatedSession?.activeTime == undefined
                        //         ? '-'
                        //         : Math.floor(updatedSession?.activeTime / 60)
                        // }
                        // totalTime={
                        //     updatedSession?.totalTime == undefined
                        //         ? '-'
                        //         : Math.floor(updatedSession?.totalTime / 60)
                        // }
                    />
                ) : (
                    <RemainingHeader
                        idx={idx}
                        graphData={graphData}
                        routineName={updatedSession?.name}
                        startDate={startDate}
                        setStartDate={(date) => {
                            setStartDate(date)
                            setUpdatedSession({
                                ...updatedSession,
                                date: date,
                            })
                        }}
                        isEditing={isEditing}
                        loading={loading}
                        setIsEditing={setIsEditing}
                        saveCard={saveCard}
                        setSessionName={setSessionName}
                        removeSession={() => {
                            setIsError(false)
                            setTableExerciseError(false)
                            setIsSuccess(false)
                            removeSession()
                        }}
                        // sessionThemes={sessionThemes}
                        isError={isError}
                        errorMessage={errorMessage}
                        isSuccess={isSuccess}
                        excludedDates={excludedDates}
                        setAddErrorMessage={setAddErrorMessage}
                        showAddButton={showAddButton}
                        // selectedSessionTheme={
                        //     session?.sessionThemeRef === undefined
                        //         ? sessionThemes[0]?._id
                        //         : session?.sessionThemeRef
                        // }
                        // workoutTime={estimatedWorkoutTime(
                        //     updatedSession?.exercises,
                        // )}
                        minDate={minDate}
                        timezone={timezone}
                    />
                )}

                <SessionTable
                    clientId={clientId}
                    foodItems={updatedSession?.foodItems}
                    setFoodItems={(foodItems) => {
                        setUpdatedSession({ ...updatedSession, foodItems })
                    }}
                    isEditing={isEditing}
                    graphData={graphData}
                    setGraphData={setGraphData}
                    setIsEditing={setIsEditing}
                    showAddButton={showAddButton}
                    completed={completed}
                    isError={tableExerciseError}
                    errorMessage={tableExerciseErrorMessage}
                    forCycle={false}
                />

                {showFeedbackButton ? (
                    <div className="feedback-button-container">
                        {feedbackCompleted ? (
                            <h5 className="completed-text">
                                Feedback Completed
                            </h5>
                        ) : null}
                        <EvolvButton
                            classNames="feedback-button"
                            iconComponent={'uil:feedback'}
                            iconSize={20}
                            text={feedbackCompleted ? 'Edit' : 'Feedback'}
                            color="green"
                            size="s"
                            removeIconOn={'xs'}
                            onClick={() => {
                                setShowFeedbackModal(true)
                            }}
                        ></EvolvButton>
                        <CustomModal
                            show={showFeedbackModal}
                            width="fullwidth"
                            title="Feedback"
                            onHide={() => {
                                setShowFeedbackModal(false)
                            }}
                            dark={true}
                        >
                            <NutritionFeedback
                                completedPercentage={completedPercentage}
                                session={updatedSession}
                                setFeedbackCompleted={setFeedbackCompleted}
                                client={client}
                                graphData={graphData}
                                foodItems={updatedSession?.foodItems}
                                // setExercises={(exercises) => {
                                //     setUpdatedSession({
                                //         ...updatedSession,
                                //         exercises,
                                //     })
                                // }}
                                setUpdatedSession={(foodItems) => {
                                    setUpdatedSession({
                                        ...updatedSession,
                                        foodItems,
                                    })
                                }}
                                cycle={cycle}
                                setCycle={(cycle) => setCycle(cycle)}
                            />
                        </CustomModal>
                    </div>
                ) : null}
            </div>
        </div>
    )
}

SessionCard.propTypes = {
    session: PropTypes.object,
    completed: PropTypes.bool,
    clientId: PropTypes.string,
    removeSession: PropTypes.func,
}

export default SessionCard
