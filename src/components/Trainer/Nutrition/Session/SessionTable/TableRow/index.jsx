import React, { useEffect } from 'react'
import { renderToString } from 'react-dom/server'
import PropTypes from 'prop-types'
import ReactTooltip from 'react-tooltip'
import { useState } from 'react'
import { getRange } from '../../../../../../utilities/utilities'
import './index.scss'
import { Icon } from '@iconify/react'

const MealTableRow = ({
    meal,
    completed,
    isEditing,
    setIsEditing,
    editMeal,
    showAddButton,
}) => {
    const [details, setDetails] = useState({})
    useEffect(() => {
        setDetails({
            name: meal?.foodInfoRef?.name,
            unit: meal?.unit,
            quantity: meal?.quantity,
            calories: meal?.calories,
            protein: meal?.protein,
            fat: meal?.fat,
            carbs: meal?.carbs,
        })
    }, [])

    const getDashOrValue = (value) => {
        return !value || value === -1 ? '-' : value
    }
    const getTooltipContent = (details) => {
        const stringData = renderToString(
            <div className="userFeedbackContent">
                {details?.userFeedback ? (
                    <div>
                        <span style={{ fontWeight: 'bold' }}>User:</span>{' '}
                        {details?.userFeedback}
                    </div>
                ) : null}
                {details?.feedback ? (
                    <div>
                        <span style={{ fontWeight: 'bold' }}>Trainer:</span>{' '}
                        {details?.feedback}
                    </div>
                ) : null}
            </div>,
        )
        return stringData
    }
    const rand = Math.random()

    return (
        <>
            <div className={`table-exercise-mobile`}>
                {meal?.foodInfoRef?.name}
            </div>
            <div
                data-for={`getContent-${rand}`}
                data-tip
                className={`table-row-container table-row-body noWrap ${
                    isEditing ? 'editable' : ''
                }`}
                onClick={() => isEditing && editMeal()}
                onDoubleClick={() => {
                    if (showAddButton) {
                        setIsEditing(true)
                    }
                }}
            >
                {' '}
                {meal?.userFeedback || meal?.feedback ? (
                    <ReactTooltip
                        className="tooltip-container"
                        id={`getContent-${rand}`}
                        getContent={() => getTooltipContent(meal)}
                        html={true}
                    />
                ) : null}
                <div className={`table-meal`}>
                    {meal?.foodInfoRef?.name}
                    {meal?.userFeedback || meal?.feedback ? (
                        <Icon
                            icon={'fluent:person-feedback-16-filled'}
                            height={15}
                            width={15}
                            className="iconmessage"
                        />
                    ) : null}
                </div>
                <div className="column-check">
                    {meal?.isCompleted ? (
                        <input type="checkbox" checked={meal?.isCompleted} />
                    ) : null}
                </div>
                <div className="table-column width-column2">
                    {meal?.takenUnit && meal?.takenUnit !== details?.unit
                        ? meal?.takenUnit + '/'
                        : ''}
                    {details?.unit}
                </div>
                <div className="table-column width-column1">
                    {meal?.takenQuantity &&
                    meal?.takenQuantity !== details?.quantity
                        ? meal?.takenQuantity + '/'
                        : ''}
                    {details?.quantity}
                </div>
                <div className="table-column width-column1">
                    {meal?.takenCalories &&
                    meal?.takenCalories !== details?.calories
                        ? Number(meal?.takenCalories).toFixed(0) + '/'
                        : ''}
                    {Number(details?.calories).toFixed(0)}
                </div>
                <div className="table-column width-column1">
                    {meal?.takenProtein &&
                    meal?.takenProtein !== details?.protein
                        ? Number(meal?.takenProtein).toFixed(0) + '/'
                        : ''}
                    {Number(details?.protein).toFixed(0)}
                </div>
                <div className="table-column width-column2">
                    {meal?.takenFat && meal?.takenFat !== details?.fat
                        ? Number(meal?.takenFat).toFixed(0) + '/'
                        : ''}
                    {Number(details?.fat).toFixed(0)}
                </div>
                <div className="table-column width-column2">
                    {meal?.takenCarbs && meal?.takenCarbs !== details?.carbs
                        ? Number(meal?.takenCarbs).toFixed(0) + '/'
                        : ''}
                    {Number(details?.carbs).toFixed(0)}
                </div>
                {isEditing && (
                    <div className="table-column width-column3">
                        <Icon
                            className="close-rest-img"
                            icon={'ep:close-bold'}
                            color="white"
                            height={12}
                        />
                    </div>
                )}
            </div>
        </>
    )
}

MealTableRow.propTypes = {
    meal: PropTypes.object,
    completed: PropTypes.bool,
    isEditing: PropTypes.bool,
    editMeal: PropTypes.func,
}

export default MealTableRow
