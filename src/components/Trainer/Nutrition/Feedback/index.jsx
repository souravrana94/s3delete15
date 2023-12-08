import React, { useState, useEffect } from 'react'
import { Image } from 'react-bootstrap'
import PropTypes from 'prop-types'
import './index.scss'
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar'
import Carousel from '../../../Common/Carousel'
import FeedbackCard from './FeedbackCard'
import Button from '../../../Common/Button'
import axios from '../../../../store/axios-secure'
import { Icon } from '@iconify/react'
import NutritionProgressBar from '../ProgressBar'
import Loader from '../../../Common/Loader'

const NutritionFeedback = ({
    session,
    setUpdatedSession,
    setFeedbackCompleted,
    client,
    graphData,
    completedPercentage,
    foodItems,
    cycle,
    setCycle,
}) => {
    const [isSuccess, setIsSuccess] = useState(false)
    const [isError, setIsError] = useState(false)
    const [disableSave, setDisableSave] = useState(false)
    const [loading, setLoading] = useState(false)
    const completedPercentageFormatted = (completedPercentage * 100)?.toFixed(0)
    const formattedDate = new Date(session?.date).toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
    })
    const mealTypeArray = [
        'Breakfast',
        'Morning Snacks',
        'Lunch',
        'Evening Snacks',
        'Dinner',
    ]
    const setExercise = (exercise, idx) => {
        // const updatedExercises = [...exercises]
        // updatedExercises[idx] = {
        //     ...updatedExercises[idx],
        //     feedbackVoiceNoteUrl: exercise?.feedbackVoiceNoteUrl,
        //     feedbackComment: exercise?.feedbackComment,
        //     formRating: exercise?.formRating,
        // }
        // setExercises(updatedExercises) //setFoodItems
    }

    const onSubmitHandler = (data, idx) => {
        // const updatedExercises = [...exercises]
        // if (data) {
        //     updatedExercises[idx]['feedbackVoiceNote'] = data?.audioFile
        //     updatedExercises[idx].feedbackVoiceNoteUrl = data?.audioUrl
        // }
        // return updatedExercises
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

    // const saveFeedback = async () => {
    //     try {
    //         setIsError(false)
    //         setIsSuccess(false)
    //         const data = onSubmitHandler()
    //         const formData = new FormData()
    //         formData.append('sessionId', session._id)
    //         data.map((item, i) => {
    //             const exerciseJSON = item
    //             if (
    //                 item.feedbackVoiceNote
    //             ) {
    //                 formData.append('voice', item.feedbackVoiceNote, `${i}.mp3`)
    //             }
    //             console.log(formData.getAll('voice'))
    //             delete exerciseJSON.feedbackVoiceNote
    //             formData.append(i.toString(), JSON.stringify(exerciseJSON))
    //         })
    //         const response = await axios.put(
    //             '/workoutpnp/sessions/update/feedback',
    //             formData,
    //             {
    //                 headers: {
    //                     'Content-Type': 'multipart/form-data',
    //                 },
    //             },
    //         )
    //         await fetchActiveCycle()
    //         setExercises(response.data.exercises) //setFoodItems
    //         setFeedbackCompleted(true)
    //         setIsSuccess(true)
    //         setIsError(false)
    //     } catch (error) {
    //         setIsSuccess(false)
    //         setIsError(true)
    //     }
    // }
    const handleSave = async () => {
        setLoading(true)
        setIsError(false)
        setIsSuccess(false)
        try {
            const response = await axios.post(`/dietPlan`, session)
            // console.log("response ", response)
            setIsSuccess(true)
            setIsError(false)
        } catch (e) {
            console.log('errorrrrrrr', e)
            setIsSuccess(false)
            setIsError(true)
        }
        setLoading(false)
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
                    <NutritionProgressBar graphData={graphData} />
                </div>
            </div>

            <div className="container-xl p-2">
                <Carousel breakpoints={[1250, 860]}>
                    {mealTypeArray.map((mealType, idx) => {
                        return (
                            <FeedbackCard
                                key={idx}
                                sessionData={session}
                                setUpdatedSession={setUpdatedSession}
                                mealType={mealType}
                                setExercise={(exercise) =>
                                    setExercise(exercise, idx)
                                }
                                modifier={(data) => onSubmitHandler(data, idx)}
                                setDisableSave={setDisableSave}
                            />
                        )
                    })}
                    {/* {session?.foodItems.map((item, idx) => (
                        <FeedbackCard
                            key={idx}
                            exercise={item}
                            setExercise={(exercise) =>
                                setExercise(exercise, idx)
                            }
                            modifier={(data) => onSubmitHandler(data, idx)}
                            setDisableSave={setDisableSave}
                        />
                    ))} */}
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
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                }}
            >
                {loading ? (
                    <div className="m-3">
                        <Loader />
                    </div>
                ) : (
                    <Button
                        text="Save"
                        color={'green'}
                        size="small"
                        classNames="m-2 mt-4"
                        onClick={handleSave}
                    />
                )}
            </div>
        </div>
    )
}

NutritionFeedback.propTypes = {}

export default NutritionFeedback
