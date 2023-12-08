import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import Loader from '../../../Common/Loader'
import InternalServerErrorPage from '../../../Common/ErrorPage/InternalServerErrorPage'
import Carousel from '../../../Common/Carousel'
import SessionCard from './SessionCard'
import './index.scss'
import axios from '../../../../store/axios-secure'
import { useState } from 'react'
import CustomModal from '../../../Common/Modal'
import Button from '../../../Common/Button'

const Session = ({
    loading,
    error,
    sessions,
    completed,
    clientId,
    graphData,
    setGraphData,
    deleteSession,
    fullName,
    client,
    // sessionThemes,
    showAddButton,
    setAddErrorMessage,
    breakpoints = [1407, 1000],
    setSessions = () => {},
    minDate,
    timezone,
    cycle,
    setCycle,
}) => {
    const [deleteError, setDeleteError] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [deleteIndex, setDeleteIndex] = useState()
    const [excludedDates, setExcludedDates] = useState([])
    const openModal = (idx) => {
        setShowDeleteModal(true)
        setDeleteIndex(idx)
    }
    useEffect(() => {
        let updatedExcludeDates = sessions?.map((session) => {
            if (!session?.isCompleted) {
                return new Date(session?.date)
            }
        })
        setExcludedDates(updatedExcludeDates)
    }, [sessions])
    const updateEditing = (idx, editing) => {
        let updatedSessions = [...sessions]
        if (updatedSessions[idx]) {
            updatedSessions[idx].editing = editing
            setSessions(updatedSessions)
        }
    }
    const removeSession = async () => {
        updateEditing(deleteIndex, false)
        if (sessions[deleteIndex]?._id) {
            try {
                // await axios.delete(
                //     `trainers/sessions/delete?userRef=${clientId}`,
                //     {
                //         data: {
                //             sessionRef: sessions[deleteIndex]._id,
                //         },
                //     },
                // )
                console.log('delete api', sessions[deleteIndex])
                const response = await axios.delete(
                    `/dietPlan?dietPlanId=${sessions[deleteIndex]?._id}`,
                )
                console.log('delete response ', response)
                setDeleteError(false)
                deleteSession(deleteIndex)
            } catch (error) {
                setDeleteError(true)
            }
        } else {
            deleteSession(deleteIndex)
        }
        setShowDeleteModal(false)
    }

    return (
        <div className="client-container-workout">
            <div className="container-xl">
                {loading ? (
                    <Loader />
                ) : deleteError || error ? (
                    <InternalServerErrorPage />
                ) : (
                    <>
                        <Carousel breakpoints={breakpoints}>
                            {sessions?.map((session, idx) => {
                                return (
                                    <SessionCard
                                        // graphData={graphData}
                                        // setGraphData={setGraphData}
                                        showAddButton={showAddButton}
                                        setAddErrorMessage={setAddErrorMessage}
                                        key={idx}
                                        idx={idx}
                                        editing={session?.editing}
                                        session={session}
                                        completed={completed}
                                        clientId={clientId}
                                        fullName={fullName}
                                        client={client}
                                        // sessionThemes={sessionThemes}
                                        removeSession={() => openModal(idx)}
                                        updateEditing={updateEditing}
                                        excludedDates={excludedDates}
                                        setSessions={(updatedSession, idx) => {
                                            let newSessions = sessions
                                            newSessions[idx] = updatedSession
                                            setSessions(newSessions)
                                        }}
                                        minDate={minDate}
                                        timezone={timezone}
                                        cycle={cycle}
                                        setCycle={(cycle) => setCycle(cycle)}
                                    />
                                )
                            })}
                        </Carousel>
                        <CustomModal
                            title={'Delete Session'}
                            show={showDeleteModal}
                            onHide={() => setShowDeleteModal(false)}
                            width="medium"
                            dark={true}
                        >
                            <div>
                                <p>
                                    Are you sure you want to delete the session?
                                </p>
                                <div className="d-flex">
                                    <Button
                                        text={'Yes'}
                                        color="green"
                                        size="s"
                                        onClick={removeSession}
                                    />
                                    <Button
                                        text={'No'}
                                        color="red"
                                        size="s"
                                        onClick={() => {
                                            setShowDeleteModal(false)
                                        }}
                                    />
                                </div>
                            </div>
                        </CustomModal>
                    </>
                )}
            </div>
        </div>
    )
}

Session.propTypes = {
    loading: PropTypes.any,
    error: PropTypes.any,
    sessions: PropTypes.array,
    completed: PropTypes.bool,
    clientId: PropTypes.string,
    deleteSession: PropTypes.func,
}

export default Session
