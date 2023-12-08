import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Card, Accordion, Image } from 'react-bootstrap'
import EvolvButton from '../../../../Common/Button'
import { Link, useHistory } from 'react-router-dom'
import Completed from '../../../Workout/Completed'
import './index.scss'
import axios from '../../../../../store/axios-secure'
import { Icon } from '@iconify/react'
import AccordionComponent from '../../../../Common/AccordionComponent'
import StepsTracker from '../ClientContainer/StepsTracker'
import ProgramTracker from '../ClientContainer/programTracker'
import Button from '../../../../Common/Button'
import moment from 'moment/moment'
import CustomModal from '../../../../Common/Modal'
import { FaExclamation } from 'react-icons/fa' //?

const ClientRow = ({
    fullName,
    email,
    photoUrl,
    lastSession,
    nextSession,
    programId,
    clientId,
    lastDietPlanDate,
    completedSessionsLastSevenDays,
    showAccordian = true,
    showBackButton = true,
    showWorkoutButton = true,
    showStepsCount = false,
    showLastWorkout = true,
    lastUpdatedWorkoutDate,
    lastCompletedWorkoutDate,
    lastUpdatedFeedbackDate,
    lastNotUpdatedFeedbackDate,
    targetSteps,
    stepsWalked7Days,
    showArchiveList = false,
    removeUser = () => {},
    programStartDate,
    programEndDate,
    isPaused,
    durationSelected,
    daysPaused,
    refresh,
    setRefresh,
    setButtonClicked,
}) => {
    const history = useHistory()
    const [stepsData, setStepsData] = useState(targetSteps)
    const [editable, setEditable] = useState(false)
    const [openUserInactiveModal, setOpenUserInactiveModal] = useState(false)
    const [lastSevenDaysWorkoutCount, setLastSevenDaysWorkoutCount] = useState()
    const [error, setError] = useState(false)
    const [lastTwoDaysWorkout, setLastTwoDaysWorkout] = useState(true) //?

    // useEffect(() => {
    //     //?
    //     const popupNotes = async () => {
    //         try {
    //             const response = await axios.get(
    //                 `trainers/getNotes?clientId=${clientId}`,
    //             )
    //             const notesData = response.data
    //             if (notesData && notesData.length > 0) {
    //                 setHasNotes(true)
    //             }
    //         } catch (error) {
    //             console.error('Error fetching notes:', error)
    //         }
    //     }

    //     popupNotes()
    // }, [clientId])

    useEffect(() => {
        if (
            completedSessionsLastSevenDays &&
            completedSessionsLastSevenDays?.length &&
            completedSessionsLastSevenDays[0] == 0 &&
            completedSessionsLastSevenDays[1] == 0
        ) {
            setLastTwoDaysWorkout(false)
        }
    })

    let workoutNotScheduled = false
    if (
        !lastUpdatedWorkoutDate ||
        moment().isSameOrAfter(lastUpdatedWorkoutDate, 'day')
    ) {
        workoutNotScheduled = true
    }

    const fetchData = async () => {
        try {
            const response = await axios.post(`trainers/targetSteps`, {
                targetSteps: Number(stepsData),
                clientId: clientId,
            })
        } catch (error) {
            console.log(error)
        }
    }

    const toggleUserStatus = async () => {
        try {
            await axios.patch(
                `users/${showArchiveList ? 'setActive' : 'inactive'}`,
                {
                    userId: clientId,
                },
            )
            removeUser(programId, clientId)
            setOpenUserInactiveModal(false)
        } catch (err) {
            if (err?.response?.status == 405) {
                setError('Not able to set user inactive')
                return
            } else {
                setError(err.message)
            }
        }
    }

    useEffect(() => {
        if (error) {
            setTimeout(() => {
                setError(false)
            }, 15000)
        }
    }, [error])

    useEffect(() => {
        let count = 0
        if (
            completedSessionsLastSevenDays &&
            completedSessionsLastSevenDays?.length
        ) {
            for (
                let i = 0;
                i < completedSessionsLastSevenDays.length - 1;
                i++
            ) {
                if (completedSessionsLastSevenDays[i] > 0) {
                    count = count + 1
                }
            }
        }
        setLastSevenDaysWorkoutCount(count)
    })

    return (
        <div className="client-details-row">
            <div>
                <CustomModal
                    title={`Make User ${
                        !showArchiveList ? 'inactive?' : 'active'
                    }`}
                    show={openUserInactiveModal}
                    onHide={() => setOpenUserInactiveModal(false)}
                    width="medium"
                    dark={true}
                >
                    <div>
                        <p>
                            Are you sure you want to make the user{' '}
                            {!showArchiveList ? 'inactive?' : 'active'}{' '}
                        </p>
                        <div className="d-flex">
                            <Button
                                text={'Yes'}
                                color="green"
                                size="s"
                                onClick={toggleUserStatus}
                            />
                            <Button
                                text={'No'}
                                color="red"
                                size="s"
                                onClick={() => {
                                    setOpenUserInactiveModal(false)
                                }}
                            />
                        </div>
                        {error ? (
                            <small className="message error m-5">{error}</small>
                        ) : null}
                    </div>
                </CustomModal>
            </div>
            {/* <AccordionComponent
                disabled={!showAccordian}
                headClick={false}
                data={{
                    parent: ( */}
            <Card className="client-card">
                <Card.Header className="client-card-header">
                    <div className="client-heading">
                        {/* <div className="col-md-3 client-details"> */}
                        <div className="client-details">
                            {showBackButton && (
                                <div className={`col-md-1 back-container`}>
                                    <a
                                        onClick={() => {
                                            window.location.href = '/'
                                        }}
                                    >
                                        <Icon
                                            color="white"
                                            icon={'eva:arrow-ios-back-fill'}
                                            height={40}
                                            width={40}
                                        />
                                    </a>
                                    {/* {/* <Link to="/" onClick={this.forceUpdate}>} */}
                                </div>
                            )}
                            <div className="client-name-details">
                                <div className="col-md-2 image-container">
                                    <Image
                                        src={
                                            photoUrl ??
                                            'https://storage.googleapis.com/evolv-store/icons/auth/profile.jpg'
                                        }
                                        roundedCircle
                                        width="40px"
                                        height="40px"
                                    />
                                    <div className="close-button-container">
                                        <div className="close-button-icon-conainer">
                                            <Icon
                                                onClick={() => {
                                                    setOpenUserInactiveModal(
                                                        true,
                                                    )
                                                }}
                                                //className={`close-button-icon`}
                                                height={20}
                                                icon={'ep:close-bold'}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col client-details-text">
                                    <p
                                        className="client-name"
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            flexWrap: 'wrap',
                                        }}
                                    >
                                        {fullName}
                                        <div>
                                            {!lastTwoDaysWorkout && ( //?
                                                <FaExclamation
                                                    className="exclamation-icon"
                                                    style={{
                                                        color: '#ff2f2f',
                                                        padding: '3px',
                                                        marginTop: '3px',
                                                    }}
                                                />
                                            )}
                                        </div>
                                    </p>

                                    <p className="last-session">{email}</p>
                                    <p className="last-session">
                                        {lastSession &&
                                            `Last: ${lastSession?.name} on ${lastSession?.actualPerformDate}`}
                                    </p>
                                </div>
                            </div>
                            {/* session  scheduling */}
                        </div>

                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                flex: 1,
                            }}
                        >
                            {programStartDate ? (
                                <ProgramTracker
                                    startDate={programStartDate}
                                    endDate={programEndDate}
                                    clientId={clientId}
                                    isPaused={isPaused}
                                    pausedDays={daysPaused}
                                    refresh={refresh}
                                    setRefresh={(p) => {
                                        setRefresh(p)
                                    }}
                                    setButtonClicked={(p) => {
                                        setButtonClicked(p)
                                    }}
                                />
                            ) : (
                                <p style={{ width: '80px' }}></p>
                            )}
                            {/* to show last seven days stats */}
                            {showBackButton ? null : (
                                <div className="frequency">
                                    Workout:{' '}
                                    <span style={{ color: 'white' }}>
                                        {lastSevenDaysWorkoutCount}
                                    </span>
                                    /7
                                </div>
                            )}
                        </div>

                        {/* {showStepsCount && (
                            <StepsTracker
                                targetSteps={targetSteps}
                                stepsWalked7Days={stepsWalked7Days}
                                clientId={clientId}
                            />
                        )} */}

                        {showLastWorkout && (
                            // <div className="col-md-2 date-alerts-container">
                            <div className="date-alerts-container">
                                <div className="date-alerts-left">
                                    <div
                                        className={`date  ${
                                            // lastNotUpdatedFeedbackDate.length >
                                            lastUpdatedWorkoutDate.length > 0
                                                ? 'date-success'
                                                : 'date-alert'
                                        }`}
                                        onClick={() =>
                                            history.push({
                                                pathname: `workout/${clientId}`,
                                                state: {
                                                    name: fullName,
                                                    email: email,
                                                    photoUrl: photoUrl,
                                                    clientId: clientId,
                                                    targetSteps:
                                                        Number(stepsData),
                                                },
                                            })
                                        }
                                    >
                                        <div className="date-alert-icon">
                                            <Icon
                                                fontWeight={'bold'}
                                                // icon="bx:user-check"
                                                icon="mdi:dumbbell"
                                            />
                                        </div>
                                        <div className="date-text">
                                            {/* {!lastNotUpdatedFeedbackDate ? (
                                                lastUpdatedFeedbackDate ? (
                                                    <h5>
                                                        {moment(
                                                            lastUpdatedFeedbackDate,
                                                        ).format('D')}{' '}
                                                        {moment(
                                                            lastUpdatedFeedbackDate,
                                                        ).format('MMM')}
                                                    </h5>
                                                ) : (
                                                    <h5 className="no-date">
                                                        -
                                                    </h5>
                                                )
                                            ) : lastNotUpdatedFeedbackDate.length >
                                                0 ? (
                                                <h5>
                                                    {moment(
                                                        lastNotUpdatedFeedbackDate,
                                                    ).format('D')}{' '}
                                                    {moment(
                                                        lastNotUpdatedFeedbackDate,
                                                    ).format('MMM')}
                                                </h5>
                                            ) : (
                                                <h5 className="no-date">-</h5>
                                            )} */}
                                            {lastUpdatedWorkoutDate.length >
                                            0 ? (
                                                <h5>
                                                    {moment(
                                                        lastUpdatedWorkoutDate,
                                                    ).format('D')}{' '}
                                                    {moment(
                                                        lastUpdatedWorkoutDate,
                                                    ).format('MMM')}
                                                </h5>
                                            ) : (
                                                <h5 className="no-date">-</h5>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* <Button
                                    iconComponent={'ic:baseline-navigate-next'}
                                    classNames="next-button"
                                    onClick={() =>
                                        history.push({
                                            pathname: `workout/${clientId}`,
                                            state: {
                                                name: fullName,
                                                email: email,
                                                photoUrl: photoUrl,
                                                clientId: clientId,
                                                targetSteps: Number(stepsData),
                                            },
                                        })
                                    }
                                /> */}
                                <div className="date-alerts-left">
                                    <div
                                        className={`date  ${
                                            lastDietPlanDate
                                                ? 'date-success'
                                                : 'date-alert'
                                        }`}
                                        onClick={() =>
                                            history.push({
                                                pathname: `workout/${clientId}`,
                                                state: {
                                                    name: fullName,
                                                    email: email,
                                                    photoUrl: photoUrl,
                                                    clientId: clientId,
                                                    targetSteps:
                                                        Number(stepsData),
                                                    action: 'Nutrition',
                                                },
                                            })
                                        }
                                    >
                                        {/* changes to made here for nutrition */}{' '}
                                        <div className="date-alert-icon">
                                            <Icon
                                                fontWeight={'bold'}
                                                icon="mdi:nutrition"
                                            />
                                        </div>
                                        <div className="date-text">
                                            {lastDietPlanDate ? (
                                                <h5>
                                                    {moment(
                                                        lastDietPlanDate,
                                                    ).format('D')}{' '}
                                                    {moment(
                                                        lastDietPlanDate,
                                                    ).format('MMM')}
                                                </h5>
                                            ) : (
                                                <h5 className="no-date">-</h5>
                                            )}
                                        </div>
                                        {/* <div className="date-text">
                                            {lastUpdatedWorkoutDate.length >
                                                0 ? (
                                                <h5>
                                                    {moment(
                                                        lastUpdatedWorkoutDate,
                                                    ).format('D')}{' '}
                                                    {moment(
                                                        lastUpdatedWorkoutDate,
                                                    ).format('MMM')}
                                                </h5>
                                            ) : (
                                                <h5 className="no-date">-</h5>
                                            )}
                                        </div> */}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* <div className="col-md-2 button-container mr-auto"> */}
                        {/* <EvolvButton
                                    classNames="no-word-wrap"
                                    icon={NotificationIcon}
                                    text="Notify"
                                    color="green"
                                    size="s"
                                    removeIconOn={'md'}
                                ></EvolvButton> */}
                    </div>
                </Card.Header>
            </Card>
            {/* ),
                    child: (
                        <Completed
                            clientId={clientId}
                            showTitle={false}
                            client={{
                                name: fullName,
                                email: email,
                                photoUrl: photoUrl,
                            }}
                            breakpoints={[1407, 950]}
                        />
                    ),
                }}
            ></AccordionComponent> */}
        </div>
    )
}

ClientRow.propTypes = {
    fullName: PropTypes.string,
    inviteAccepted: PropTypes.bool,
    lastSession: PropTypes.object,
    nextSession: PropTypes.object,
    clientId: PropTypes.string,
    showAccordian: PropTypes.bool,
    showBackButton: PropTypes.bool,
    showWorkoutButton: PropTypes.bool,
    targetSteps: PropTypes.number,
}

export default ClientRow
