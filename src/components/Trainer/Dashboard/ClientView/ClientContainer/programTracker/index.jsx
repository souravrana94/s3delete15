import React, { useState } from 'react'
import {
    CircularProgressbarWithChildren,
    buildStyles,
} from 'react-circular-progressbar'
import './index.scss'
import ReactTooltip from 'react-tooltip'
import { renderToString } from 'react-dom/server'
import axios from '../../../../../../store/axios-secure'
import { Icon } from '@iconify/react'

const ProgramTracker = ({
    startDate,
    endDate,
    clientId,
    isPaused,
    durationSelected,
    pausedDays,
    refresh,
    setRefresh,
    setButtonClicked,
}) => {
    const [paused, setPaused] = useState(isPaused)
    const noOfDays = (date_1, date_2) => {
        date_1 = new Date(date_1)
        date_2 = new Date(date_2)
        let difference = date_1.getTime() - date_2.getTime()
        let TotalDays = Math.ceil(difference / (1000 * 3600 * 24))
        return TotalDays
    }
    const daysCompleted = noOfDays(new Date(), startDate) - pausedDays
    let daysTotal = noOfDays(endDate, startDate)
    daysTotal -= pausedDays

    const updatePlan = async () => {
        try {
            const action = paused ? 'Resume' : 'Pause'
            setPaused(!paused)
            const res = await axios.put(
                `trainers/plan?clientId=${clientId}&action=${action}`,
            )
            setButtonClicked(true)
            setRefresh(!refresh)
            console.log(refresh)
        } catch (err) {
            console.log(err)
        }
    }

    const getToolTip = ({ startDate, endDate }) => {
        const stringData = paused
            ? renderToString(
                  <div className="program-tooltip-div">
                      <p className="date">
                          {daysCompleted +
                              (daysCompleted > 3
                                  ? 'th'
                                  : daysCompleted == 3
                                  ? 'rd'
                                  : daysCompleted == 2
                                  ? 'nd'
                                  : 'st')}{' '}
                          day
                      </p>
                      <div className="date">Double tap to Resume</div>
                  </div>,
              )
            : renderToString(
                  <div className="program-tooltip-div">
                      <div className="date">Start: {startDate}</div>
                      <div className="date">End: {endDate}</div>
                      {durationSelected && (
                          <div className="date">
                              Duration: {durationSelected} Days
                          </div>
                      )}
                  </div>,
              )
        return stringData
    }

    let percentage =
        daysCompleted && daysTotal
            ? parseInt((daysCompleted / daysTotal) * 100 ?? 0)
            : 0
    return (
        <>
            <div className="program-container">
                <div className="program" onDoubleClick={updatePlan}>
                    <div>
                        <CircularProgressbarWithChildren
                            value={percentage}
                            styles={buildStyles({
                                rotation: 0.25,
                                pathColor: '#cf03fc',
                            })}
                        >
                            <div
                                className="children"
                                key={0}
                                data-for={`getContent-${clientId}`}
                                data-tip
                            >
                                {paused ? (
                                    <Icon
                                        icon={'material-symbols:pause'}
                                        // onClick={()=>setExpanded(null)}
                                        className="close-rest-img ms-1"
                                        height={40}
                                    />
                                ) : (
                                    <>
                                        {' '}
                                        <h5>
                                            {daysCompleted +
                                                (daysCompleted > 3
                                                    ? 'th'
                                                    : daysCompleted == 3
                                                    ? 'rd'
                                                    : daysCompleted == 2
                                                    ? 'nd'
                                                    : 'st')}
                                        </h5>
                                        <p>day</p>
                                    </>
                                )}
                            </div>
                        </CircularProgressbarWithChildren>
                        <ReactTooltip
                            id={`getContent-${clientId}`}
                            className="tooltip-container-program"
                            getContent={() =>
                                getToolTip({
                                    startDate: new Date(
                                        startDate,
                                    ).toLocaleDateString(),
                                    endDate: new Date(
                                        endDate,
                                    ).toLocaleDateString(),
                                })
                            }
                            html={true}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProgramTracker
