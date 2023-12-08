import React from 'react'
import PropTypes from 'prop-types'
import { renderToString } from 'react-dom/server'
import ReactTooltip from 'react-tooltip'
import ProgressBar from '@ramonak/react-progress-bar'
import './index.scss'
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar'
import PieChart from '../../../../Common/NutritionPieChart'
import { Icon } from '@iconify/react'
import moment from 'moment'
import NutritionProgressBar from '../../ProgressBar'

const CompletedHeader = ({
    completedPercentage,
    routineName,
    performDate,
    graphData,
    images,
    // userFeedback,
    // activeTime,
    // totalTime,
}) => {
    const completedPercentageFormatted = (completedPercentage * 100)?.toFixed(0)
    const sessionDate = performDate
        ? // ? new Date(performDate).toISOString().split('T')
          new Date(performDate)
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
        // const dateArray = sessionDate[0].split('-')
        // dateString =
        //     dateArray[2] +
        //     ' ' +
        //     months[parseInt(dateArray[1]) - 1] +
        //     ' ' +
        //     dateArray[0].substring(2, 4) +
        //     ' ' +
        //     sessionDate[1].substring(0, 5)
        dateString = moment(sessionDate).format('DD MMM yy')
    }
    const rand = Math.random()
    // const getTooltipContent = ({ display }) => {
    //     const stringData = renderToString(<div>{display ? display : null}</div>)
    //     return stringData
    // }
    return (
        <div className="Nutritioncompleted-header">
            <div style={{ display: 'flex' }}>
                {/* <PieChart
                    renderScreen="card"
                    protein={graphData?.protein}
                    fat={graphData?.fat}
                    carbs={graphData?.carbs}
                    calories={graphData?.calories}
                /> */}
                <div className="routine-data">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div className="routine-name">{routineName}</div>
                        {images && images.length ? (
                            <Icon
                                icon={'ion:images'}
                                color="white"
                                className="m-1"
                            />
                        ) : null}
                    </div>
                    <div className="scheduled-date">{dateString}</div>
                </div>
            </div>
            <NutritionProgressBar graphData={graphData} />

            {/* <div className="progress-feedback">
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
            </div> */}
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
