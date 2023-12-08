import React from 'react'
import axios from '../../../../store/axios-secure'
import { useEffect } from 'react'
import { useState } from 'react'
import moment from 'moment'
import { Image } from 'react-bootstrap'
import CustomModal from '../../../Common/Modal'
import './index.scss'
import Loader from '../../../Common/Loader'
import {
    CircularProgressbarWithChildren,
    buildStyles,
} from 'react-circular-progressbar'
import { Icon } from '@iconify/react'

const ProgramStatistics = ({ clientId }) => {
    const imageWidth = '110px'
    const imageHeight = '130px'
    const numberofRows = 3
    const [showImageModal, setShowImageModal] = useState(false)
    const [imgURL, setImgURL] = useState('')
    const [sliceIndex, setSliceIndex] = useState(numberofRows)
    const [programStatsData, setProgramStatsData] = useState({})
    const [sortOrder, setSortOrder] = useState(-1)
    const [loading, setLoading] = useState(false)
    const [code, setCode] = useState({})

    const fetchData = async () => {
        setLoading(true)
        try {
            const response = await axios.get(
                `/trainers/userProgramStats?clientId=${clientId}`,
            )
            if (response.data.data) setProgramStatsData(response?.data.data)
            setCode(response?.data)
        } catch (error) {
            console.log('Error in program stats ', error)
        }
        setLoading(false)
    }

    // const [paused, setPaused] = useState(isPaused)
    const noOfDays = (date_1, date_2) => {
        date_1 = new Date(date_1)
        date_2 = new Date(date_2)
        let difference = date_1.getTime() - date_2.getTime()
        let TotalDays = Math.ceil(difference / (1000 * 3600 * 24))
        return TotalDays
    }
    const daysCompleted =
        noOfDays(new Date(), programStatsData.startDate) -
        programStatsData.pausedDays
    let daysTotal = noOfDays(
        programStatsData.endDate,
        programStatsData.startDate,
    )
    daysTotal -= programStatsData.pausedDays

    // const updatePlan = async () => {
    //     try {
    //         const action = programStatsData.paused ? 'Resume' : 'Pause'
    //         setPaused(!paused)
    //         const res = await axios.put(
    //             `trainers/plan?clientId=${clientId}&action=${action}`,
    //         )
    //         setButtonClicked(true)
    //         setRefresh(!refresh)
    //         console.log(refresh)
    //     } catch (err) {
    //         console.log(err)
    //     }
    // }

    let percentage =
        daysCompleted && daysTotal
            ? parseInt((daysCompleted / daysTotal) * 100 ?? 0)
            : 0

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <div className="weightsTransformation">
            <div className="weightsHeader">
                <div className="weightText">Program Statistics</div>
            </div>
            {loading ? (
                <Loader />
            ) : (
                <div className="programStats">
                    {code.code == 1 ? (
                        <>
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
                                        {programStatsData.paused ? (
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
                            </div>
                            <div>
                                <div className="card1">
                                    <div>Start Date</div>
                                    <div>
                                        {new Date(
                                            programStatsData.startDate,
                                        ).toLocaleDateString()}
                                    </div>
                                </div>
                                <div className="card1">
                                    <div>End Date</div>
                                    <div>
                                        {new Date(
                                            programStatsData.endDate,
                                        ).toLocaleDateString()}
                                    </div>
                                </div>
                                <div className="card1">
                                    <div>No. of days since joined</div>
                                    <div>{programStatsData?.joinedSince}</div>
                                </div>
                                <div className="card1">
                                    <div>Workouts completed in last 7 day</div>
                                    <div>
                                        {programStatsData?.last7days ?? 0}
                                    </div>
                                </div>
                                <div className="card1">
                                    <div>
                                        Workouts completed in last 30 days
                                    </div>
                                    <div>
                                        {programStatsData?.last30Days ?? 0}
                                    </div>
                                </div>
                                <div className="card1">
                                    <div>
                                        Workouts completed during the program
                                    </div>
                                    <div>
                                        {programStatsData?.programLifeTime ?? 0}
                                    </div>
                                </div>
                                <div className="card1">
                                    <div>Total workouts done</div>
                                    <div>
                                        {programStatsData?.totalDays ?? 0}
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div>
                            {'This user does not have any active program'}
                        </div>
                    )}
                </div>
            )}
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

export default ProgramStatistics
