import React, { useEffect, useState } from 'react'
import axios from '../../../../store/axios-secure'
import ReactTooltip from 'react-tooltip'
import { renderToString } from 'react-dom/server'
import Loader from '../../../Common/Loader'
import CustomModal from '../../../Common/Modal'
import { Icon } from '@iconify/react'
import auth from '../../../../firebase-config'
import './style.scss'
import Button from '../../../Common/Button'
import YouTube, { YouTubeProps } from 'react-youtube'
const AddExercise = React.lazy(() => import('../AddExercise'))

const ViewExercise = () => {
    const clientId = location.pathname.split('/')[2]
    const [searchText, setSearchText] = useState('')
    const [exerciseList, setExerciseList] = useState(null)
    const [loading, setLoading] = useState(false)
    const [noRecord, SetNoRecord] = useState(false)
    const [rowIndex, setRowIndex] = useState(null)
    const [page, setPage] = useState(1)
    const [editId, setEditId] = useState(null)
    const [exerciseName, setExerciseName] = useState('')
    const [pages, setPages] = useState()
    const [totalPages, setTotalPages] = useState()
    const [showAddExerciseModal, setShowAddExerciseModal] = useState(false)
    const [showYoutubeModal, setShowYoutubeModal] = useState(false)
    const [exerciseInfo, setExerciseInfo] = useState()
    const [message, setMessage] = useState({
        error: false,
        success: false,
        msg: '',
    })

    const arrayRange = (start, stop, step) =>
        Array.from(
            { length: (stop - start) / step + 1 },
            (value, index) => start + index * step,
        )
    const fetchExercises = async () => {
        setLoading(true)
        try {
            const response = await axios.get(
                `/admin/exerciseInfos?pageNumber=${page}&limit=25&keyword=${searchText}`,
            )
            setExerciseList(response?.data?.exercises)
            // console.log('response?.data?.exercises', response?.data)
            const totalExercises = response?.data?.totalExercises
            setTotalPages(Math.ceil(totalExercises / 25))

            if (!response?.data?.exercise?.length) {
                SetNoRecord(true)
            }
        } catch (e) {
            console.log('exercise crud fetch error-----', e)
        }
        setLoading(false)
    }
    const editExercise = (exercise) => {
        console.log('edit exercise')
        // setEditId(exercise?._id)
        // setExerciseName(exercise?.name)
        setExerciseInfo(exercise)
        setShowAddExerciseModal(true)
    }
    const deleteExercise = async (exercise) => {
        // setEditId(exercise?._id)
        setLoading(true)
        try {
            const response = await axios.delete(
                `/admin/exerciseInfos/${exercise?._id}`,
            )
            setMessage({
                ...message,
                success: true,
                msg: response?.data?.Message,
            })
            // console.log('delete response ', response?.data?.Message)
            fetchExercises()
        } catch (e) {
            setMessage({ ...message, error: true, msg: 'could not delete' })
            console.log('error ', e)
        }
        setLoading(false)
    }
    useEffect(() => {
        if (message.msg) {
            setTimeout(() => {
                setMessage({ error: false, success: false, msg: '' })
            }, 5000)
        }
    }, [message])
    useEffect(() => {
        fetchExercises()
    }, [])
    useEffect(() => {
        setPage(1)
    }, [searchText, showAddExerciseModal])
    useEffect(() => {
        if (!showAddExerciseModal) {
            fetchExercises()
        }
    }, [page, searchText, showAddExerciseModal])
    useEffect(() => {
        if (totalPages <= 10) {
            let pagesSet = arrayRange(1, totalPages, 1)
            setPages(pagesSet)
        } else {
            let pagesSet = arrayRange(1, 10, 1)
            setPages(pagesSet)
        }
    }, [totalPages])
    useEffect(() => {
        if (totalPages > 10 && page === pages[9] && page + 1 <= totalPages) {
            pages.shift()
            pages.push(page + 1)
        }
        if (totalPages > 10 && page === pages[0] && page - 1 >= 1) {
            pages.pop()
            pages.unshift(page - 1)
        }
    }, [page])

    const getVideoToolTip = (videoURL) => {
        const stringData = renderToString(
            <video
                src={videoURL}
                loop
                className="exercise-video-tooltip"
                autoPlay
            />,
        )
        return stringData
    }
    return (
        <>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                }}
            >
                <div className="heading1">Exercises</div>
                <div
                    style={{
                        backgroundColor: 'black',
                        padding: '10px',
                        width: 'fit-content',
                        borderRadius: '8px',
                    }}
                >
                    <Icon icon="line-md:search" className="searchIcon" />
                    <input
                        placeholder="Search Exercise..."
                        type="search"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{
                            backgroundColor: 'transparent',
                            border: 'none',
                            color: 'white',
                        }}
                    />
                </div>
            </div>
            {message?.error ? (
                <div className="displaymsgError">{message?.msg}</div>
            ) : (
                ''
            )}
            {message?.success ? (
                <div className="displaymsgSuccess">{message?.msg}</div>
            ) : (
                ''
            )}
            <div style={{ paddingTop: '30px' }}>
                {loading ? (
                    <Loader />
                ) : (
                    <>
                        <table>
                            {noRecord && exerciseList?.length === 0 ? null : (
                                <tr>
                                    <th className="column-gif">Gif</th>
                                    <th className="column-exerciseName">
                                        Exercise Name
                                    </th>
                                    <th className="column-layout">Layout</th>
                                    {/* <th className="column-youtubeurl">
                                        Youtube Video
                                    </th> */}
                                </tr>
                            )}
                            {exerciseList?.map((exercise, idx) => {
                                return (
                                    <>
                                        <tr
                                            key={idx}
                                            onMouseOver={() => setRowIndex(idx)}
                                        >
                                            <td
                                                style={{ cursor: 'pointer' }}
                                                data-for={exercise?._id}
                                                data-tip
                                                className="column-gif"
                                            >
                                                <video
                                                    className="exercise-video"
                                                    src={exercise?.gifUrl}
                                                    autoPlay
                                                    loop
                                                />
                                                <ReactTooltip
                                                    place="right"
                                                    className="exercise-video-tooltip-container"
                                                    id={exercise?._id}
                                                    getContent={() =>
                                                        getVideoToolTip(
                                                            exercise?.gifUrl,
                                                        )
                                                    }
                                                    html={true}
                                                />
                                            </td>
                                            <td
                                                className={`column-exerciseName ${
                                                    exercise?.tutorialUrl
                                                        ? 'link'
                                                        : ''
                                                }`}
                                                onClick={() => {
                                                    setShowYoutubeModal(true)
                                                    setExerciseInfo(exercise)
                                                }}
                                            >
                                                {exercise?.name}
                                            </td>
                                            <td className="column-layout">
                                                {exercise?.layout}
                                            </td>

                                            <td
                                                style={{
                                                    display:
                                                        rowIndex === idx &&
                                                        auth.currentUser
                                                            .email ===
                                                            process.env
                                                                .REACT_APP_ADMIN_MAIL
                                                            ? 'flex'
                                                            : 'none',
                                                    flexDirection: 'row',
                                                }}
                                            >
                                                <Icon
                                                    icon="mdi:circle-edit-outline"
                                                    className="editIcon iconSize"
                                                    onClick={() =>
                                                        editExercise(exercise)
                                                    }
                                                />
                                                <Icon
                                                    icon="entypo:circle-with-cross"
                                                    className="crossIcon iconSize"
                                                    onClick={() =>
                                                        deleteExercise(exercise)
                                                    }
                                                />
                                            </td>
                                        </tr>
                                    </>
                                )
                            })}
                        </table>
                        {noRecord && exerciseList?.length === 0 ? null : (
                            <div className="pagination">
                                <div
                                    className="inactivePage"
                                    onClick={() =>
                                        setPage((prev) => {
                                            if (pages.includes(prev - 1)) {
                                                return prev - 1
                                            } else {
                                                return prev
                                            }
                                        })
                                    }
                                >
                                    &laquo;
                                </div>
                                {pages?.map((item, idx) => {
                                    return (
                                        <div
                                            className={
                                                item === page
                                                    ? 'inactivePage activePage'
                                                    : 'inactivePage'
                                            }
                                            onClick={() => setPage(item)}
                                        >
                                            {item}
                                        </div>
                                    )
                                })}

                                <div
                                    className="inactivePage"
                                    onClick={() =>
                                        setPage((prev) => {
                                            if (pages.includes(prev + 1)) {
                                                return prev + 1
                                            } else {
                                                return prev
                                            }
                                        })
                                    }
                                >
                                    &raquo;
                                </div>
                            </div>
                        )}
                    </>
                )}
                {noRecord && exerciseList?.length === 0 ? (
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}
                    >
                        <div>No Record Found</div>
                        <Button
                            type="submit"
                            text="+ Add Exercise"
                            classNames="addButton"
                            color="green"
                            onClick={() => {
                                setShowAddExerciseModal(true)
                                setExerciseInfo(null)
                            }}
                        />
                    </div>
                ) : null}
            </div>
            <CustomModal
                title={exerciseInfo ? 'Edit Exercise' : 'Add Exercise'}
                show={showAddExerciseModal}
                onHide={() => setShowAddExerciseModal(false)}
                width="medium"
                dark={true}
            >
                <AddExercise
                    name={exerciseInfo?.name ? exerciseInfo?.name : searchText}
                    exerciseInfo={exerciseInfo}
                />
            </CustomModal>
            <CustomModal
                title={exerciseInfo?.name}
                show={showYoutubeModal}
                onHide={() => setShowYoutubeModal(false)}
                width="large"
                dark={true}
            >
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <YouTube videoId={exerciseInfo?.tutorialUrl} />
                </div>
            </CustomModal>
        </>
    )
}
export default ViewExercise
