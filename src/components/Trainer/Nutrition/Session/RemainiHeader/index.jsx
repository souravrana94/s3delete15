import React, { forwardRef, useState } from 'react'
import PropTypes from 'prop-types'
import ReactDatePicker from 'react-datepicker'
import './index.scss'
import Loader from '../../../../Common/Loader'
import DatePickerComponent from '../../../../Common/Form/DatePicker'
import SessionThemePicker from '../SessionThemePicker'
import SessionThemeCard from '../SessionThemePicker/SessionThemeCard'
import { Icon } from '@iconify/react'
import moment from 'moment'
import PieChart from '../../../../Common/NutritionPieChart'

const RemainingHeader = ({
    routineName,
    startDate,
    graphData,
    setStartDate,
    isEditing,
    setIsEditing,
    saveCard,
    idx,
    isError = false,
    errorMessage = 'Error saving card',
    isSuccess = false,
    loading,
    removeSession,
    // sessionThemes,
    setSessionName,
    excludedDates,
    // selectedSessionTheme,
    showAddButton = true,
    setAddErrorMessage = () => {},
    // workoutTime,
    minDate,
    timezone,
}) => {
    // const [selectedCard, setSelectedCard] = useState(selectedSessionTheme)
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
        // dateString = join(new Date(startDate), options, ' ')
        dateString = moment(startDate).format('DD MMM yy')
    }

    return (
        <div>
            <div className="remaining-header">
                <div className="routine-date">
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                        }}
                    >
                        <PieChart
                            renderScreen="card"
                            protein={graphData?.protein}
                            fat={graphData?.fat}
                            carbs={graphData?.carbs}
                            calories={graphData?.calories}
                        />
                        <div className="routine-header">
                            {isEditing ? (
                                <input
                                    type={'text'}
                                    value={routineName}
                                    onChange={(e) => {
                                        setSessionName(e.target.value)
                                    }}
                                    className="routine-name-editing"
                                />
                            ) : (
                                <div className="routine-name">
                                    {routineName}
                                </div>
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
                                {/* {console.log('date ', minDate, endDate)} */}
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
                            {/* <div className="time">
                                <Icon
                                    icon={'bi:clock-fill'}
                                    height={20}
                                    width={20}
                                />
                                <span>{workoutTime} mins</span>
                            </div> */}
                        </div>
                    </div>
                </div>

                {loading ? (
                    <Loader />
                ) : (
                    <div className="edit-close">
                        {isEditing ? (
                            <Icon
                                icon={'bx:save'}
                                height={22}
                                width={22}
                                className="edit-icon"
                                onClick={() => {
                                    saveCard(startDate)
                                }}
                            />
                        ) : (
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
