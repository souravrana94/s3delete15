import React, { useState, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import Completed from './Completed'
import Remaining from './Remaining'
import NotePopup from './NotePopup'
import axios from '../../../store/axios-secure'
import Loader from '../../Common/Loader'
import Buttons from './Buttons'
import Trackers from '../Trackers'
import UserProfileComponent from '../UserProfile'
import InternalServerErrorPage from '../../Common/ErrorPage/InternalServerErrorPage'
import './index.scss'
import ClientContainer from '../Dashboard/ClientView/ClientContainer'
import Tasks from '../../Tasks'
import NutritionScreenComp from '../Nutrition'
import { FiEdit3 } from 'react-icons/fi'
import CustomModal from '../../Common/Modal'

const Workout = () => {
    const location = useLocation()
    const history = useHistory()
    const [cycle, setCycle] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [clientId, setClientId] = useState(0)
    //const [clientId, setClientId] = useState(location.pathname.split('/')[2])
    const [client, setClient] = useState({})
    const [latestCompletedSession, setLatestCompletedSession] = useState(null)
    const [action, setAction] = useState(location?.state?.action ?? 'Workout')
    const [showNotePopup, setShowNotePopup] = useState(false)
    const [notes, setNotes] = useState([])
    const [hasNotes, setHasNotes] = useState(false) //indicator

    const handleAddNoteClick = async () => {
        // setLoading(true)
        // try {
        //     const response = await axios.get(`trainers/getNotes?clientId=${clientId}`);
        //     console.log("handlednote res: ", response);
        //     console.log("responseData ", response.data);
        //     setNotes(response.data);
        //     console.log("notes: ", { notes });
        // } catch (error) {
        //     console.error('Error fetching notes:', error);
        // }
        // setLoading(false)
        setShowNotePopup(true)
    }

    const handleAddNote = (updatedNotes) => {
        setNotes(updatedNotes)
    }
    const handleNotePopupClose = async (updatedNotes) => {
        setShowNotePopup(false)

        if (updatedNotes) {
            setNotes(updatedNotes)
        }
    }

    const handleAltAKeyPress = () => {
        setShowNotePopup(true)
    }

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.altKey && event.key === 'a') {
                handleAltAKeyPress()
            }
        }
        document.addEventListener('keydown', handleKeyDown)
        return () => {
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [])

    const setClientDetails = async () => {
        setClient(['No program', [location.state]])
        // setLoading(true)
        // try {
        //     const response = await axios.get(
        //         `workout/trainer/suggest/client-list/${clientId}`,
        //     )
        //     setClient(response?.data)
        //     setError(false)
        //     setLoading(false)
        // } catch (error) {
        //     if (error?.response?.status === 400) {
        //         history.push('/')
        //     }
        //     setError('Unable fetch client details, please try again later')
        //     setLoading(false)
        // }
        setLoading(true) //indicator
        const clientId = location.pathname.split('/')[2]
        setClientId(clientId)
        try {
            console.log('clientId........', clientId)
            const response = await axios.get(
                `trainers/getNotes?clientId=${clientId}`,
            )
            console.log('handlednote res: ', response)
            console.log('responseData ', response.data)
            setNotes(response.data)
            setHasNotes(response.data.length > 0) // Check if there are notes
        } catch (error) {
            console.error('Error fetching notes:', error)
        }
        setLoading(false)
    }

    useEffect(() => {
        setClientDetails()
    }, [])

    return loading || clientId === 0 ? (
        <Loader />
    ) : error ? (
        <InternalServerErrorPage />
    ) : (
        <>
            <CustomModal
                className="note-modal"
                title={'Notes'}
                show={showNotePopup}
                width="medium"
                //dark={true}
                onHide={() => {
                    setShowNotePopup(false)
                }}
            >
                <NotePopup
                    clientId={clientId}
                    username={location.state.name}
                    onClose={() => handleNotePopupClose()}
                />
                {/* <div>None of the above</div> */}
            </CustomModal>
            <div className="workout container-xl pb-5">
                <div className="clientHeader">
                    <div className="client">
                        <ClientContainer
                            showAccordian={false}
                            showBackButton={true}
                            showContainer={false}
                            clientList={[client]}
                            showWorkoutButton={false}
                            showLastWorkout={false}
                        />
                    </div>

                    <div className="toggle2">
                        <Buttons
                            showWorkout={action}
                            setShowWorkout={(i) => setAction(i)}
                        />
                    </div>
                    <div
                        onClick={() =>
                            history.push({
                                pathname: `tasks/${clientId}`,
                                state: { ...client },
                            })
                        }
                        className="tasks"
                    >
                        Tasks
                    </div>
                </div>

                {action == 'Workout' ? (
                    <>
                        {' '}
                        <Completed
                            clientId={clientId}
                            client={location.state}
                            setLatestCompletedSession={
                                setLatestCompletedSession
                            }
                            cycle={cycle}
                            setCycle={(cycle) => setCycle(cycle)}
                        />
                        <Remaining
                            clientId={clientId}
                            latestCompletedSession={latestCompletedSession}
                            cycle={cycle}
                            setCycle={(cycle) => setCycle(cycle)}
                        />
                    </>
                ) : action == 'Stats' ? (
                    <>
                        <Trackers clientId={clientId} />
                    </>
                ) : action == 'profile' ? (
                    <>
                        <UserProfileComponent clientId={clientId} />
                    </>
                ) : action == 'Nutrition' ? (
                    <>
                        {/* <Nutrition clientId={clientId}/> */}
                        <NutritionScreenComp
                            clientId={clientId}
                            client={location.state}
                        />
                    </>
                ) : (
                    <Tasks />
                )}
                <div
                    className={`addNotesButton ${hasNotes ? 'hasNotes' : ''}`}
                    onClick={handleAddNoteClick}
                >
                    <FiEdit3 size={30} />
                </div>
                {/* 
            {showNotePopup && (
                <NotePopup
                    clientId={clientId}
                    username={location.state.name}
                    notes={notes}
                    onClose={() => setShowNotePopup(false)}
                    onAddNote={handleAddNote}
                />
            )} */}
            </div>
        </>
    )
}

export default Workout
