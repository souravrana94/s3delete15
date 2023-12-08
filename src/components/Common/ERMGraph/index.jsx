import React, { useState } from 'react'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import Select from 'react-select'
import moment from 'moment/moment'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
)

const ERMGraph = ({ ermData, timeperiod, setTimeperiod }) => {
    let dataPoints
    let labelPoint
    let loadRepsData

    function formatDate(inputDate) {
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

        const [year, month] = inputDate.split('-').map(Number)
        const formattedDate = `${months[month - 1]} ${year}`

        return formattedDate
    }

    if (timeperiod === 'monthly') {
        dataPoints =
            ermData?.type === 'E1rm'
                ? ermData?.e1rmMonthlyData?.dateE1rm?.map(
                      (ele) => ele.e1rmValue,
                  )
                : ermData?.e1rmMonthlyData?.dateE1rm?.map((ele) => ele.maxReps)
        ;(labelPoint = ermData?.e1rmMonthlyData?.dateE1rm?.map((ele) =>
            moment(ele.date).format('l'),
        )),
            (loadRepsData = ermData?.e1rmMonthlyData?.dateE1rm?.map(
                (ele) => ele.performedWeight + ' * ' + ele.performedReps,
            ))
    } else if (timeperiod === 'yearly') {
        if (ermData?.type === 'E1rm') {
            dataPoints = ermData?.yearlyDataMaxE1RM?.map((ele) => ele.maxE1rm)
            labelPoint = ermData?.yearlyDataMaxE1RM?.map((ele) =>
                formatDate(ele.yearMonth),
            )
            loadRepsData = ermData?.yearlyDataMaxE1RM?.map(
                (ele) => ele.performedWeight + ' * ' + ele.performedReps,
            )
        } else {
            dataPoints = ermData?.yearlyDataMaxReps?.map((ele) => ele.maxReps)
            ;(labelPoint = ermData?.yearlyDataMaxReps?.map((ele) =>
                formatDate(ele.yearMonth),
            )),
                (loadRepsData = ermData?.yearlyDataMaxReps?.map(
                    (ele) => ele.performedWeight + ' * ' + ele.performedReps,
                ))
        }
    } else if (timeperiod === 'last7workouts') {
        dataPoints =
            ermData?.type === 'E1rm'
                ? ermData?.e1rmData?.dateE1rm?.map((ele) => ele.e1rmValue)
                : ermData?.e1rmData?.dateE1rm?.map((ele) => ele.maxReps)
        labelPoint = ermData?.e1rmData?.dateE1rm?.map((ele) =>
            moment(ele.date).format('l'),
        )
        loadRepsData = ermData?.e1rmData?.dateE1rm?.map(
            (ele) => ele.performedWeight + ' * ' + ele.performedReps,
        )
        dataPoints = dataPoints?.reverse()?.slice(0, 7)?.reverse()
        labelPoint = labelPoint?.reverse()?.slice(0, 7)?.reverse()
        loadRepsData = loadRepsData?.reverse()?.slice(0, 7)?.reverse()
    }
    const loadReps = (tooltipItems) => {
        return (
            'Load * Reps: ' +
            tooltipItems[0]?.dataset?.loadRepsData[tooltipItems[0].dataIndex]
        )
    }

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            // title: {
            //     display: true,
            //     text: 'Chart.js Line Chart',
            // },

            tooltip: {
                callbacks: {
                    footer: loadReps,
                },
            },
        },
    }
    const data = {
        labels: labelPoint,
        datasets: [
            {
                label: ermData?.type,
                data: dataPoints,
                borderColor: '#36f5c7',
                backgroundColor: '#36f5c7',
                loadRepsData: loadRepsData,
            },
        ],
    }
    return (
        <div>
            <div className="dropDown" style={{ padding: '10px 10px 0' }}>
                <Select
                    defaultValue={'monthly'}
                    placeholder={'Monthly'}
                    options={[
                        {
                            value: 'monthly',
                            label: 'Monthly',
                        },
                        {
                            value: 'yearly',
                            label: 'Yearly',
                        },
                        {
                            value: 'last7workouts',
                            label: 'Last 7 Workouts',
                        },
                    ]}
                    onChange={(s) => setTimeperiod(s?.value)}
                    styles={{
                        control: (defaultStyles) => ({
                            ...defaultStyles,
                            backgroundColor: '#1d2421',
                            border: 'none',
                            boxShadow: 'none',
                        }),
                        option: (defaultStyles, state) => ({
                            ...defaultStyles,
                            color: state.isSelected ? '#212529' : '#fff',
                            backgroundColor: state.isSelected
                                ? '#a0a0a0'
                                : '#212529',
                            border: 'none',
                        }),
                        singleValue: (defaultStyles) => ({
                            ...defaultStyles,
                            color: '#fff',
                        }),
                        menu: (defaultStyles) => ({
                            ...defaultStyles,
                            border: 'none',
                            boxShadow: 'none',
                            backgroundColor: '#000000',
                        }),
                    }}
                />
            </div>
            <Line options={options} data={data} />
        </div>
    )
}
export default ERMGraph
