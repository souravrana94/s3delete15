import React, { forwardRef, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import ReactDatePicker from 'react-datepicker'
import './index.scss'
import Loader from '../../../../Common/Loader'
import DatePickerComponent from '../../../../Common/Form/DatePicker'
import SessionThemePicker from '../SessionThemePicker'
import SessionThemeCard from '../SessionThemePicker/SessionThemeCard'
import { Icon } from '@iconify/react'

const RemainingHeader = ({
    routineName,
    startDate,
    setStartDate,
    isEditing,
    setIsEditing,
    saveCard,
    idx,
    isError = false,
    errorMessage = 'Error saving card',
    isSuccess = false,
    loading,
    updatedSession,
    setUpdatedSession,
    removeSession,
    sessionThemes,
    setSessionName,
    excludedDates,
    selectedSessionTheme,
    showAddButton = true,
    setAddErrorMessage = () => {},
    workoutTime,
    minDate,
    timezone,
}) => {
    // console.log('selected', selectedSessionTheme)
    const [selectedCard, setSelectedTheme] = useState(selectedSessionTheme)
    // console.log(selectedCard, 'card')
    const setSelectedCard = (idx) => {
        // error
        let theme = sessionThemes[sessionThemes.findIndex((e) => e._id == idx)]
        // console.log(routine)
        // console.log('variants', variants)
        if (theme) {
            let session = structuredClone(updatedSession)
            let variants = session.variants
            if (session.exercises.length > 0) {
                let index = variants.findIndex(
                    (v) => v.variantType == theme?.variantName,
                )
                if (index == -1) {
                    let exercises = structuredClone(session.exercises)
                    let rand = Math.random()
                    exercises.map((e) => {
                        e._id = rand
                    })
                    variants.push({
                        variantType: theme.variantName,
                        exercises: exercises,
                    })
                }
            }
            session.variantType = theme?.variantName
            session.sessionThemeRef = theme?._id
            let exercises = []
            let index1 = variants.findIndex(
                (v) => v.variantType == theme?.variantName,
            )
            if (index1 != -1) {
                exercises = variants[index1].exercises
            }
            session.exercises = exercises
            // console.log(exercises)
            setUpdatedSession({ ...session })
            setSelectedTheme(idx)
        }
    }
    useEffect(() => {
        setSelectedCard(selectedSessionTheme)
    }, [selectedSessionTheme])
    const CustomInput = forwardRef(({ value, onClick }, ref) => {
        return (
            <img
                className="customInput"
                onClick={onClick}
                ref={ref}
                src="/images/dateedit.svg"
                alt=""
                height="14"
            />
        )
    })
    CustomInput.displayName = 'CustomInput'
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + 60)
    let dateString = ''
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

    return (
        <div>
            <div className="remaining-header">
                <div className="routine-date">
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <div>
                            {!isEditing ? (
                                <SessionThemeCard
                                    sessionTheme={
                                        sessionThemes?.filter(
                                            (sessionTheme) =>
                                                sessionTheme?._id ==
                                                selectedCard,
                                        )[0]
                                    }
                                />
                            ) : (
                                <></>
                            )}
                        </div>
                        <div className="routine-header">
                            {isEditing ? (
                                <input
                                    type={'text'}
                                    value={routineName}
                                    onChange={(e) => {
                                        setSessionName(e.target.value)
                                    }}
                                    className="routine-editing"
                                />
                            ) : (
                                <div className="routine">{routineName}</div>
                            )}
                            <div className="datePickerWrapper-remaining">
                                <span className="time generalText">
                                    <Icon
                                        icon={'ic:outline-date-range'}
                                        height={20}
                                        width={20}
                                    />
                                    {dateString}
                                </span>
                                {isEditing ? (
                                    <DatePickerComponent
                                        initialValue={startDate}
                                        setValue={(date) => setStartDate(date)}
                                        showDate={false}
                                        startYear={startDate.getFullYear()}
                                        endYear={startDate?.getFullYear() + 1}
                                        minDate={minDate}
                                        maxDate={endDate}
                                        excludeDates={excludedDates?.filter(
                                            (v, index) => index != idx,
                                        )}
                                    />
                                ) : (
                                    <></>
                                )}
                            </div>
                            <div className="time">
                                {/* <img
                                    src="/images/clock.svg"
                                    alt=""
                                    height="18"
                                /> */}
                                <Icon
                                    icon={'bi:clock-fill'}
                                    height={20}
                                    width={20}
                                />
                                <span>{workoutTime} mins</span>
                            </div>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <Loader />
                ) : (
                    <div className="edit-close">
                        {isEditing ? (
                            // <img
                            //     className="edit-icon"
                            //     src="/images/Save.svg"
                            //     alt=""
                            //     height="18"
                            //     onClick={() => {
                            //         saveCard(startDate, selectedCard)
                            //     }}
                            // />
                            <Icon
                                icon={'bx:save'}
                                height={22}
                                width={22}
                                className="edit-icon"
                                onClick={() => {
                                    saveCard(startDate, selectedCard)
                                }}
                            />
                        ) : (
                            // <img
                            //     className="edit-icon"
                            //     src="/images/editicon.svg"
                            //     alt=""
                            //     height="18"
                            //     onClick={() => {
                            //         if (!showAddButton) {
                            //             setAddErrorMessage(true)
                            //             return
                            //         }
                            //         setIsEditing(true)
                            //     }}
                            // />
                            <Icon
                                icon={'clarity:note-edit-line'}
                                height={22}
                                width={22}
                                className="edit-icon"
                                onClick={() => {
                                    if (!showAddButton) {
                                        setAddErrorMessage(
                                            'Please save current session before adding',
                                        )
                                        return
                                    }
                                    setIsEditing(true)
                                }}
                            />
                        )}
                        {/* <img
                            className="close-exercise"
                            src="/images/closeWhite.svg"
                            alt="close-icon"
                            height="18"
                            onClick={() => {
                                setIsEditing(false)
                                removeSession()
                            }}
                        /> */}
                        <Icon
                            icon={'ep:close-bold'}
                            height={22}
                            width={22}
                            className="close-exercise"
                            onClick={() => {
                                removeSession()
                            }}
                        />
                    </div>
                )}
            </div>
            {isError ? (
                <small className="form-text text-danger">{errorMessage}</small>
            ) : isSuccess ? (
                <small className="message success">
                    Session saved successfully
                </small>
            ) : (
                <></>
            )}
            {isEditing ? (
                <SessionThemePicker
                    selectedSessionTheme={selectedSessionTheme}
                    sessionThemes={sessionThemes}
                    selectedCard={selectedCard}
                    setSelectedCard={(idx) => setSelectedCard(idx)}
                    breakpoints={[480, 330]}
                />
            ) : (
                <></>
            )}
        </div>
    )
}

RemainingHeader.propTypes = {
    routineName: PropTypes.string,
    startDate: PropTypes.object,
    setStartDate: PropTypes.func,
    isEditing: PropTypes.bool,
    setIsEditing: PropTypes.func,
    saveCard: PropTypes.func,
    removeSession: PropTypes.func,
}

export default RemainingHeader
