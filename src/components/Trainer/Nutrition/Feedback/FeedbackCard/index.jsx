import React, { useState, useEffect } from 'react'
import { Image } from 'react-bootstrap'
import PropTypes from 'prop-types'
import './index.scss'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import VideoPlayer from 'react-player'
import { ReactMediaRecorder } from 'react-media-recorder'
import AudioRecorder from '../../../../Common/AudioRecorder'
import Carousel from '../../../../Common/Carousel'
import ReactPlayer from 'react-player'
import CustomModal from '../../../../Common/Modal'
import { Icon } from '@iconify/react'

import DVideoPlayer from './OfflinePlayer'

const attributeHeading = ['Sets', 'Load', 'Reps', 'RIR']

const FeedbackCard = ({
    sessionData,
    mealType,
    setUpdatedSession,
    modifier = (data) => {
        return data
    },
    setDisableSave,
}) => {
    const [form, setForm] = useState(sessionData?.formRating ?? 0)
    const [feedbackComment, setFeedbackComment] = useState(null)
    const [mealIndex, setMealIndex] = useState(null)
    const [zoomImage, setZoomImage] = useState(false)
    const [showImageModal, setShowImageModal] = useState(false)
    const [imgURL, setImgURL] = useState('')
    let [audioUrl, isRecording, startRecording, stopRecording, audioFile] =
        AudioRecorder()
    const getDashOrValue = (value) =>
        !value || value === -1 ? '-' : Number(value).toFixed(0)
    useEffect(() => {
        setDisableSave(isRecording)
    }, [isRecording])
    if (audioFile) modifier({ audioFile, audioUrl })

    const [playedSeconds, setPlayedSeconds] = useState(0)

    const handleSeek = (seconds) => {
        console.log('Seeking to ', seconds)
        setPlayedSeconds(seconds)
    }
    const handleUpdateFeedback = (s, text) => {
        setFeedbackComment(text)
        let editableData = { ...sessionData }
        let index = editableData?.foodItems.findIndex(
            (item) => item?._id === s?._id,
        )
        if (index !== -1 && text) {
            editableData.foodItems[index]['feedback'] = text
            setUpdatedSession(editableData?.foodItems)
        }
        console.log('------------', s?._id, index, editableData)
    }
    const handleMealIndexAdd = (s, idx) => {
        setFeedbackComment(s?.feedback)
        setMealIndex(idx)
    }

    return (
        <div className="feedback-card-container">
            <div className="content">
                <div className="routine pb-1">{mealType}</div>
                {sessionData?.pictrues ? (
                    <>
                        {' '}
                        <div style={{ padding: '10px' }}>
                            <Carousel slidesToShow={1}>
                                {sessionData?.pictrues
                                    ?.filter(
                                        (item) => item?.mealType === mealType,
                                    )
                                    ?.map((item, idx) => {
                                        return (
                                            <div>
                                                <img
                                                    onClick={() =>
                                                        // setZoomImage(!zoomImage)
                                                        {
                                                            setShowImageModal(
                                                                true,
                                                            )
                                                            setImgURL(
                                                                item.imageUrl,
                                                            )
                                                        }
                                                    }
                                                    src={item.imageUrl}
                                                    className="foodImage"
                                                    style={{
                                                        height: zoomImage
                                                            ? '400px'
                                                            : '200px',
                                                    }}
                                                />
                                            </div>
                                        )
                                    })}
                            </Carousel>
                        </div>
                    </>
                ) : null}
                <div>
                    <div className="table-heading">
                        <div className="set">Quantity</div>
                        <div className="set">Measure</div>
                        <div className="weight">Calorie</div>
                        <div className="weight">Protein</div>
                        <div className="rep">Fat</div>
                        <div className="rir">Carbs</div>
                    </div>
                    <div className="body">
                        {sessionData?.foodItems
                            ?.filter((item) => item?.mealType === mealType)
                            ?.map((s, idx) => (
                                <div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                            }}
                                        >
                                            <div className="foodName">
                                                {s?.foodInfoRef?.name}
                                            </div>
                                            {s?.isCompleted ? (
                                                <input
                                                    type="checkbox"
                                                    checked={s?.isCompleted}
                                                />
                                            ) : null}
                                        </div>
                                        <div
                                            style={{
                                                alignSelf: 'center',
                                                marginBottom: '3px',
                                            }}
                                        >
                                            <Icon
                                                icon={
                                                    s?.feedback
                                                        ? 'mdi:note-edit'
                                                        : 'mdi:note-plus'
                                                }
                                                height={15}
                                                width={15}
                                                className="iconNote"
                                                onClick={() =>
                                                    handleMealIndexAdd(s, idx)
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="set-row" key={idx}>
                                        <div className="weight">
                                            {getDashOrValue(
                                                s?.takenQuantity,
                                            ) === getDashOrValue(s?.quantity) ||
                                            !s?.takenQuantity ? (
                                                <div
                                                    className={
                                                        !s?.takenQuantity
                                                            ? 'right'
                                                            : 'left'
                                                    }
                                                >
                                                    {getDashOrValue(
                                                        s?.quantity,
                                                    )}
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="left">
                                                        {getDashOrValue(
                                                            s?.takenQuantity,
                                                        )}
                                                    </div>
                                                    <div className="right">
                                                        {getDashOrValue(
                                                            s?.quantity,
                                                        )}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                        <div className="weight">
                                            {s?.takenUnit === s?.unit ||
                                            !s?.takenUnit ? (
                                                <div
                                                    className={
                                                        !s?.takenUnit
                                                            ? 'right'
                                                            : 'left'
                                                    }
                                                >
                                                    {s?.unit}
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="left">
                                                        {s?.takenUnit}
                                                    </div>
                                                    <div className="right">
                                                        {s?.unit}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                        <div className="weight">
                                            {getDashOrValue(
                                                s?.takenCalories,
                                            ) === getDashOrValue(s?.calories) ||
                                            !s?.takenCalories ? (
                                                <div
                                                    className={
                                                        !s?.takenCalories
                                                            ? 'right'
                                                            : 'left'
                                                    }
                                                >
                                                    {getDashOrValue(
                                                        s?.calories,
                                                    )}
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="left">
                                                        {getDashOrValue(
                                                            s?.takenCalories,
                                                        )}
                                                    </div>
                                                    <div className="right">
                                                        {getDashOrValue(
                                                            s?.calories,
                                                        )}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                        <div className="weight">
                                            {getDashOrValue(s?.takenProtein) ===
                                                getDashOrValue(s?.protein) ||
                                            !s?.takenProtein ? (
                                                <div
                                                    className={
                                                        !s?.takenProtein
                                                            ? 'right'
                                                            : 'left'
                                                    }
                                                >
                                                    {getDashOrValue(s?.protein)}
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="left">
                                                        {getDashOrValue(
                                                            s?.takenProtein,
                                                        )}
                                                    </div>
                                                    <div className="right">
                                                        {getDashOrValue(
                                                            s?.protein,
                                                        )}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                        <div className="rep">
                                            {getDashOrValue(s?.takenFat) ===
                                                getDashOrValue(s?.fat) ||
                                            !s?.takenFat ? (
                                                <div
                                                    className={
                                                        !s?.takenFat
                                                            ? 'right'
                                                            : 'left'
                                                    }
                                                >
                                                    {getDashOrValue(s?.fat)}
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="left">
                                                        {getDashOrValue(
                                                            s?.takenFat,
                                                        )}
                                                    </div>
                                                    <div className="right">
                                                        {getDashOrValue(s?.fat)}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                        <div className="rep">
                                            {getDashOrValue(s?.takenCarbs) ===
                                                getDashOrValue(s?.carbs) ||
                                            !s?.takenCarbs ? (
                                                <div
                                                    className={
                                                        !s?.takenCarbs
                                                            ? 'right'
                                                            : 'left'
                                                    }
                                                >
                                                    {getDashOrValue(s?.carbs)}
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="left">
                                                        {getDashOrValue(
                                                            s?.takenCarbs,
                                                        )}
                                                    </div>
                                                    <div className="right">
                                                        {getDashOrValue(
                                                            s?.carbs,
                                                        )}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    {s?.userFeedback ? (
                                        <div className="userFeedback">
                                            <Icon
                                                icon={
                                                    'fluent:person-feedback-16-filled'
                                                }
                                                height={15}
                                                width={15}
                                                className="iconfeedback"
                                            />
                                            {s?.userFeedback}
                                        </div>
                                    ) : null}
                                    {s?.feedback && mealIndex !== idx ? (
                                        <div className="userFeedback">
                                            <Icon
                                                icon={
                                                    'fluent:comment-note-24-filled'
                                                }
                                                height={15}
                                                width={15}
                                                className="iconfeedback"
                                            />
                                            {s?.feedback}
                                        </div>
                                    ) : null}
                                    {mealIndex === idx ? (
                                        <input
                                            className="input-text-feedback"
                                            value={feedbackComment}
                                            onChange={(e) => {
                                                handleUpdateFeedback(
                                                    s,
                                                    e.target.value,
                                                )
                                            }}
                                        />
                                    ) : null}
                                </div>
                            ))}
                    </div>
                </div>
            </div>
            <CustomModal
                show={showImageModal}
                width="fullwidth"
                // title="Feedback"
                onHide={() => {
                    setShowImageModal(false)
                }}
                dark={true}
            >
                <div>
                    <img
                        src={imgURL}
                        style={{
                            padding: '5px',
                            objectFit: 'contain',
                            height: '90vh',
                            width: '100%',
                            margin: '0 auto',
                        }}
                    />
                </div>
            </CustomModal>
        </div>
    )
}

FeedbackCard.propTypes = {}

export default FeedbackCard
