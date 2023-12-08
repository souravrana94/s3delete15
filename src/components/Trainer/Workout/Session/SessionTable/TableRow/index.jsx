import React, { useEffect } from 'react'
import { renderToString } from 'react-dom/server'
import PropTypes from 'prop-types'
import ReactTooltip from 'react-tooltip'
import { useState } from 'react'
import { getRange } from '../../../../../../utilities/utilities'
import './index.scss'
import { Icon } from '@iconify/react'
import { FaExclamation } from 'react-icons/fa'

const TableRow = ({ exercise, completed, isEditing, editExercise }) => {
    const [details, setDetails] = useState({})
    useEffect(() => {
        const numOfSets = exercise?.exerciseSets?.length
        const sets = exercise?.exerciseSets?.map((s) => {
            return {
                ...s,
                weight: completed
                    ? s?.performedWeight
                    : s?.suggestedWeightRange,
                reps: completed ? s?.performedReps : s?.suggestedRepRange,
                RIR: completed ? s?.performedRIR : s?.suggestedRIRRange,
            }
        })
        const weightRange = getRange(sets?.map((e) => e.weight))
        const repRange = getRange(sets?.map((e) => e.reps))
        const RIRRange = getRange(sets?.map((e) => e.RIR))
        setDetails({
            sets,
            numOfSets,
            weightRange,
            repRange,
            RIRRange,
        })
    }, [])

    const getDashOrValue = (value) => {
        return !value || value === -1 ? '-' : value
    }

    const getTooltipContent = (details) => {
        const stringData = renderToString(
            <div>
                <div className="heading">
                    <div className="set">Sets</div>
                    <div className="weight">Weight</div>
                    <div className="rep">Reps</div>
                    <div className="rir">RIR</div>
                </div>
                <div className="body">
                    {details?.sets?.map((s, idx) => {
                        return (
                            <div className="set-row" key={idx}>
                                <div className="set">
                                    {getDashOrValue(idx + 1)}
                                </div>
                                <div className="weight">
                                    <div className="left">
                                        {getDashOrValue(
                                            s?.suggestedWeightRange?.join('-'),
                                        )}
                                    </div>
                                    {completed ? (
                                        <div className="right">
                                            {getDashOrValue(s?.performedWeight)}
                                        </div>
                                    ) : null}
                                </div>
                                <div className="rep">
                                    <div className="left">
                                        {getDashOrValue(
                                            s?.suggestedRepRange?.join('-'),
                                        )}
                                    </div>
                                    {completed ? (
                                        <div className="right">
                                            {getDashOrValue(s?.performedReps)}
                                        </div>
                                    ) : null}
                                </div>
                                <div className="rep">
                                    <div className="left">
                                        {getDashOrValue(
                                            s?.suggestedRIRRange?.join('-'),
                                        )}
                                    </div>
                                    {completed ? (
                                        <div className="right">
                                            {getDashOrValue(s?.performedRIR)}
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>,
        )
        return stringData
    }
    const getVideoToolTip = (video) => {
        const stringData = renderToString(
            <video
                src={exercise?.exerciseInfoRef?.gifUrl}
                loop
                className="exercise-video-tooltip"
                autoPlay
            />,
        )
        return stringData
    }
    const rand = Math.random()

    return (
        <>
            <div className={`table-exercise-mobile`}>
                {!completed ? (
                    <div
                        className="exercise-video-gif"
                        style={{ cursor: 'pointer' }}
                        data-for={`getContent-${rand + 2}`}
                        data-tip
                    >
                        <video
                            src={exercise?.exerciseInfoRef?.gifUrl}
                            loop
                            className="exercise-video"
                        />
                        <ReactTooltip
                            place="right"
                            className="exercise-video-tooltip-container"
                            id={`getContent-${rand + 2}`}
                            getContent={() =>
                                getVideoToolTip(
                                    exercise?.exerciseInfoRef?.gifUrl,
                                )
                            }
                            html={true}
                        />
                    </div>
                ) : null}
                {exercise?.exerciseInfoRef?.name}
            </div>
            <div
                className={`table-row-container table-row-body ${
                    isEditing ? 'editable' : ''
                }`}
                onClick={() => isEditing && editExercise()}
            >
                <div className={`table-exercise`}>
                    {!completed ? (
                        <div
                            className="exercise-video-gif"
                            style={{ cursor: 'pointer' }}
                            data-for={`getContent-${rand + 1}`}
                            data-tip
                        >
                            <video
                                src={exercise?.exerciseInfoRef?.gifUrl}
                                loop
                                className="exercise-video"
                            />
                            <ReactTooltip
                                place="right"
                                className="exercise-video-tooltip-container"
                                id={`getContent-${rand + 1}`}
                                getContent={() =>
                                    getVideoToolTip(
                                        exercise?.exerciseInfoRef?.gifUrl,
                                    )
                                }
                                html={true}
                            />
                        </div>
                    ) : null}
                    {exercise?.exerciseInfoRef?.name}
                    {!completed && exercise.hasEdited && (
                        <FaExclamation style={{ color: '#36f5c7' }} />
                    )}
                </div>
                <div
                    data-for={`getContent-${rand}`}
                    data-tip
                    className="table-sets"
                >
                    {details?.numOfSets}
                    <ReactTooltip
                        className="tooltip-container"
                        id={`getContent-${rand}`}
                        getContent={() => getTooltipContent(details)}
                        html={true}
                    />
                </div>

                <div className="table-weights">
                    {details?.weightRange?.length == 0
                        ? 0
                        : details?.weightRange}{' '}
                    kg
                </div>
                <div className="table-reps">
                    {details?.repRange?.length == 0 ? 0 : details?.repRange}
                </div>
                <div className="table-reps">
                    {details?.RIRRange?.length == 0 ? 0 : details?.RIRRange}
                </div>
                {isEditing && (
                    <div className="table-action">
                        <Icon
                            className="close-rest-img"
                            icon={'ep:close-bold'}
                            color="white"
                            height={12}
                        />
                    </div>
                )}
            </div>
        </>
    )
}

TableRow.propTypes = {
    exercise: PropTypes.object,
    completed: PropTypes.bool,
    isEditing: PropTypes.bool,
    editExercise: PropTypes.func,
}

export default TableRow
