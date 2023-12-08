import React, { useState, forwardRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import DatePicker from 'react-datepicker'
import InputBox from '../InputBox'
import './index.scss'
import { Icon } from '@iconify/react'

const DatePickerComponent = ({
    id = '',
    label,
    inputLabel,
    labelClass = '',
    classNames = '',
    register,
    startYear = 1950,
    endYear = 2025,
    initialValue = new Date(),
    disabled = false,
    setValue = () => {},
    showDate = true,
    minDate = Date.parse('1/01/1950'),
    maxDate = Date.parse('1/01/2025'),
    excludeDates = [],
    ...props
}) => {
    function range(start, end, increment) {
        let array = []
        for (let index = start; index <= end; index++) {
            array.push(index)
        }
        return array
    }
    const [startDate, setStartDate] = useState(initialValue)
    const years = range(startYear, endYear, 1)
    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ]
    useEffect(() => {
        setValue(startDate)
    }, [startDate])
    const CustomInput = forwardRef(({ value, onClick }, ref) => {
        return (
            <div className="customInput" onClick={onClick} ref={ref}>
                <input ref={register} name="DOB" type="hidden" value={value} />
                {showDate ? <>{value}</> : <></>}
                {/* <img src="images/dateedit.svg" alt="" srcSet="" /> */}
                {/* <Icon
                    color={'white'}
                    fontSize={'24'}
                    icon={<MdEditCalendar />}
                /> */}
                <Icon
                    icon={'material-symbols:edit-calendar-outline-rounded'}
                    height={24}
                    width={24}
                />
            </div>
        )
    })
    CustomInput.displayName = 'CustomInput'
    return label ? (
        <div className={`label-input-container ${classNames}`}>
            <div className={`label-text-container ${labelClass}`}>
                {label && (
                    <label className="label" htmlFor={id}>
                        {label}
                    </label>
                )}
            </div>
            <div className="input-container">
                {inputLabel && <div className="input-label">{inputLabel}</div>}
                <DatePicker
                    disabled={disabled}
                    renderCustomHeader={({
                        date,
                        changeYear,
                        changeMonth,
                        decreaseMonth,
                        increaseMonth,
                        prevMonthButtonDisabled,
                        nextMonthButtonDisabled,
                    }) => (
                        <div
                            style={{
                                margin: 10,
                                display: 'flex',
                                justifyContent: 'center',
                            }}
                        >
                            <button
                                className="date-arrow-btn"
                                onClick={decreaseMonth}
                                disabled={prevMonthButtonDisabled}
                            >
                                {'<'}
                            </button>
                            <select
                                className="date-options"
                                value={date.getFullYear()}
                                onChange={({ target: { value } }) =>
                                    changeYear(value)
                                }
                            >
                                {years.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>

                            <select
                                className="date-options"
                                value={months[date.getMonth()]}
                                onChange={({ target: { value } }) =>
                                    changeMonth(months.indexOf(value))
                                }
                            >
                                {months.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>

                            <button
                                className="date-arrow-btn"
                                onClick={increaseMonth}
                                disabled={nextMonthButtonDisabled}
                            >
                                {'>'}
                            </button>
                        </div>
                    )}
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    customInput={<CustomInput />}
                />
            </div>
        </div>
    ) : (
        <DatePicker
            portalId="root-portal"
            renderCustomHeader={({
                date,
                changeYear,
                changeMonth,
                decreaseMonth,
                increaseMonth,
                prevMonthButtonDisabled,
                nextMonthButtonDisabled,
            }) => (
                <div
                    style={{
                        margin: 10,
                        display: 'flex',
                        justifyContent: 'center',
                    }}
                >
                    <button
                        className="date-arrow-btn"
                        onClick={decreaseMonth}
                        disabled={prevMonthButtonDisabled}
                    >
                        {'<'}
                    </button>
                    <select
                        className="date-options"
                        value={date.getFullYear()}
                        onChange={({ target: { value } }) => changeYear(value)}
                    >
                        {years.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>

                    <select
                        className="date-options"
                        value={months[date.getMonth()]}
                        onChange={({ target: { value } }) =>
                            changeMonth(months.indexOf(value))
                        }
                    >
                        {months.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>

                    <button
                        className="date-arrow-btn"
                        onClick={increaseMonth}
                        disabled={nextMonthButtonDisabled}
                    >
                        {'>'}
                    </button>
                </div>
            )}
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            customInput={<CustomInput />}
            minDate={minDate}
            maxDate={maxDate}
            excludeDates={excludeDates}
        />
    )
}

DatePickerComponent.propTypes = {
    id: PropTypes.string,
    label: PropTypes.string,
    labelClass: PropTypes.string,
}

export default DatePickerComponent
