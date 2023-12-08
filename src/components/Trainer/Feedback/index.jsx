import React, { useState, useEffect } from 'react'
import { Image } from 'react-bootstrap'
import PropTypes from 'prop-types'
import './index.scss'
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar'
import Carousel from '../../Common/Carousel'
import FeedbackCard from './FeedbackCard'
import Button from '../../Common/Button'
import axios from '../../../store/axios-secure'
import { Icon } from '@iconify/react'
import CustomModal from '../../Common/Modal' //?
import SessionTable from '../Workout/Session/SessionTable'
import EditExercise from '../EditExercise'

const Feedback = ({
    session,
    setFeedbackCompleted,
    client,
    completedPercentage,
    exercises,
    setExercises,
    cycle,
    setCycle,
    setExerciseUpdated,
}) => {
    const [isSuccess, setIsSuccess] = useState(false)
    const [isError, setIsError] = useState(false)
    const [disableSave, setDisableSave] = useState(false)
    const [clientId, setClientId] = useState(location.pathname.split('/')[2])
    const [saveFeedClicked, setSaveFeedClicked] = useState(false)
    const [canExerciseAdded, setCanExerciseAdded] = useState(true)
    // const [showAddExerciseModal, setShowAddExerciseModal] = useState(false);
    const [newExr, setNewExr] = useState([])
    // const toggleAddExerciseModal = () => {
    //     setShowAddExerciseModal(!showAddExerciseModal);
    // };//?

    const completedPercentageFormatted = (completedPercentage * 100)?.toFixed(0)
    const formattedDate = new Date(session?.date).toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
    })
    const addExercise = () => {
        const updatedExercises = [
            ...exercises,
            {
                _id: Math.random(),
                exerciseInfoRef: '-',
                exerciseSets: [
                    {
                        number: 1,
                        suggestedWeightRange: [],
                        suggestedRepRange: [10, 15],
                        suggestedRIRRange: [1, 3],
                    },
                    {
                        number: 2,
                        suggestedWeightRange: [],
                        suggestedRepRange: [10, 15],
                        suggestedRIRRange: [1, 3],
                    },
                    {
                        number: 3,
                        suggestedWeightRange: [],
                        suggestedRepRange: [10, 15],
                        suggestedRIRRange: [1, 3],
                    },
                ],
            },
        ]
        setExercises(updatedExercises)
    }
    const setExercise = (exercise, idx) => {
        const updatedExercises = [...exercises]
        updatedExercises[idx] = {
            ...updatedExercises[idx],
            feedbackVoiceNoteUrl: exercise?.feedbackVoiceNoteUrl,
            feedbackComment: exercise?.feedbackComment,
            formRating: exercise?.formRating,
            exerciseSets: exercise?.exerciseSets,
        }
        setExercises(updatedExercises)
    }

    const deleteExercise = (idx) => {
        const updatedExercises = [...exercises]
        updatedExercises.splice(idx, 1)
        setExercises(updatedExercises)
        //setEditableExercise(-1)
    }
    const onSubmitHandler = (data, idx) => {
        const updatedExercises = [...exercises]
        if (data) {
            updatedExercises[idx]['feedbackVoiceNote'] = data?.audioFile
            updatedExercises[idx].feedbackVoiceNoteUrl = data?.audioUrl
        }
        // setExercises(updatedExercises)
        return updatedExercises
    }

    const fetchActiveCycle = async () => {
        try {
            const clientId = location.pathname.split('/')[2]
            const response = await axios.get(
                `/workoutpnp/cycles/fetch?clientId=${clientId}`,
            )
            setCycle(response?.data)
        } catch (err) {
            setIsSuccess(false)
            setIsError(true)
        }
    }

    const saveFeedback = async () => {
        try {
            setSaveFeedClicked(true)
            setIsError(false)
            setIsSuccess(false)
            const data = onSubmitHandler()
            const formData = new FormData()
            formData.append('sessionId', session._id)
            data.map((item, i) => {
                const exerciseJSON = item
                if (
                    // typeof item.feedbackVoiceNoteUrl != 'string' &&
                    item.feedbackVoiceNote
                ) {
                    // const mp3Blob = audioBufferToWav(item.feedbackVoiceNoteUrl)
                    // if (mp3Blob) {
                    // formData.append('voice', item.feedbackVoiceNoteUrl, `${i}.webm`)
                    formData.append('voice', item.feedbackVoiceNote, `${i}.mp3`)

                    // } else {
                    //     throw new Error('Error converting wav to mp3')
                    // }
                }
                console.log(formData.getAll('voice'))
                delete exerciseJSON.feedbackVoiceNote
                formData.append(i.toString(), JSON.stringify(exerciseJSON))
            })
            const response = await axios.put(
                '/workoutpnp/sessions/update/feedback',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                },
            )
            await fetchActiveCycle()
            setExercises(response.data.exercises)
            setFeedbackCompleted(true)
            setIsSuccess(true)
            setIsError(false)
        } catch (error) {
            setIsSuccess(false)
            setIsError(true)
        }
    }
    return (
        <div className="feedback">
            <div className="client-header">
                <div className="col-md-4 client-profile">
                    <Image
                        src={
                            client?.photoUrl ??
                            'https://storage.googleapis.com/evolv-store/icons/auth/profile.jpg'
                        }
                        roundedCircle
                        width="35px"
                        height="35px"
                    />
                    <p className="client-name">{client?.name}</p>
                </div>
                <div className="col-md-2">
                    <Icon
                        icon={'mdi:weight-lifter'}
                        color={'white'}
                        height={20}
                    />
                    <p className="detail-text">{session?.name}</p>
                </div>
                <div className="col-md-2">
                    <Icon
                        icon={'ant-design:calendar-outlined'}
                        color={'white'}
                        height={20}
                    />
                    <p className="detail-text">{formattedDate}</p>
                </div>
                <div className="col-md-3 progress-feedback">
                    <div className="feedback">
                        <div className="workout-time">
                            {Math.floor(session?.activeTime / 60)} mins
                        </div>
                        {/* <div className="feedback-text">Tired</div> */}
                    </div>
                    <CircularProgressbar
                        className="circular-progress-bar"
                        value={completedPercentageFormatted}
                        text={`${completedPercentageFormatted}%`}
                        backgroundPadding={2}
                        styles={buildStyles({
                            textColor: '#FFFFFF',
                            pathColor: '#7FD18C',
                            trailColor: '#FFFFFF',
                            textSize: '25px',
                        })}
                    />
                </div>
                {/* <div className="add-exercise-btn">
                    {' '}
                    <Button
                        //classNames="add-exercise-btn"
                        onClick={() => addExercise()}
                        text={'+ Add'}
                        size={'s'}
                    />
                </div> */}
                <Button
                    //classNames="add-exercise-btn"
                    // onClick={() => addExercise()}
                    onClick={() => (canExerciseAdded ? addExercise() : null)}
                    text={'+ Add'}
                    size={'s'}
                />
            </div>
            <div className="container-xl p-4">
                <Carousel breakpoints={[1250, 860]}>
                    {session?.exercises.map((ex, idx) => (
                        <FeedbackCard
                            sessionId={session._id} //?
                            routineRef={session.routineRef} //?
                            variantType={session.variantType} //?
                            key={idx}
                            exercise={ex}
                            setExercise={(exercise) =>
                                setExercise(exercise, idx)
                            }
                            deleteExercise={() => deleteExercise(idx)}
                            modifier={(data) => onSubmitHandler(data, idx)}
                            setDisableSave={setDisableSave}
                            fetchActiveCycle={fetchActiveCycle} //?
                            clientId={clientId}
                            saveFeedClicked={saveFeedClicked}
                            setSaveFeedClicked={setSaveFeedClicked}
                            setFeedbackCompleted={setFeedbackCompleted}
                            setCanExerciseAdded={setCanExerciseAdded}
                            setExerciseUpdated={setExerciseUpdated}
                        />
                    ))}
                </Carousel>
                {isSuccess ? (
                    <small className="message success">
                        Saved Successfully
                    </small>
                ) : null}
                {isError ? (
                    <small className="message error">
                        Something went wrong
                    </small>
                ) : null}
                {/* <div className="d-flex justify-content-center">
                    <Button
                        disabled={disableSave}
                        onClick={saveFeedback}
                        iconComponent={'bx:save'}
                        removeIconOn={'xs'}
                        text={'Save Feedback'}
                        color="green"
                        classNames="m-2 mt-4"
                        size="s"
                        iconSize={24}
                    />
                </div> */}
            </div>
        </div>
    )
}

Feedback.propTypes = {}

export default Feedback
