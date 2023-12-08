import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Button from '../../../../Common/Button'
import './index.scss'
import { Icon } from '@iconify/react'

const DaysHeader = ({
    cycleRoutines,
    selectedDay,
    setSelectedDay,
    addWorkout,
    addRestDay,
    deleteDay,
    global,
    cloneDay,
}) => {
    const [isError, setIsError] = useState(false)
    useEffect(() => {
        if (isError) {
            setTimeout(() => {
                setIsError(false)
            }, 4000)
        }
    }, [isError])

    return (
        <>
            <div className="days-header">
                <div className="routine-container">
                    {cycleRoutines?.map((cr, idx) => (
                        <div
                            className={`routine-summary-nutrition ${
                                selectedDay === idx && 'selected'
                            }`}
                            key={idx}
                            onClick={() => setSelectedDay(idx)}
                        >
                            <div className="day-number">{cr?.dayNumber}</div>
                            <div className="routine-name">{cr?.name}</div>
                            {global ? (
                                <></>
                            ) : (
                                <div>
                                    <Icon
                                        onClick={() => {
                                            if (cycleRoutines?.length == 1) {
                                                setIsError(true)
                                                return
                                            }
                                            setIsError(false)
                                            deleteDay(idx)
                                        }}
                                        className={`close-button-icon ${
                                            selectedDay === idx && 'selected'
                                        }`}
                                        height={8}
                                        icon={'ep:close-bold'}
                                    />
                                    <Icon
                                        className="clone-day-icon"
                                        text={'Clone day'}
                                        onClick={() => {
                                            cloneDay(idx)
                                        }}
                                        icon={'clarity:clone-solid'}
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {global ? (
                    <></>
                ) : (
                    <div className="add-edit-container">
                        <Button
                            type="button"
                            disabled={cycleRoutines?.length >= 7}
                            classNames="add-workout-btn-nutrition"
                            text={'+ Add Nutrition'}
                            onClick={addWorkout}
                        />
                        <Button
                            type="button"
                            disabled={cycleRoutines?.length >= 7}
                            classNames="add-workout-btn-nutrition"
                            text={'+ Add Cheat Day'}
                            onClick={addRestDay}
                        />
                    </div>
                )}
            </div>
            {isError ? (
                <small className="message error">
                    There must be atleast one day routine
                </small>
            ) : (
                <></>
            )}
        </>
    )
}

DaysHeader.propTypes = {
    cycleRoutines: PropTypes.array,
    selectedDay: PropTypes.number,
    setSelectedDay: PropTypes.func,
    addWorkout: PropTypes.func,
    addRestDay: PropTypes.func,
    deleteDay: PropTypes.func,
    cloneDay: PropTypes.func,
}

export default DaysHeader
