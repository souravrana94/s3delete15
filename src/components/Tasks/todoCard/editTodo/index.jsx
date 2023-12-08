import React, { useState, useEffect } from 'react'
import Button from '../../../Common/Button'
import './index.scss'
import { Icon } from '@iconify/react'
import EditRow from './editRow'
import axios from '../../../../store/axios-secure'
import Loader from '../../../Common/Loader'
import DatePicker from 'react-datepicker'

const EditTodo = ({
    data,
    todos,
    index,
    setTodos,
    setShow,
    setMessage,
    setIsError,
    setIsSuccess,
    excludeDates,
}) => {
    const [todo, setTodo] = useState({ ...data })
    const [loading, setLoading] = useState(false)
    const [startDate, setStartDate] = useState(new Date(data?.date))
    const [dateString, setDateString] = useState('')
    const date = startDate
        ? new Date(data?.date).toISOString().split('T')
        : null
    let dates = excludeDates.filter(
        (e) => new Date(e).getTime() != new Date(data.date).getTime(),
    )
    // console.log(dates)
    // console.log(data.date)
    // console.log(excludeDates[0])
    let dateString1 = ''
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
    const first = () => {
        if (date) {
            const dateArray = date[0].split('-')
            dateString1 =
                dateArray[2] +
                ' ' +
                months[parseInt(dateArray[1]) - 1] +
                ' ' +
                dateArray[0].substring(2, 4)
            setDateString(dateString1)
        }
    }
    const handleChange = (date) => {
        let todolist = { ...todo }
        todolist.date = date
        let newDate = new Date(date).toISOString().split('T')
        const dateArray = newDate[0].split('-')
        dateString1 =
            dateArray[2] +
            ' ' +
            months[parseInt(dateArray[1]) - 1] +
            ' ' +
            dateArray[0].substring(2, 4)
        setDateString(dateString1)
        setStartDate(new Date(date))
        setTodo(todolist)
    }
    const saveTodo = async () => {
        try {
            setLoading(true)
            const response = await axios.post('/trainers/todolist', todo)
            let allTodos = [...todos]
            allTodos[index] = { ...response.data }
            setTodos([...allTodos])
            setShow(false)
            setIsSuccess(true)
            setMessage('Task Saved SuccessFully')
            setLoading(false)
        } catch (err) {
            setIsError(true)
            setMessage('Error In saving the card')
            setLoading(false)
        }
    }
    useEffect(() => {
        first()
    }, [])
    return (
        <div className="edit-todo-container">
            <div className="date-container">
                <span className="time generalText">{dateString}</span>
                <div className="date-picker">
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => handleChange(date)}
                        customInput={
                            <Icon
                                icon={
                                    'material-symbols:edit-calendar-outline-rounded'
                                }
                                height={24}
                                width={24}
                            />
                        }
                        minDate={new Date()}
                        // maxDate={maxDate}
                        excludeDates={dates}
                    />
                </div>
                {/* <div>
                    <Button
                        disabled={false}
                        type="button"
                        classNames="add-category-btn add-button"
                        text={'+ category'}
                        onClick={() => {
                            console.log('Added Category')
                        }}
                    />
                </div> */}
            </div>
            {todo.lists.map((list, idx) => {
                return (
                    <EditRow
                        list={list}
                        key={idx}
                        index={idx}
                        todo={todo}
                        setTodo={(todo) => {
                            setTodo(todo)
                        }}
                    />
                )
            })}
            {loading ? (
                <Loader />
            ) : (
                <Button
                    disabled={false}
                    type="button"
                    classNames="add-category-btn"
                    text={'Save'}
                    onClick={() => {
                        saveTodo()
                    }}
                />
            )}
        </div>
    )
}

export default EditTodo
