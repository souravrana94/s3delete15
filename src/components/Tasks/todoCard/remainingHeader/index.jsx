import React, { useState } from 'react'
import './index.scss'
import { Icon } from '@iconify/react'

const RemainingHeader = ({
    data,
    idx,
    setIndex,
    setDeleteIndex,
    setEditingTodo,
    setShowModal,
}) => {
    const startDate = new Date(data.date)
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + 60)
    let dateString = ''
    const join = (date, options, seperator) => {
        const format = (m) => {
            let f = new Intl.DateTimeFormat('en', m)
            return f.format(date)
        }
        return options.map(format).join(seperator)
    }
    if (startDate) {
        let options = [
            { day: 'numeric' },
            { month: 'short' },
            { year: 'numeric' },
        ]
        dateString = join(new Date(startDate), options, ' ')
    }
    const removeSession = () => {
        setDeleteIndex(idx)
    }

    return (
        <>
            <div className="remainingHeader-todo">
                <div className="datePickerWrapper-remaining">
                    <span className="time generalText">
                        <Icon
                            icon={'ic:outline-date-range'}
                            height={20}
                            width={20}
                        />
                        {dateString}
                    </span>
                </div>
                <div className="icons-container">
                    <Icon
                        icon={'ion:trash-outline'}
                        height={22}
                        width={22}
                        className="close-exercise"
                        onClick={() => {
                            removeSession()
                        }}
                    />

                    <Icon
                        icon={'clarity:note-edit-line'}
                        height={22}
                        width={22}
                        className="edit-icon"
                        onClick={() => {
                            setIndex(idx)
                            setEditingTodo({ ...data })
                            setShowModal(true)
                        }}
                    />
                </div>
            </div>
        </>
    )
}

export default RemainingHeader
