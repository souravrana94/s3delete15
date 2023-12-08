import React from 'react'
import './index.scss'
import { Icon } from '@iconify/react'
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar'
const PastHeader = ({ data }) => {
    const date = data.date ? new Date(data.date).toISOString().split('T') : null
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
    if (date) {
        const dateArray = date[0].split('-')
        dateString =
            dateArray[2] +
            ' ' +
            months[parseInt(dateArray[1]) - 1] +
            ' ' +
            dateArray[0].substring(2, 4)
    }
    let lists = data.lists
    let totalItems = 0
    let checkedItems = 0
    for (let i = 0; i < lists?.length; i++) {
        for (let j = 0; j < lists[i]?.items.length; j++) {
            totalItems++
            if (lists[i]?.items[j]?.isChecked) {
                checkedItems++
            }
        }
    }
    const checkedPercenage = checkedItems / totalItems
    const checkedPercentageFormatted = (checkedPercenage * 100)?.toFixed(0)
    return (
        <div className="past-header">
            {' '}
            <div className="date-container">
                <span className="time generalText">
                    <Icon
                        icon={'ic:outline-date-range'}
                        height={20}
                        width={20}
                    />
                    {dateString}
                </span>
            </div>
            <div className="progressbar">
                <CircularProgressbar
                    className="circular-progress-bar"
                    value={checkedPercentageFormatted}
                    text={`${checkedPercentageFormatted}%`}
                    backgroundPadding={2}
                    styles={buildStyles({
                        textColor: '#FFFFFF',
                        pathColor: '#7FD18C',
                        trailColor: '#FFFFFF',
                        textSize: '25px',
                    })}
                />
                <div className="progress-percent">{`${checkedItems}/${totalItems}`}</div>
            </div>
        </div>
    )
}

export default PastHeader
