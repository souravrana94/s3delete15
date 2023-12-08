import React from 'react'
import PropTypes from 'prop-types'
import { renderToString } from 'react-dom/server'
import ReactTooltip from 'react-tooltip'
import './index.scss'
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar'
import { Icon } from '@iconify/react'

const CompletedHeader = ({
    completedPercentage,
    routineName,
    performDate,
    userFeedback,
    activeTime,
    totalTime,
}) => {
    const completedPercentageFormatted = (completedPercentage * 100)?.toFixed(0)
    const sessionDate = performDate
        ? new Date(performDate).toISOString().split('T')
        : null
    let dateString = ''
    const months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'July',
        'Aug',
        'Sept',
        'Oct',
        'Nov',
        'Dec',
    ]
    if (sessionDate) {
        const dateArray = sessionDate[0].split('-')
        dateString =
            dateArray[2] +
            ' ' +
            months[parseInt(dateArray[1]) - 1] +
            ' ' +
            dateArray[0].substring(2, 4) +
            ' ' +
            sessionDate[1].substring(0, 5)
    }
    const rand = Math.random()
    const getTooltipContent = ({ display }) => {
        const stringData = renderToString(<div>{display ? display : null}</div>)
        return stringData
    }
    return (
        <div className="completed-header">
            <div className="routine-data">
                <div className="routine">{routineName}</div>
                <div className="scheduled-date">{dateString}</div>
            </div>
            <div className="progress-feedback">
                <div className="userFeedback">
                    {userFeedback?.comment && (
                        <div data-for={`getContent-${rand + 2}`} data-tip>
                            <Icon
                                icon={'gridicons:comment'}
                                height={24}
                                style={{ marginTop: '10px' }}
                                className="analysis-icon"
                            />
                            <ReactTooltip
                                className="tooltip-container-comment"
                                id={`getContent-${rand + 2}`}
                                place="right"
                                effect="solid"
                                multiline={true}
                                getContent={() =>
                                    getTooltipContent({
                                        display: userFeedback?.comment,
                                    })
                                }
                                html={true}
                            />
                        </div>
                    )}
                </div>
                <div className="feedback">
                    <div className="analysis">
                        <div className="workout-time">
                            <Icon
                                icon={'bx:timer'}
                                height={24}
                                style={{ marginBottom: '2px' }}
                                className="analysis-icon"
                            />
                            {activeTime} {activeTime != '-' ? 'm' : ''}
                        </div>
                        <div className="workout-time">
                            <Icon
                                icon={'ic:outline-timer'}
                                height={20}
                                style={{ marginBottom: '2px' }}
                                className="analysis-icon"
                            />
                            {totalTime} {totalTime != '-' ? 'm' : ''}
                        </div>
                        {userFeedback && (
                            <div className="feedback-text">
                                <img
                                    src={`https://storage.googleapis.com/evolv-mobile/feedback/duration/${userFeedback?.duration?.toLowerCase()}_w.png`}
                                    height={18}
                                    className="analysis-icon"
                                />
                                {userFeedback?.duration}
                            </div>
                        )}
                        {userFeedback && (
                            <div className="feedback-text">
                                <img
                                    src={`https://storage.googleapis.com/evolv-mobile/feedback/difficulty/${userFeedback?.difficulty?.toLowerCase()}_w.png`}
                                    height={18}
                                    className="analysis-icon"
                                />
                                {userFeedback?.difficulty}
                            </div>
                        )}
                    </div>
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
        </div>
    )
}

CompletedHeader.propTypes = {
    completedPercentage: PropTypes.number,
    routineName: PropTypes.string,
    performDate: PropTypes.string,
    postWorkoutComment: PropTypes.string,
}

export default CompletedHeader
