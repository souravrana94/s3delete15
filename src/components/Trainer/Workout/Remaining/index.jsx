import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Button from '../../../Common/Button'
import CustomModal from '../../../Common/Modal'
import Cycle from '../../WorkoutCycle'
import axios from '../../../../store/axios-secure'
import Session from '../Session'
import './index.scss'
import Loader from '../../../Common/Loader'
import { getNumDaysPerWeek } from '../../../../utilities/utilities'
import { Icon } from '@iconify/react'
import { startOfDay } from 'date-fns'

const Remaining = ({ clientId, latestCompletedSession, cycle, setCycle }) => {
    const timezoneOffset = new Date().getTimezoneOffset()
    const [sessions, setSessions] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [activeCycleLoading, setActiveCycleLoading] = useState(false)
    const [activeCycleError, setActiveCycleError] = useState(false)
    const [showAddButton, setShowAddButton] = useState(true)
    const [addErrorMessage, setAddErrorMessage] = useState(false)
    const [sessionThemes, setSessionThemes] = useState([])
    const [minDate, setMinDate] = useState()
    const [timezone, setTimezone] = useState(0)
    const deleteSession = (idx) => {
        const sessionUpdated = [...sessions]
        sessionUpdated.splice(idx, 1)
        setSessions(sessionUpdated)
    }
    // console.log(sessions)
    const fetchActiveCycle = async () => {
        setActiveCycleLoading(true)
        try {
            const response = await axios.get(
                `/workoutpnp/cycles/fetch?clientId=${clientId}`,
            )
            setCycle(response?.data)
            setActiveCycleLoading(false)
            setActiveCycleError(false)
        } catch (err) {
            if (err?.response?.status === 404) {
                setActiveCycleError('Please Select a Cycle')
            } else {
                setActiveCycleError(true)
            }
            setActiveCycleLoading(false)
        }
    }

    const fetchRemainingCardsData = async () => {
        setLoading(true)
        try {
            const response = await axios.get(
                `trainers/sessions/remaining?userRef=${clientId}`,
            )
            let updatedSessions = response?.data?.sessions?.sort(
                (w1, w2) => new Date(w1.date) - new Date(w2.date),
            )

            const tempTimezone = response?.data?.offset
            setTimezone(tempTimezone)

            updatedSessions?.forEach((session) => {
                session['editing'] = false
            })
            setSessions(updatedSessions)
            setSessionThemes(response?.data?.sessionThemes)
            setError(false)
            setLoading(false)
        } catch (error) {
            setError('Unable to fetch client details, please try again later')
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchRemainingCardsData()
        fetchActiveCycle()
    }, [])
    useEffect(() => {
        let found = false
        sessions?.forEach((session) => {
            if (session?.editing) {
                found = true
                setShowAddButton(false)
                return
            }
        })
        if (!found) {
            setShowAddButton(true)
        }
    }, [sessions])

    //Set min date with the help of user timezone and latest completed session
    const minDateFunction = async () => {
        let tempTimezone = timezone
        if (timezone === null) {
            setTimezone(0)
            tempTimezone = 0
        }
        const timezoneOffset = new Date().getTimezoneOffset()
        const tempMinDate = new Date(
            new Date().getTime() + (timezoneOffset - tempTimezone) * 60 * 1000,
        )
        const latestCompletedSessionDate = new Date(
            new Date(latestCompletedSession?.date).getTime() +
                timezoneOffset * 60 * 1000,
        )
        if (!latestCompletedSession) {
            setMinDate(tempMinDate)
        } else {
            if (
                startOfDay(tempMinDate).toISOString() ===
                startOfDay(latestCompletedSessionDate).toISOString()
            ) {
                latestCompletedSessionDate.setDate(
                    latestCompletedSessionDate.getDate() + 1,
                )
                setMinDate(latestCompletedSessionDate)
            } else {
                setMinDate(tempMinDate)
            }
        }
    }

    useEffect(() => {
        minDateFunction()
    }, [latestCompletedSession, timezone])

    // const getSortedData = (cycle) => {
    //     const sortedCycle = cycle.cycleRef;
    //     sortedCycle.routineRefs = sortedCycle?.routineRefs
    //         ?.sort((cr1, cr2) => cr1?.dayNumber - cr2?.dayNumber)
    //         .map((cr, dayNum) => {
    //             return {
    //                 ...cr,
    //                 exercises: cr?.exercises?.map((ce) => {
    //                     return {
    //                         ...ce,
    //                         exerciseSets: ce?.exerciseSets
    //                             ?.sort((s1, s2) => s1?.number - s2?.number)
    //                             .map((s, id) => {
    //                                 return { ...s, number: id + 1 }
    //                             }),
    //                     }
    //                 }),
    //             }
    //         })
    //     let newRoutineRefs = []
    //     for (let i = 0; i < sortedCycle?.routineRefs?.length; i++) {
    //         if (i == 0 && sortedCycle?.routineRefs[i].dayNumber != 1) {
    //             newRoutineRefs.push({
    //                 name: 'Rest Day',
    //                 restDay: true,
    //                 dayNumber: i + 1,
    //                 exercises: [],
    //             })
    //         } else if (
    //             i > 0 &&
    //             sortedCycle?.routineRefs[i].dayNumber -
    //                 sortedCycle?.routineRefs[i - 1].dayNumber !=
    //                 1
    //         ) {
    //             newRoutineRefs.push({
    //                 name: 'Rest Day',
    //                 restDay: true,
    //                 dayNumber: sortedCycle?.routineRefs[i].dayNumber - 1,
    //                 exercises: [],
    //             })
    //         }
    //         newRoutineRefs.push(sortedCycle?.routineRefs[i])
    //     }
    //     while (
    //         newRoutineRefs.length != sortedCycle?.totalRoutines &&
    //         newRoutineRefs.length < sortedCycle?.totalRoutines
    //     ) {
    //         newRoutineRefs.push({
    //             name: 'Rest Day',
    //             restDay: true,
    //             dayNumber: newRoutineRefs.length + 1,
    //             exercises: [],
    //         })
    //     }
    //     sortedCycle.routineRefs = [...newRoutineRefs]
    //     return sortedCycle
    // }

    const getNextSession = (cycle, dayNumber) => {
        // const toFindDay = (dayNumber % cycle?.routineRefs?.length) + 1
        // const nextSession = cycle?.routineRefs?.find(
        //     (c) => c?.dayNumber === toFindDay,
        // )
        // //TODO: Handle rest day here
        // if (nextSession?.restDay) {
        //     return getNextSession(cycle, toFindDay)
        // } else {
        //     return nextSession
        // }
    }
    const updateSessions = (data) => {
        const newSession = {
            routineRef: data?.routineRef?._id,
            name: data?.routineRef?.name ?? 'New Session',
            exercises: data?.routineRef?.exercises ?? [],
            date: data?.date,
            userRef: clientId,
            editing: true,
            sessionThemeRef: data?.routineRef?.sessionThemeRef,
            variantType: data?.routineRef?.variantType,
            variants: data?.routineRef?.variants,
        }
        setSessions([...sessions, newSession])
    }

    Date.prototype.addDays = function (days) {
        var date = new Date(this.valueOf())
        date.setDate(date.getDate() + days)
        return date
    }
    useEffect(() => {
        if (addErrorMessage) {
            setTimeout(() => {
                setAddErrorMessage(false)
            }, 5000)
        }
    }, [addErrorMessage])

    //Function to get data  for both add session and add all sessions
    const addSessionHelper = () => {
        // Get timezone offset of the trainer's computer
        const timezoneOffset = new Date().getTimezoneOffset()

        // Get the current time relative to user timezone
        const todayTimeWithOffset = new Date()
        // Variable definitions to be used
        let lastSessionDate = todayTimeWithOffset
        let lastSessionRoutineRef = null
        let daysToAdd = 0
        let currentRoutine = null
        let currentRoutineIndex = 0

        // Find the last session if it exists according to the max date
        if (sessions.length > 0) {
            let lastSessionIndex = 0
            sessions?.forEach((session, ind, array) => {
                if (
                    ind > 0 &&
                    new Date(session?.date) >
                        new Date(array[lastSessionIndex]?.date)
                ) {
                    lastSessionIndex = ind
                }
            })
            lastSessionDate = new Date(sessions[lastSessionIndex]?.date)
            lastSessionRoutineRef = sessions[lastSessionIndex]?.routineRef
        }

        // If last completed session exists assign it to the last session date
        else if (latestCompletedSession) {
            lastSessionDate = new Date(
                new Date(latestCompletedSession?.date).getTime() +
                    timezoneOffset * 60 * 1000,
            )
            lastSessionRoutineRef = latestCompletedSession?.routineRef
        }

        // Case where cycle doesn't exist
        if (!cycle) {
            // If a last session (completed/non-completed) exists add 1 day to it's date
            if (sessions.length > 0 || latestCompletedSession) daysToAdd = 1
        }

        // Case where cycle exists
        else {
            // Sort the cycle as per day number
            cycle.routineRefs?.sort((a, b) => {
                return a.dayNumber - b.dayNumber
            })

            // If a last session (completed/non-completed) exists find the last routine in the current cycle.
            // If not found, the cycle has been changed otherwise, get the routine after the last routine from the cycle
            let lastRoutineIndex = null
            if (lastSessionRoutineRef) {
                cycle?.routineRefs.forEach((routine, index) => {
                    // Session with last session id found
                    if (lastSessionRoutineRef === routine._id) {
                        // % used to handle case where last routine index is last index of cycle
                        lastRoutineIndex = index
                        currentRoutineIndex =
                            (index + 1) % cycle?.routineRefs.length
                    }
                })
            }

            // If the last routine index exists which implies the cycle hasn't been changed
            if (lastRoutineIndex != null) {
                // Days to add is equal to difference in day number of current routine and last routine
                // This takes into account the rest days as well
                daysToAdd =
                    Number(cycle?.routineRefs[currentRoutineIndex].dayNumber) -
                    Number(cycle?.routineRefs[lastRoutineIndex].dayNumber)

                // If current routine index < last routine index in the case where last routine has last index of cycle
                if (daysToAdd <= 0) {
                    daysToAdd += Number(cycle?.totalRoutines)
                }
            }

            // If the last routine index doesn't exist which means cycle has been changed
            // Add 1 day to the last session date
            else {
                daysToAdd = Number(
                    cycle?.routineRefs[currentRoutineIndex].dayNumber,
                )

                // If latest completed session doesn't exist reduce daysToAdd by 1
                if (!latestCompletedSession && sessions.length === 0)
                    daysToAdd -= 1
            }

            // Final date and routine according to days to add
            currentRoutine = cycle?.routineRefs[currentRoutineIndex]
        }
        let finalDate = new Date(lastSessionDate).addDays(daysToAdd)
        if (finalDate < todayTimeWithOffset) finalDate = todayTimeWithOffset
        const obj = {
            finalDate: finalDate,
            currentRoutine: currentRoutine,
            currentRoutineIndex: currentRoutineIndex,
        }
        return obj
    }

    // Function to add single new session
    const addSession = () => {
        if (!showAddButton) {
            setAddErrorMessage('Please save current session before adding')
            return
        }

        const sessionData = addSessionHelper()
        // console.log('sessiondata', sessionData)
        updateSessions({
            routineRef: sessionData?.currentRoutine,
            date: sessionData?.finalDate,
        })
    }

    // Function to add all sessions which are present in the cycle
    const addAllSessions = async () => {
        if (!showAddButton) {
            setAddErrorMessage('Please save current session before adding')
            return
        }

        setLoading(true)
        let flag = 1
        while (flag) {
            const sessionData = addSessionHelper()
            if (!cycle || !sessionData) {
                setAddErrorMessage('Failed to save the sessions. Please retry')
                flag = 0
            }
            await saveCard(sessionData?.finalDate, sessionData?.currentRoutine)
            if (
                sessionData?.currentRoutineIndex ===
                cycle?.routineRefs.length - 1
            )
                flag = 0
        }
        setLoading(false)
    }

    const saveCard = async (date, session) => {
        try {
            let newDate = new Date(
                new Date(date).getTime() +
                    (timezoneOffset - timezone) * 60 * 1000,
            )
            const dateString = new Date(
                startOfDay(newDate).getTime() -
                    (new Date().getTimezoneOffset() - timezone) * 60 * 1000,
            )
            let newSession = structuredClone({
                ...session,
            })
            newSession.date = dateString
            newSession.userRef = clientId
            newSession.routineRef = newSession._id
            delete newSession.dayNumber
            delete newSession._id
            const response = await axios.post(
                '/workoutpnp/sessions/add',
                newSession,
            )
            const updatedSession = response?.data
            const tempSessions = sessions
            tempSessions.push(updatedSession)
            // console.log('temp', tempSessions)
            setSessions(tempSessions)
        } catch (error) {
            setError('Not able to save session')
            setLoading(false)
        }
    }

    const [show, setShow] = useState(false)
    return (
        <>
            <CustomModal
                className="workout-cycle-modal"
                title={'Edit Cycle'}
                show={show}
                width="fullwidth"
                //dark={true}
                onHide={() => {
                    setShow(false)
                }}
            >
                <Cycle
                    clientId={clientId}
                    setCycle={(cycle) => {
                        setCycle(cycle)
                    }}
                />
            </CustomModal>
            <div className={`workout-remaining-container`}>
                <div className={`workout-remaining-title`}>Remaining</div>
                <div
                    className="open-cycle"
                    onClick={() => {
                        setShow(true)
                    }}
                >
                    {activeCycleLoading ? (
                        <Loader />
                    ) : activeCycleError || !cycle ? (
                        <div>{'Please Select a Cycle'}</div>
                    ) : (
                        <>
                            <Icon
                                icon={'fa6-solid:repeat'}
                                height={25}
                                width={25}
                            />
                            <div className={`cycle-breif`}>
                                {/* <div>
                                    {getNumDaysPerWeek(cycle?.cycleRoutines)}{' '}
                                    day per week
                                </div>{' '} */}
                                <div>Cycle : {cycle?.name}</div>
                            </div>
                        </>
                    )}
                    <Icon
                        icon={'clarity:note-edit-line'}
                        height={25}
                        width={25}
                        className="edit-icon"
                    />
                </div>
                <div className="d-flex flex-direction-row">
                    {cycle && (
                        <Button
                            disabled={activeCycleError}
                            type="button"
                            classNames="add-session-btn"
                            text={'+ Add'}
                            onClick={addSession}
                        />
                    )}
                    {cycle && (
                        <Button
                            disabled={activeCycleError}
                            type="button"
                            classNames="add-session-btn add-cycle-session-btn"
                            text={'+ Cycle'}
                            onClick={addAllSessions}
                        />
                    )}
                </div>
            </div>
            {addErrorMessage ? (
                <small className="message error">{addErrorMessage}</small>
            ) : (
                <></>
            )}
            {loading ? (
                <Loader />
            ) : sessions.length == 0 ? (
                <h5 className="d-flex justify-content-center p-4">
                    Add a session by clicking the add button above
                </h5>
            ) : (
                <Session
                    showAddButton={showAddButton}
                    setAddErrorMessage={setAddErrorMessage}
                    loading={loading}
                    error={error}
                    sessions={sessions}
                    completed={false}
                    clientId={clientId}
                    deleteSession={deleteSession}
                    sessionThemes={sessionThemes}
                    setSessions={setSessions}
                    minDate={minDate}
                    timezone={timezone}
                    fetchActiveCycle={fetchActiveCycle}
                    setCycle={setCycle}
                />
            )}
        </>
    )
}

Remaining.propTypes = { clientId: PropTypes.string }

export default Remaining
