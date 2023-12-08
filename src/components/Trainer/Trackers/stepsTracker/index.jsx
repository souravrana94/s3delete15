import React, { useEffect, useState } from 'react'
import './index.scss'
import axios from '../../../../store/axios-secure'
import Loader from '../../../Common/Loader'
import { Bar } from 'react-chartjs-2'
import { format, startOfWeek, endOfWeek } from 'date-fns'
import Select from 'react-select'
import { Icon } from '@iconify/react'

const timeZone = new Date().getTimezoneOffset()

const StepsTracker = ({ clientId }) => {
    const [option, setOption] = useState('weekly')
    const [loading, setLoading] = useState(true)
    const [wholeData, setWholeData] = useState([])
    const [dateText, setDateText] = useState('')
    const [firstIndex, setFirstIndex] = useState(0)
    const [lastIndex, setLastIndex] = useState(0)
    const [data, setData] = useState([])
    const [targets, setTargets] = useState([])
    const [averageWalked, setAverageWalked] = useState(0)
    const [averageTarget, setAverageTarget] = useState(0)
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
    const [edit, setEdit] = useState(false)
    const [streak, setStreak] = useState(0)
    const [efficiency, setEfficiency] = useState(0)
    const daysInMonth = (year, month) => new Date(year, month, 0).getDate()
    const fetchData = async () => {
        try {
            setEdit(false)
            let response = await axios.get('trainers/steps', {
                params: { date: new Date(), clientId: clientId },
            })
            let resData = response.data.steps
            let data = {
                labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            }
            if (resData.length && resData?.length > 1) {
                let lastIndex = resData.length - 2
                let today = new Date(
                    new Date(resData[lastIndex].date).getTime() +
                        timeZone * 60000,
                )
                let firstIndex = lastIndex - today.getDay()
                let noOfDays = today.getDay()
                let graphData = new Array(7).fill(0)
                let targetData = new Array(7).fill(0)
                let totalTarget = 0
                let totalDays = 0
                let totalWalked = 0
                for (
                    let i = firstIndex < 0 ? 0 : firstIndex,
                        j = firstIndex < 0 ? -1 * firstIndex : 0;
                    i <= lastIndex;
                    i++, j++
                ) {
                    graphData[j] = resData[i].stepsWalked ?? 0
                    targetData[j] = resData[i].target ?? 0
                    totalTarget += resData[i].target
                    totalWalked += graphData[j]
                    totalDays++
                }
                if (firstIndex < 0)
                    for (let i = 0; i < -1 * firstIndex; i++) {
                        targetData[i] = null
                    }
                for (let i = 6; i > noOfDays; i--) {
                    if (targetData[i] > 0) {
                        break
                    } else {
                        delete targetData[i]
                    }
                }
                data.datasets = [
                    {
                        label: 'Walked',
                        data: graphData,
                        backgroundColor: '#71deaf',
                        borderColor: 'rgba(87, 121, 234, 0.6)',
                        order: 1,
                    },
                    {
                        label: 'Target',
                        data: targetData,
                        backgroundColor: 'rgba(177, 41, 255, 0.6)',
                        borderColor: 'rgba(177, 41, 255, 0.6)',
                        fill: false,
                        pointHoverRadius: 20,
                        pointHoverBorderWidth: 5,
                        type: 'line',
                        order: 0,
                    },
                ]
                let text = ''
                text += format(startOfWeek(today), 'd MMM')
                text += ' - '
                text += format(endOfWeek(today), 'd MMM')
                let done = 0
                let streak = 0
                let target = 0
                if (resData?.length > 1) {
                    for (let i = resData.length - 2; i >= 0; i--) {
                        if (resData[i].target <= resData[i].stepsWalked) {
                            streak++
                        } else {
                            break
                        }
                    }
                    for (let j = 0; j < resData.length - 1; j++) {
                        done += resData[j].stepsWalked
                        target += resData[j].target
                    }
                }
                if (target > 0) setEfficiency(Math.ceil((done / target) * 100))
                setStreak(streak)
                setData(data)
                let dataTillYestarday = [...resData]
                if (dataTillYestarday?.length) {
                    dataTillYestarday.pop()
                }
                setWholeData([...dataTillYestarday])
                setDateText(text)
                setLastIndex(lastIndex)
                setFirstIndex(firstIndex < 0 ? 0 : firstIndex)
                setAverageWalked(Math.round(totalWalked / totalDays))
                setAverageTarget(Math.round(totalTarget / totalDays))
            }
            await fetchTargets()
            setLoading(false)
        } catch (err) {
            setLoading(false)
            console.log(err)
        }
    }
    const fetchTargets = async () => {
        let response = await axios.get('trainers/targetSteps', {
            params: { clientId: clientId },
        })
        setTargets(response.data.targets)
    }
    const handletoggle = (selectedItem) => {
        try {
            let last = wholeData.length - 1
            let today = new Date(
                new Date(wholeData[last].date).getTime() + timeZone * 60000,
            )
            let noOfDays = today.getDay()
            let first = last - noOfDays
            let length = 7
            let text = ''
            if (selectedItem === 'monthly') {
                noOfDays = today.getDate() - 1
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
        let targetData = new Array(length).fill(0)
        let totalTarget = 0
        let totalDays = 0
        let totalWalked = 0

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
        for (
            let i = first < 0 ? 0 : first, j = first < 0 ? -1 * first : 0;
            i <= last;
            i++, j++
        ) {
            graphData[j] = wholeData[i].stepsWalked ?? 0
            targetData[j] = wholeData[i].target ?? 0
            totalTarget += wholeData[i].target
            totalWalked += graphData[j]
            totalDays++
        }
        if (first < 0)
            for (let i = 0; i < -1 * first; i++) {
                targetData[i] = null
            }
        if (toggle) {
            for (let i = length - 1; i > noOfDays; i--) {
                if (targetData[i] > 0) {
                    break
                } else {
                    delete targetData[i]
                }
            }
        }
        data.datasets = [
            {
                label: 'Walked',
                data: graphData,
                backgroundColor: '#71deaf',
                borderColor: 'rgba(87, 121, 234, 0.6)',
                order: 1,
            },
            {
                label: 'Target',
                data: targetData,
                backgroundColor: 'rgba(177, 41, 255, 0.6)',
                borderColor: 'rgba(177, 41, 255, 0.6)',
                fill: false,
                pointHoverRadius: 20,
                pointHoverBorderWidth: 5,
                type: 'line',
                order: 0,
            },
        ]
        first = Math.max(first, 0)
        setFirstIndex(first)
        setLastIndex(last)
        setData(data)
        setAverageWalked(Math.round(totalWalked / totalDays))
        setAverageTarget(Math.round(totalTarget / totalDays))
    }
    const toggleEdit = () => {
        setEdit(!edit)
    }
    const onValueChange = (idx, value) => {
        let t = [...targets]
        t[idx].target = value ?? 0
        for (let i = idx + 1; i < t.length; i++) {
            if (targets[i].target <= value) t[i].target = value ?? 0
        }
        setTargets([...t])
    }
    const handelKeyDown = (idx, key) => {
        if (key == 'ArrowDown') {
            let t = [...targets]
            t[idx].target =
                targets[idx].target >= 500 ? targets[idx].target - 499 : 0
            setTargets([...t])
        }
        if (key == 'ArrowUp') {
            let t = [...targets]
            t[idx].target = parseInt(targets[idx].target) + 499
            setTargets([...t])
        }
    }
    const saveTargets = async () => {
        setLoading(true)
        let response = await axios.post('trainers/targetSteps', {
            clientId: clientId,
            steps: [...targets],
        })
        await fetchData()
    }
    useEffect(() => {
        fetchData()
    }, [])
    return (
        <div className="steps">
            <div className="stepsHeader">
                <div className="stepsText">Steps</div>
                <div className="streak">
                    {' '}
                    {Array.from(
                        {
                            length:
                                streak && streak % 10 == 0 ? 10 : streak % 10,
                        },
                        (_, i) => (
                            <Icon
                                color={streak > 10 ? 'blue' : '#29ffa3'}
                                icon={'ic:baseline-bolt'}
                                height={25}
                                width={25}
                            />
                        ),
                    )}
                </div>
                {efficiency > 0 && (
                    <div className="efficiency">{efficiency}%</div>
                )}
                <div className="text">Avg Target: {averageTarget}</div>
                <div className="text">Avg Walked: {averageWalked}</div>
            </div>
            {loading ? (
                <Loader />
            ) : (
                <div className="stepsScreen">
                    {wholeData.length ? (
                        <>
                            <div className="selector">
                                <div className="textContainer">
                                    <div className={`col-md-1 back-container`}>
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
                                                icon={'eva:arrow-ios-back-fill'}
                                                height={30}
                                                width={30}
                                            />
                                        </a>
                                    </div>
                                    <div className="dateText">{dateText}</div>
                                    <div className={`col-md-1 back-container`}>
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
                                        onChange={(s) => handletoggle(s.value)}
                                        styles={{
                                            control: (defaultStyles) => ({
                                                ...defaultStyles,
                                                backgroundColor: '#1d2421',
                                                border: 'none',
                                                boxShadow: 'none',
                                            }),
                                            option: (defaultStyles, state) => ({
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
                            </div>
                            <div style={{ height: '250px' }}>
                                <Bar
                                    data={data}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        title: {
                                            display: true,
                                            text: 'Bar + Line Chart',
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
                                                scaleLabel: {
                                                    display: true,
                                                },
                                                stacked: 'true',
                                            },
                                        },
                                    }}
                                />
                            </div>
                        </>
                    ) : (
                        <div>Steps Not Assigned to this User</div>
                    )}
                    <div className="icons-Container">
                        <div className="targetText">Targets</div>
                        {!edit ? (
                            <Icon
                                icon={'clarity:note-edit-line'}
                                height={25}
                                width={25}
                                className="edit-icon"
                                onClick={() => toggleEdit()}
                            />
                        ) : (
                            <Icon
                                icon={'bx:save'}
                                height={25}
                                width={25}
                                className="edit-icon"
                                onClick={() => saveTargets()}
                            />
                        )}
                    </div>
                    <div className="targetsContainer">
                        <div className="targetsHeader">
                            <div className="date">Date</div>
                            <div className="dayText">Day</div>
                            <div className="targetText">Target</div>
                        </div>
                        {targets.map((v, idx) => (
                            <div className="targets" key={idx}>
                                {' '}
                                <div className="date">
                                    {format(
                                        new Date(
                                            new Date(v.date).getTime() +
                                                timeZone * 60000,
                                        ),
                                        'd MMM',
                                    )}
                                </div>
                                <div className="day">
                                    {format(
                                        new Date(
                                            new Date(v.date).getTime() +
                                                timeZone * 60000,
                                        ),
                                        'eee',
                                    )}
                                </div>
                                {edit ? (
                                    <input
                                        type="number"
                                        className="targetInput"
                                        value={v.target != 0 ? v.target : null}
                                        onChange={(evt) =>
                                            onValueChange(
                                                idx,
                                                evt?.target?.value,
                                            )
                                        }
                                        onKeyDown={(e) => {
                                            handelKeyDown(idx, e.key)
                                        }}
                                    />
                                ) : (
                                    <div className="targetSteps">
                                        {v.target}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default StepsTracker
