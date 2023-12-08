import React, { useState, useEffect, useContext } from 'react'
import PropTypes from 'prop-types'
import ClientRow from '../ClientRow'
import { Icon } from '@iconify/react'
import Button from '../../../../Common/Button'
import axios from '../../../../../store/axios-secure'
import Loader from '../../../../../components/Common/Loader'
import AppContext from '../../../../../store/context'
import debounce from 'lodash/debounce'
import './index.scss'
const ClientContainer = ({
    clientList,
    showBackButton,
    showAccordian,
    showContainer,
    showStepsCount,
    showLastWorkout,
    showWorkoutButton,
}) => {
    const [archive, setArchive] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const [userList, setUserList] = useState(clientList)
    const [isLoading, setIsLoading] = useState(false)
    const [buttonClicked, setButtonClicked] = useState(false)
    const [sortKey, setSortKey] = useState('Workout')
    const [message, setMessage] = useState(null)
    const [mounted, setMounted] = useState(false)
    const userContext = useContext(AppContext)
    // console.log('client', refresh)
    const debouncedSetUserList = debounce(setUserList, 0)
    useEffect(() => {
        console.log(buttonClicked, mounted)
        if (buttonClicked && mounted) {
            setIsLoading(true)
            let isMounted = true
            let URL = `/trainers/users?active=${!archive}&sortBy=${sortKey}`
            ;(async () => {
                try {
                    const clientDataResponse = await axios.get(URL)
                    let newClientList = clientDataResponse?.data
                    let finalList = {
                        NoProgram: [],
                        Paused: [],
                    }
                    newClientList.forEach((client) => {
                        if (client?.currentProgramName && !client.isPaused) {
                            let newGroup =
                                finalList[client.currentProgramName] || []
                            newGroup.push(client)
                            finalList[client.currentProgramName] = newGroup
                        } else if (client.isPaused) {
                            let newGroup = finalList['Paused'] || []
                            newGroup.push(client)
                            finalList['Paused'] = newGroup
                        } else {
                            let newGroup = finalList['NoProgram'] || []
                            newGroup.push(client)
                            finalList['NoProgram'] = newGroup
                        }
                    })
                    let pausedProgram = finalList['Paused']
                    delete finalList.Paused
                    finalList['Paused'] = pausedProgram
                    let noProgram = finalList['NoProgram']
                    delete finalList.NoProgram
                    finalList['NoProgram'] = noProgram
                    console.log(finalList)
                    userContext.setClientList(Object.entries(finalList))
                    userContext.setInitialClientList(Object.entries(finalList))
                    setIsLoading(false)
                    if (isMounted) {
                        setUserList(Object.entries(finalList))
                    }
                } catch (error) {
                    console.error(error)
                }
            })()

            return () => {
                isMounted = false
            }
        } else {
            setMounted(true)
        }
    }, [archive, refresh, sortKey])
    useEffect(() => {
        setIsLoading(true)
        debouncedSetUserList(clientList)
        setIsLoading(false)
    }, [clientList])
    const removeUserById = (programId, id) => {
        const filteredValues = userList[programId][1].filter(
            (user) => user.clientId !== id,
        )
        userList[programId][1] = filteredValues
        setUserList([...userList])
    }
    const addSession = async (userList) => {
        try {
            setMessage({ message: 'Adding Sessions', code: 1 })
            setButtonClicked(false)
            // console.log(userList)
            let users = []
            userList.map((user) => {
                users.push(user.clientId)
            })
            // console.log(users)
            const res = await axios.post('trainers/sessions', { users: users })
            setMessage({ message: res.data.message, code: res.data.code })
            if (res.data.code == 1) {
                setButtonClicked(true)
                setRefresh(!refresh)
            }
        } catch (err) {
            console.log(err)
        }
    }
    const addCycle = async (userList) => {
        try {
            setMessage({ message: 'Adding Cycles', code: 1 })
            setButtonClicked(false)
            // console.log(userList)
            let users = []
            userList.map((user) => {
                users.push(user.clientId)
            })
            // console.log(users)
            const res = await axios.post('trainers/cycles', { users: users })
            setMessage({ message: res.data.message, code: res.data.code })
            setButtonClicked(true)
            setRefresh(!refresh)
        } catch (err) {
            console.log(err)
        }
    }
    useEffect(() => {
        if (message) {
            setTimeout(() => {
                setMessage(null)
            }, 5000)
        }
    }, [message])
    return isLoading ? (
        <Loader />
    ) : (
        <div
            className={`client-container ${!showContainer && 'display-hidden'}`}
        >
            {showAccordian && (
                <div className="headings">
                    <h3 className="empty marginL">
                        <Button
                            type="submit"
                            text={archive ? 'Archive' : 'Active'}
                            color="green"
                            style={{ width: 'fit-content' }}
                            classNames="m-0"
                            onClick={() => {
                                setArchive(!archive)
                                setButtonClicked(true)
                            }}
                        />
                        <h3 style={{ marginTop: '10px', marginLeft: '50px' }}>
                            <div
                                onClick={() => {
                                    setButtonClicked(true)
                                    setSortKey('droppedWorkout')
                                }}
                                style={{ cursor: 'pointer' }}
                            >
                                Activity
                            </div>
                        </h3>
                    </h3>

                    <h3 className="program hide displayFlex">
                        <div
                            onClick={() => {
                                setButtonClicked(true)
                                setSortKey('Program')
                            }}
                            style={{ cursor: 'pointer' }}
                        >
                            Program
                        </div>
                    </h3>

                    {/* <h3 className="steps hide">
                        <Icon fontSize={25} icon="bx:walk" /> Steps
                    </h3> */}
                    <h3
                        className="workout hide displayFlex"
                        style={{ justifyContent: 'flex-end' }}
                    >
                        <div
                            onClick={() => {
                                setButtonClicked(true)
                                setSortKey('Workout')
                            }}
                            style={{ marginRight: '40px', cursor: 'pointer' }}
                        >
                            {/* <Icon fontSize={25} icon="uil:dumbbell" /> */}
                            Workout{' '}
                            {/* <Icon
                                fontSize={20}
                                icon="icon-park-outline:sort-four"
                            /> */}
                        </div>
                        <div
                            onClick={() => {
                                setButtonClicked(true)
                                setSortKey('Diet')
                            }}
                            style={{ cursor: 'pointer', marginRight: '10px' }}
                        >
                            {/* <Icon fontSize={25} icon="mdi:nutrition" /> */}
                            Nutrition{' '}
                            {/* <Icon
                                fontSize={25}
                                icon="fluent-mdl2:sort-down"
                                style={{ marginLeft: '-10px' }}
                            /> */}
                        </div>
                    </h3>
                    {/* <h3 className="nutrition">
                        <Icon fontSize={30} icon="fluent:food-16-filled" />{' '}
                        Nutrition
                    </h3> */}
                </div>
            )}
            {message && (
                <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
                    <small
                        style={{
                            color: message.code == 1 ? '#04db90' : 'red',
                            marginRight: 20,
                        }}
                    >
                        {message.message}
                    </small>
                </div>
            )}
            {userList?.map((item, id) => {
                return (
                    <div key={id} style={{ marginBottom: '5px' }}>
                        {showAccordian ? (
                            <div className="program-header">
                                <div className="name-header">
                                    <div className="program-name">
                                        {item[0] == 'NoProgram'
                                            ? 'No Program'
                                            : item[1]?.length
                                            ? `${item[0]}`
                                            : ''}
                                    </div>
                                    {item[1]?.length ? (
                                        <div>{`( ${item[1]?.length} )`}</div>
                                    ) : null}
                                </div>
                                {item[1]?.length ? (
                                    <div className="addButtons">
                                        <div className="addButton">
                                            <Button
                                                type="button"
                                                text={'+ Session'}
                                                classNames="add-session-btn"
                                                onClick={() => {
                                                    addSession(item[1])
                                                }}
                                            />
                                        </div>
                                        <div className="addButton">
                                            <Button
                                                type="button"
                                                text={'+ Cycle'}
                                                classNames="add-session-btn"
                                                onClick={() => {
                                                    addCycle(item[1])
                                                }}
                                            />
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        ) : null}
                        {item[1]?.map((cl, idx) => (
                            <ClientRow
                                key={cl?.clientId ? cl?.clientId : cl?._id}
                                fullName={cl?.name}
                                email={cl?.email}
                                photoUrl={cl?.photoUrl}
                                //inviteAccepted={cl?.hasAccepedTrainer}
                                //lastSession={cl?.lastSession}
                                //nextSession={cl?.nextSession}
                                programId={id}
                                clientId={cl?.clientId ? cl?.clientId : cl?._id}
                                targetSteps={cl?.targetSteps ?? 0}
                                stepsWalked7Days={cl?.stepsWalked7Days}
                                lastUpdatedWorkoutDate={
                                    cl?.lastUpdatedWorkoutDate
                                }
                                lastDietPlanDate={cl?.lastDietPlanDate}
                                lastUpdatedFeedbackDate={
                                    cl?.lastUpdatedFeedbackDate
                                }
                                lastCompletedWorkoutDate={
                                    cl?.lastCompletedWorkoutdate
                                }
                                lastNotUpdatedFeedbackDate={
                                    cl?.lastNotUpdatedFeedbackDate
                                }
                                completedSessionsLastSevenDays={
                                    cl?.completedSessionsLastSevenDays
                                }
                                showLastWorkout={showLastWorkout}
                                showBackButton={showBackButton}
                                showAccordian={showAccordian}
                                showWorkoutButton={showWorkoutButton}
                                showStepsCount={showStepsCount}
                                removeUser={removeUserById}
                                showArchiveList={archive}
                                programStartDate={cl?.programStartDate}
                                programEndDate={cl?.programEndDate}
                                isPaused={cl?.isPaused}
                                durationSelected={cl?.durationSelected}
                                daysPaused={cl?.daysPaused}
                                refresh={refresh}
                                setRefresh={(p) => {
                                    setRefresh(p)
                                }}
                                setButtonClicked={(p) => {
                                    setButtonClicked(p)
                                }}
                            />
                        ))}
                    </div>
                )
            })}
        </div>
    )
}

ClientContainer.propTypes = {
    clientList: PropTypes.array,
    showBackButton: PropTypes.bool,
    showAccordian: PropTypes.bool,
    showContainer: PropTypes.bool,
    showWorkoutButton: PropTypes.bool,
}

export default ClientContainer
