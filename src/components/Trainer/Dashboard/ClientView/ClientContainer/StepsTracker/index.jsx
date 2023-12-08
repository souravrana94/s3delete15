import React, { useEffect, useState, useRef } from 'react'
import {
    CircularProgressbarWithChildren,
    buildStyles,
} from 'react-circular-progressbar'
import Target from '../../../Common/Target'
import ReactTooltip from 'react-tooltip'
import { Bar } from 'react-chartjs-2'
import Chart from 'chart.js/auto'
import { CategoryScale } from 'chart.js'
import ErrorPage from '../../../../../Common/ErrorPage'
import axios from '../../../../../../store/axios-secure'
import './index.scss'
import { renderToString } from 'react-dom/server'

const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
]

const StepsTracker = ({ clientId, stepsWalked7Days, targetSteps }) => {
    let stepsWalkedToday = 0
    const [target, setTarget] = useState(targetSteps)
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)

    const skipEffect = useRef(true)

    let data = null,
        options = null
    useEffect(() => {
        if (skipEffect.current) {
            skipEffect.current = false
            return
        }
        const setTargetData = async () => {
            try {
                setIsLoading(true)
                const response = await axios.post(`trainers/targetSteps`, {
                    targetSteps: Number(target),
                    clientId: clientId,
                })
                setIsLoading(false)
            } catch (error) {
                setIsLoading(false)
                setIsError(true)
            }
        }

        const timer = setTimeout(setTargetData, 1000)
        return () => {
            clearTimeout(timer)
        }
    }, [target])

    if (stepsWalked7Days.length > 0) {
        const today = new Date()
        const lastTrackedDate = new Date(stepsWalked7Days[0].date)
        if (
            lastTrackedDate.getMonth() === today.getMonth() &&
            lastTrackedDate.getDate() === today.getDate() &&
            lastTrackedDate.getFullYear() === today.getFullYear()
        )
            stepsWalkedToday = stepsWalked7Days[0].stepsWalked

        const labels = stepsWalked7Days.map((stepsObj) => {
            const date = new Date(stepsObj.date)
            return date.getDate() + ' ' + months[date.getUTCMonth()]
        })

        const steps = stepsWalked7Days.map((stepsObj) => stepsObj.stepsWalked)
        labels.reverse()
        steps.reverse()

        let max = 0
        stepsWalked7Days.forEach((stepObj) => {
            max = Math.max(max, stepObj.stepsWalked)
        })
        data = {
            labels: labels,
            datasets: [
                {
                    label: 'Steps Graph',
                    data: steps,
                    backgroundColor: '#7FD18C',
                    borderColor: 'black',
                    color: 'white',
                    barThickness: 15,
                    borderRadius: 3,
                },
            ],
        }

        options = {
            responsive: true,
            plugins: {
                legend: {
                    display: false,
                },
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: function (context) {
                            if (context.tick.value === target) {
                                return '#8899cd'
                            } else {
                                return 'grey'
                            }
                        },
                        borderDash: function (context) {
                            if (context.tick.value === target) {
                                return [10]
                            } else {
                                return [1]
                            }
                        },
                        lineWidth: function (context) {
                            if (context.tick.value === target) {
                                return 2
                            } else {
                                return 1
                            }
                        },
                    },
                    max: Math.max(max, target),
                    ticks: {
                        stepSize: Math.min(target, max),
                        color: function (context) {
                            if (context.tick.value === target) {
                                return '#8899cd'
                            } else {
                                return 'grey'
                            }
                        },
                    },
                },
                x: {
                    ticks: {
                        color: 'white',
                        maxRotation: 0,
                        minRotation: 0,
                        font: function (context) {
                            var avgSize = Math.round(
                                (context.chart.height + context.chart.width) /
                                    2,
                            )
                            var size = Math.round(avgSize / 24)
                            size = size > 11 ? 11 : size // setting max limit to 12
                            return {
                                size: size,
                            }
                        },
                    },
                },
            },
        }
    }
    const percentage = (stepsWalkedToday / target) * 100

    return isError ? (
        <ErrorPage />
    ) : (
        <>
            <ReactTooltip
                className={data && 'tooltip-container-steps'}
                place="bottom"
                id={`getContent-${clientId}`}
            >
                {data ? (
                    <Bar
                        redraw={true}
                        updateMode="reset"
                        options={options}
                        data={data}
                    />
                ) : (
                    <span>Not enough step data.</span>
                )}
            </ReactTooltip>
            <div className=" steps-container">
                <div
                    data-tip
                    data-for={`getContent-${clientId}`}
                    className="progress"
                >
                    <CircularProgressbarWithChildren
                        value={percentage}
                        styles={buildStyles({
                            rotation: 0.25,
                            pathColor: '#7FD18C',
                        })}
                    >
                        <div className="children">
                            <h5>{stepsWalkedToday}</h5>
                            <p className="subtitle">walked</p>
                        </div>
                    </CircularProgressbarWithChildren>
                </div>
                <Target
                    isLoading={isLoading}
                    target={target}
                    changeTarget={setTarget}
                    changeValue={500}
                />
            </div>
        </>
    )
}

export default StepsTracker
