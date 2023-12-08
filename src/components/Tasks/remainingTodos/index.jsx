import React, { useState, useEffect } from 'react'
import { addDays } from 'date-fns'
import './index.scss'
import Loader from '../../Common/Loader'
import { Icon } from '@iconify/react'
import Button from '../../Common/Button'
import Todos from '../todos'
import axios from '../../../store/axios-secure'
import InternalServerErrorPage from '../../Common/ErrorPage/InternalServerErrorPage'

const RemainingTodos = ({ clientId }) => {
    // const data = [
    //     {
    //         date: '2023-06-06T10:00:00.000Z',
    //         isCompleted: false,
    //         userRef: '1234354fr444444',
    //         lists: [
    //             {
    //                 category: 'Training',
    //                 items: [
    //                     { item: 'Finish Workout', isChecked: false },
    //                     { item: 'Move fast', isChecked: false },
    //                 ],
    //             },
    //             {
    //                 category: 'Movement',
    //                 items: [
    //                     { item: 'Finish Steps', isChecked: false },
    //                     { item: 'Jog for 5mins', isChecked: false },
    //                 ],
    //             },
    //             {
    //                 category: 'LifeStyle',
    //                 items: [
    //                     { item: 'Add Weight', isChecked: false },
    //                     { item: 'Drink water ', isChecked: false },
    //                 ],
    //             },
    //             {
    //                 category: 'Miscellaneous',
    //                 items: [],
    //             },
    //         ],
    //     },
    //     {
    //         date: '2023-06-07T10:00:00.000Z',
    //         isCompleted: false,
    //         userRef: '1234354fr444444',
    //         lists: [
    //             {
    //                 category: 'Training',
    //                 items: [
    //                     { item: 'Finish Workout', isChecked: false },
    //                     { item: 'Move fast', isChecked: false },
    //                 ],
    //             },
    //             {
    //                 category: 'Movement',
    //                 items: [
    //                     { item: 'Finish Steps', isChecked: false },
    //                     { item: 'Jog for 5mins', isChecked: false },
    //                 ],
    //             },
    //             {
    //                 category: 'LifeStyle',
    //                 items: [
    //                     { item: 'Add Weight', isChecked: false },
    //                     { item: 'Drink 5 liters of water ', isChecked: false },
    //                 ],
    //             },
    //             {
    //                 category: 'Miscellaneous',
    //                 items: [{ item: 'Buy dumbells ', isChecked: false }],
    //             },
    //         ],
    //     },
    //     {
    //         date: '2023-06-08T10:00:00.000Z',
    //         isCompleted: false,
    //         userRef: '1234354fr444444',
    //         lists: [
    //             {
    //                 category: 'Training',
    //                 items: [
    //                     { item: 'Finish Workout', isChecked: false },
    //                     { item: 'Move fast', isChecked: false },
    //                 ],
    //             },
    //             {
    //                 category: 'Movement',
    //                 items: [
    //                     { item: 'Jog for 10mins', isChecked: false },
    //                     { item: 'Finish Steps', isChecked: false },
    //                     { item: 'Jog for 5mins', isChecked: false },
    //                 ],
    //             },
    //             {
    //                 category: 'LifeStyle',
    //                 items: [
    //                     { item: 'Add Weight', isChecked: false },
    //                     { item: 'Move ', isChecked: false },
    //                 ],
    //             },
    //             {
    //                 category: 'Miscellaneous',
    //                 items: [
    //                     { item: 'Buy Yoga mat ', isChecked: false },
    //                     { item: 'Order something ', isChecked: false },
    //                 ],
    //             },
    //         ],
    //     },
    // ]
    const [cycle, setCycle] = useState(null)
    const [activeCycleLoading, setActiveCycleLoading] = useState(false)
    const [show, setShow] = useState(false)
    const [todos, setTodos] = useState([])
    const [data, setData] = useState([data])
    const [loading, setLoading] = useState(true)
    const [clickIndex, setClickIndex] = useState(-1)
    const [showEditModal, setShowEditModal] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [isError, setIsError] = useState(false)
    const [serverError, setServerError] = useState(false)
    const [message, setMessage] = useState('')
    const [editingTodo, setEditingTodo] = useState({})
    const [disacardChanges, setDiscardChanges] = useState({})
    const [excludeDates, setExcludeDates] = useState({})
    const fetchData = async () => {
        try {
            const response = await axios.get('trainers/remainingTasks', {
                params: {
                    clientId: clientId,
                },
            })
            let dates = []
            for (let i = 0; i < response.data.length; i++) {
                dates.push(new Date(response.data[i].date))
            }
            setExcludeDates(dates)
            setTodos(response.data)
            setData([...response.data])
        } catch (err) {
            setServerError(true)
        }
        setLoading(false)
    }
    // console.log('Todos', todos)
    const addTodo = () => {
        let date = new Date()
        if (todos?.length) {
            for (let i = 0; i < todos.length; i++) {
                date = Math.max(new Date(todos[i].date), date)
            }
            date = addDays(date, 1)
        }
        let todo = {
            date: date,
            isCompleted: false,
            userRef: clientId,
            lists: [
                {
                    category: 'Training',
                    items: [{ item: 'Finish Workout', isChecked: false }],
                },
                {
                    category: 'Movement',
                    items: [{ item: 'Finish Steps', isChecked: false }],
                },
                {
                    category: 'Lifestyle',
                    items: [{ item: 'Add Weight', isChecked: false }],
                },
                {
                    category: 'Miscellaneous',
                    items: [],
                },
            ],
        }
        setShowEditModal(true)
        setClickIndex(todos.length)
        setEditingTodo({ ...todo })
        setIsSuccess(true)
        setMessage('Task Added SuccessFully')
    }
    useEffect(() => {
        if (isError) {
            setTimeout(() => {
                setIsError(false)
            }, 5000)
        }
        if (isSuccess) {
            setTimeout(() => {
                setIsSuccess(false)
            }, 5000)
        }
    }, [isError, isSuccess])

    useEffect(() => {
        fetchData()
    }, [showEditModal])
    return (
        <>
            {serverError ? (
                <InternalServerErrorPage />
            ) : (
                <div className="remaining-container">
                    <div className="remaining-top">
                        <div className="remaining-title">Remaining Tasks</div>
                        <div
                            className="open-cycle"
                            onClick={() => {
                                setShow(true)
                            }}
                        >
                            {activeCycleLoading ? (
                                <Loader />
                            ) : !cycle ? (
                                <div>{'Please Select a Cycle'}</div>
                            ) : (
                                <>
                                    <Icon
                                        icon={'fa6-solid:repeat'}
                                        height={25}
                                        width={25}
                                    />
                                    <div className={`cycle-breif`}>
                                        {/* <div>
                                {getNumDaysPerWeek(cycle?.cycleRoutines)}{' '}
                                day per week
                            </div>{' '} */}
                                        <div>Cycle : {cycle?.name}</div>
                                    </div>
                                </>
                            )}
                            <Icon
                                icon={'clarity:note-edit-line'}
                                height={25}
                                width={25}
                                className="edit-icon"
                            />
                        </div>
                        <div className="d-flex flex-direction-row">
                            <Button
                                disabled={false}
                                type="button"
                                classNames="add-session-btn"
                                text={'+ Add'}
                                onClick={() => {
                                    addTodo()
                                }}
                            />
                            {cycle && (
                                <Button
                                    disabled={false}
                                    type="button"
                                    classNames="add-session-btn add-cycle-session-btn"
                                    text={'+ Cycle'}
                                    onClick={() => {
                                        console.log('all tasks added')
                                    }}
                                />
                            )}
                        </div>
                    </div>
                    {isError ? (
                        <small className="message error">{message}</small>
                    ) : isSuccess ? (
                        <small className="message success">{message}</small>
                    ) : (
                        <></>
                    )}
                    {loading ? (
                        <Loader />
                    ) : (
                        <Todos
                            todos={todos}
                            setTodos={(todos) => setTodos(todos)}
                            setClickIndex={(i) => setClickIndex(i)}
                            clickIndex={clickIndex}
                            showEditModal={showEditModal}
                            setShowEditModal={(b) => {
                                setShowEditModal(b)
                            }}
                            data={data}
                            setMessage={(m) => setMessage(m)}
                            setIsError={(e) => setIsError(e)}
                            setIsSuccess={(s) => setIsSuccess(s)}
                            editingTodo={editingTodo}
                            setEditingTodo={(s) => setEditingTodo(s)}
                            setDiscardChanges={(s) => setDiscardChanges(s)}
                            excludeDates={excludeDates}
                        />
                    )}
                </div>
            )}
        </>
    )
}

export default RemainingTodos
