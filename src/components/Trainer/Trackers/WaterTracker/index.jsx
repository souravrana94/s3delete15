import React, { useEffect, useState } from 'react'
import './index.scss'
import axios from '../../../../store/axios-secure'
import Loader from '../../../Common/Loader'
import { Icon } from '@iconify/react'
import moment from 'moment'
import { Bar } from 'react-chartjs-2'
import { format, startOfWeek, endOfWeek } from 'date-fns'
import Select from 'react-select'
const timeZone = new Date().getTimezoneOffset()
const WaterTracker = ({ clientId }) => {
    const [updateTarget, setUpdateTarget] = useState()
    const [editTarget, setEditTarget] = useState(false)
    const [loading, setLoading] = useState(false)
    const [loadingTarget, setLoadingTarget] = useState(false)
    const [wholeData, setWholeData] = useState([])
    // const [weight, setWeight] = useState(0)
    const [dateText, setDateText] = useState('')
    const [firstIndex, setFirstIndex] = useState(0)
    const [lastIndex, setLastIndex] = useState(0)
    const [targets, setTargets] = useState([])
    const [data, setData] = useState([])
    const [max, setMax] = useState(0)
    const [min, setMin] = useState(0)
    const [delta, setDelta] = useState('')
    const [option, setOption] = useState('weekly')
    const [lables, setLables] = useState([
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        '11',
        '12',
        '13',
        '14',
        '15',
        '16',
        '17',
        '18',
        '19',
        '20',
        '21',
        '22',
        '23',
        '24',
        '25',
        '26',
        '27',
        '28',
        '29',
        '30',
        '31',
    ])
    const daysInMonth = (year, month) => new Date(year, month, 0).getDate()

    const updateWaterTarget = async () => {
        setEditTarget(false)
        setLoadingTarget(true)
        try {
            const response = await axios.post(`/trainers/waterTarget`, {
                target: updateTarget,
                clientId: clientId,
            })
            fetchWaterIntake()
            console.log('Water target set res', response?.data)
        } catch (e) {
            console.log('water api post error ', e)
        }
        setLoadingTarget(false)
    }

    const fetchWaterIntake = async () => {
        setLoading(true)
        try {
            const response = await axios.get(
                `/trainers/waterIntakes?clientId=${clientId}`,
            )

            setUpdateTarget(response?.data?.dailyTarget)
            let water = response?.data?.data
            let length = water?.length
            let data = {
                labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            }
            if (length) {
                let delta = ''
                let lastIndex = length - 1
                // setWeight(water[length - 1].quantity)
                let today = new Date(
                    new Date(water[lastIndex].date).getTime() +
                        timeZone * 60000,
                )
                let noOfDays = today.getDay()
                let firstIndex = lastIndex - today.getDay()
                let graphData = new Array(7).fill(0)
                let graphDataTarget = new Array(7).fill(0)
                let max = 0
                let min = 150
                for (
                    let i = firstIndex < 0 ? 0 : firstIndex,
                        j = firstIndex < 0 ? -1 * firstIndex : 0;
                    i <= lastIndex;
                    i++, j++
                ) {
                    graphData[j] = water[i].quantity ?? 0
                    graphDataTarget[j] = water[i].target ?? 0
                    max = Math.max(max, graphData[j])
                    max = Math.max(max, graphDataTarget[j])
                    min = Math.min(min, water[i].quantity)
                }
                if (firstIndex < 0)
                    for (let i = 0; i < -1 * firstIndex; i++) {
                        graphData[i] = null
                        graphDataTarget[i] = null
                    }
                for (let i = 6; i > noOfDays; i--) {
                    if (graphData[i] > 0) {
                        break
                    } else {
                        delete graphData[i]
                        delete graphDataTarget[i]
                    }
                }
                if (length == 1) {
                    delta += `${water[0].quantity}` + ' +' + ' 0 Kg'
                } else {
                    let w1 = water[length - 1].quantity * 100
                    let w2 = water[0].quantity * 100
                    let diff = Math.round(w1 - w2)
                    diff = diff / 100
                    if (diff >= 0) {
                        delta += `${water[0].quantity}` + ' +' + ` ${diff} Kg`
                    } else {
                        delta +=
                            `${water[0].quantity}` + ' -' + ` ${-1 * diff} Kg`
                    }
                }
                data.datasets = [
                    {
                        label: 'Target',
                        data: graphDataTarget,
                        backgroundColor: 'rgba(177, 41, 255, 0.6)',
                        borderColor: 'rgba(177, 41, 255, 0.6)',
                        fill: false,
                        pointHoverRadius: 10,
                        pointHoverBorderWidth: 5,
                        type: 'line',
                        order: 0,
                    },
                    {
                        label: 'Water',
                        data: graphData,
                        backgroundColor: '#71deaf',
                        borderColor: '#71deaf',
                        fill: false,
                        pointHoverRadius: 10,
                        pointHoverBorderWidth: 5,
                        type: 'line',
                        order: 0,
                    },
                ]
                let text = ''
                text += format(startOfWeek(today), 'd MMM')
                text += ' - '
                text += format(endOfWeek(today), 'd MMM')
                setMax(Math.ceil(max) + 1)
                setMin(Math.floor(min) - 1)
                setDelta(delta)
                setData(data)
                setWholeData([...water])
                setDateText(text)
                setLastIndex(lastIndex)
                setFirstIndex(firstIndex < 0 ? 0 : firstIndex)
            }
        } catch (error) {
            console.log(error)
        }
        setLoading(false)
    }
    const handletoggle = (selectedItem) => {
        try {
            let last = wholeData.length - 1
            let today = new Date(
                new Date(wholeData[last].date).getTime() + timeZone * 60000,
            )
            let noOfDays = today.getDay()
            let first = last - today.getDay()
            let length = 7
            let text = ''
            if (selectedItem == 'monthly') {
                first = last - today.getDate() + 1
                length = daysInMonth(today.getFullYear(), today.getMonth() + 1)
                text = format(
                    new Date(
                        new Date(wholeData[last].date).getTime() +
                            timeZone * 60000,
                    ),
                    'MMM yyyy',
                )
            }
            setDateText(text)
            setFirstIndex(first)
            setLastIndex(last)
            if (selectedItem === 'weekly') {
                let text = ''
                text += format(startOfWeek(today), 'd MMM')
                text += ' - '
                text += format(endOfWeek(today), 'd MMM')
                setDateText(text)
                setOption('weekly')
            } else {
                setOption('monthly')
            }
            setGraphData({
                length: length,
                first: first,
                last: last,
                option: selectedItem,
                toggle: true,
            })
        } catch (err) {
            console.log(err)
        }
    }

    const handleBack = async () => {
        if (firstIndex) {
            let length = 7
            let today = new Date(
                new Date(wholeData[lastIndex].date).getTime() +
                    timeZone * 60000,
            )
            let first = 0
            let last = 0
            if (option === 'weekly') {
                first = firstIndex - 7
                last = lastIndex - today.getDay() - 1
                let thisWeek = new Date(
                    new Date(wholeData[last].date).getTime() + timeZone * 60000,
                )
                let text = ''
                text += format(startOfWeek(thisWeek), 'd MMM')
                text += ' - '
                text += format(endOfWeek(thisWeek), 'd MMM')
                setDateText(text)
            } else {
                let lastDays = daysInMonth(
                    today.getMonth() == 0
                        ? today.getFullYear() - 1
                        : today.getFullYear(),
                    today.getMonth() == 0 ? 12 : today.getMonth(),
                )
                last = lastIndex - today.getDate()
                first = firstIndex - lastDays
                let text = format(
                    new Date(
                        new Date(wholeData[last].date).getTime() +
                            timeZone * 60000,
                    ),
                    'MMM yyyy',
                )
                setDateText(text)
                length = lastDays
            }
            setGraphData({
                length: length,
                first: first,
                last: last,
                option: option,
            })
        }
    }

    const handleForward = async () => {
        if (lastIndex < wholeData.length - 1) {
            let length = 7
            let today = new Date(
                new Date(wholeData[lastIndex].date).getTime() +
                    timeZone * 60000,
            )
            let first = 0
            let last = 0
            if (option == 'weekly') {
                last = lastIndex + 7
                first = last - 6

                let thisWeek = new Date(
                    new Date(wholeData[first].date).getTime() +
                        timeZone * 60000,
                )
                let text = ''
                text += format(startOfWeek(thisWeek), 'd MMM')
                text += ' - '
                text += format(endOfWeek(thisWeek), 'd MMM')
                setDateText(text)
            } else {
                let nextDays = daysInMonth(
                    today.getMonth() == 11
                        ? today.getFullYear() + 1
                        : today.getFullYear(),
                    today.getMonth() == 11 ? 1 : today.getMonth() + 2,
                )
                last = lastIndex + nextDays
                first = lastIndex + 1
                let text = format(
                    new Date(
                        new Date(wholeData[first].date).getTime() +
                            timeZone * 60000,
                    ),
                    'MMM yyyy',
                )
                setDateText(text)
                length = nextDays
            }
            setGraphData({
                length: length,
                first: first,
                last: last,
                option: option,
                toggle: true,
            })
        }
    }

    const setGraphData = ({ length, first, last, option, toggle = false }) => {
        last = Math.min(last, wholeData.length - 1)
        let graphData = new Array(length).fill(0)
        let graphDataTarget = new Array(length).fill(0)

        let today = new Date(
            new Date(wholeData[last].date).getTime() + timeZone * 60000,
        )
        let noOfDays = today.getDay()
        let data = {
            labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        }
        if (option == 'monthly') {
            let newLables = [...lables]
            data.labels = [...newLables.splice(0, length)]
        }
        let max = 0
        let min = 150
        for (
            let i = first < 0 ? 0 : first, j = first < 0 ? -1 * first : 0;
            i <= last;
            i++, j++
        ) {
            graphData[j] = wholeData[i].quantity ?? 0
            graphDataTarget[j] = wholeData[i].target ?? 0
            max = Math.max(max, graphData[j])
            max = Math.max(max, graphDataTarget[j])
            min = Math.min(min, wholeData[i].quantity)
        }
        if (first < 0)
            for (let i = 0; i < -1 * first; i++) {
                graphData[i] = null
                graphDataTarget[i] = null
            }
        if (toggle) {
            for (let i = length - 1; i > noOfDays; i--) {
                if (graphData[i] > 0) {
                    break
                } else {
                    delete graphData[i]
                    delete graphDataTarget[i]
                }
            }
        }
        for (let i = 6; i > noOfDays; i--) {
            if (graphData[i] > 0) {
                break
            } else {
                delete graphData[i]
                delete graphDataTarget[i]
            }
        }
        data.datasets = [
            {
                label: 'Target',
                data: graphDataTarget,
                backgroundColor: 'rgba(177, 41, 255, 0.6)',
                borderColor: 'rgba(177, 41, 255, 0.6)',
                fill: false,
                pointHoverRadius: 10,
                pointHoverBorderWidth: 5,
                type: 'line',
                order: 0,
            },
            {
                label: 'Water',
                data: graphData,
                backgroundColor: 'rgba(113, 222, 175, 0.6)',
                borderColor: 'rgba(113, 222, 175, 1)',
                fill: false,
                pointHoverRadius: 20,
                pointHoverBorderWidth: 5,
                type: 'line',
                order: 0,
            },
        ]
        first = Math.max(first, 0)
        setMax(Math.ceil(max) + 1)
        setMin(Math.floor(min) - 1)
        setFirstIndex(first)
        setLastIndex(last)
        setData(data)
    }

    useEffect(() => {
        fetchWaterIntake()
    }, [])
    return (
        <div className="weights">
            <div className="waterHeader">Water Tracking </div>
            <div className="targetContainer">
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <div style={{ paddingRight: '8px' }}>Target: </div>
                    {editTarget ? (
                        <input
                            value={updateTarget}
                            onChange={(e) => setUpdateTarget(e.target.value)}
                        />
                    ) : loadingTarget ? (
                        <Loader />
                    ) : (
                        <div>{updateTarget} litres</div>
                    )}
                </div>
                {!editTarget ? (
                    <Icon
                        icon={'clarity:note-edit-line'}
                        height={25}
                        width={25}
                        className="edit-icon"
                        onClick={() => setEditTarget(true)}
                    />
                ) : (
                    <Icon
                        icon={'bx:save'}
                        height={25}
                        width={25}
                        className="edit-icon"
                        onClick={updateWaterTarget}
                    />
                )}
            </div>
            <div
            // className="weights"
            >
                {loading ? (
                    <Loader />
                ) : (
                    <div className="weightScreen">
                        {wholeData.length ? (
                            <>
                                <div className="selector">
                                    <div className="textContainer">
                                        <div
                                            className={`col-md-1 back-container`}
                                        >
                                            <a
                                                onClick={() => {
                                                    handleBack()
                                                }}
                                            >
                                                <Icon
                                                    color={
                                                        firstIndex == 0
                                                            ? 'grey'
                                                            : 'white'
                                                    }
                                                    icon={
                                                        'eva:arrow-ios-back-fill'
                                                    }
                                                    height={30}
                                                    width={30}
                                                />
                                            </a>
                                        </div>
                                        <div className="dateText">
                                            {dateText}
                                        </div>
                                        <div
                                            className={`col-md-1 back-container`}
                                        >
                                            <a
                                                onClick={() => {
                                                    handleForward()
                                                }}
                                            >
                                                <Icon
                                                    color={
                                                        lastIndex ==
                                                        wholeData.length - 1
                                                            ? 'grey'
                                                            : 'white'
                                                    }
                                                    icon={
                                                        'eva:arrow-ios-forward-fill'
                                                    }
                                                    height={30}
                                                    width={30}
                                                />
                                            </a>
                                        </div>
                                    </div>
                                    <div className="dropDown">
                                        <Select
                                            defaultValue={'weekly'}
                                            placeholder={'Weekly'}
                                            options={[
                                                {
                                                    value: 'weekly',
                                                    label: 'Weekly',
                                                },
                                                {
                                                    value: 'monthly',
                                                    label: 'Monthly',
                                                },
                                            ]}
                                            onChange={(s) =>
                                                handletoggle(s.value)
                                            }
                                            styles={{
                                                control: (defaultStyles) => ({
                                                    ...defaultStyles,
                                                    backgroundColor: '#1d2421',
                                                    border: 'none',
                                                    boxShadow: 'none',
                                                }),
                                                option: (
                                                    defaultStyles,
                                                    state,
                                                ) => ({
                                                    ...defaultStyles,
                                                    color: state.isSelected
                                                        ? '#212529'
                                                        : '#fff',
                                                    backgroundColor:
                                                        state.isSelected
                                                            ? '#a0a0a0'
                                                            : '#212529',
                                                    border: 'none',
                                                }),
                                                singleValue: (
                                                    defaultStyles,
                                                ) => ({
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
                                </div>
                                <div style={{ height: '250px' }}>
                                    <Bar
                                        data={data}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            title: {
                                                display: true,
                                                text: 'Line Chart',
                                                fontSize: 25,
                                            },
                                            scales: {
                                                x: {
                                                    scaleLabel: {
                                                        display: true,
                                                    },
                                                    stacked: 'true',
                                                },

                                                y: {
                                                    // scaleLabel: {
                                                    //     display: true,
                                                    // },
                                                    // stacked: 'true',
                                                    ticks: {
                                                        stepSize: 1,
                                                        beginAtZero: false,
                                                    },
                                                    max: max,
                                                    min: 0,
                                                },
                                            },
                                        }}
                                    />
                                </div>
                            </>
                        ) : (
                            <div>No data for this user</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
export default WaterTracker
