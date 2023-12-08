import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import axios from '../../../../store/axios-secure'
import './index.scss'
// import { getRange, getInputRange } from '../../../../utilities/utilities'
import Loader from '../../../Common/Loader'
import InternalServerErrorPage from '../../../Common/ErrorPage/InternalServerErrorPage'
// import Button from '../../Common/Button'
import { propTypes } from 'react-bootstrap/esm/Image'
import { Icon } from '@iconify/react'
import TextArea from '../../../Common/Form/TextArea'
import CustomModal from '../../../Common/Modal'
import AddFoodItem from '../../../Profile/Components/AddFoodItem'

const EditMeal = ({
    RowCycle,
    clientId,
    meal,
    setMeal,
    deleteMeal,
    autoPrefill = true,
    showFeedback = true,
    forCycle,
}) => {
    let invalidChars = ['-', '+', 'e']
    const [showAddItemModal, setShowAddItemModal] = useState(false)
    const [mealDetails, setMealDetails] = useState({
        name: meal?.foodInfoRef?.name,
        protein: meal?.foodInfoRef?.protein,
        fat: meal?.foodInfoRef?.fat,
        carbs: meal?.foodInfoRef?.carbs,
        calories: meal?.foodInfoRef?.calories,
        serving_sizes: meal?.foodInfoRef?.serving_sizes,
        // name: exercise?.exerciseInfoRef?.name,
        // gifUrl: exercise?.exerciseInfoRef?.gifUrl,
    })
    const [loading, setLoading] = useState(false)
    const [tableLoading, setTableLoading] = useState(false)
    const [error, setError] = useState(false)
    const [options, setOptions] = useState([])
    const [isaddMealOption, setIsAddMealOption] = useState(false)
    const [message, setMessage] = useState('')
    // const [multiplier, setMultiplier] = useState(1)

    useEffect(() => {
        updateData()
    }, [mealDetails, meal?.unit, meal?.quantity])

    useEffect(() => {
        let measureList = []
        if (measureList?.filter((item) => item?.unit === 'gm').length) {
            // measureList.push({ 'unit': 'Select unit', multiplier: 0 })
            measureList.push({ unit: 'gm', multiplier: 0.01 })
        }
        meal?.foodInfoRef?.serving_sizes?.map((item) => measureList.push(item))
        setMealDetails({ ...mealDetails, serving_sizes: measureList })
        // let list = measureList?.filter((items) => items?.unit == meal?.unit)
        // setMultiplier(list[0]?.multiplier)
        fetchLastSearched()
    }, [])
    const selectOption = async (option) => {
        meal.quantity = 0
        meal.calories = 0
        meal.fat = 0
        meal.carbs = 0
        meal.protein = 0
        try {
            const response = await axios.get(
                `/food/details?foodInfoId=${option?._id}&clientId=${
                    RowCycle ? '' : clientId
                }`,
            )
            const updatedData = { ...mealDetails }
            let measureList = [{ unit: 'gm', multiplier: 0.01 }]
            response?.data?.foodInfo?.serving_sizes?.map((item) =>
                measureList.push(item),
            )

            updatedData['name'] = option?.name
            ;(updatedData['protein'] = response?.data?.foodInfo?.protein),
                (updatedData['carbs'] = response?.data?.foodInfo?.carbs),
                (updatedData['fat'] = response?.data?.foodInfo?.fat),
                (updatedData['calories'] = response?.data?.foodInfo?.calories),
                (updatedData['serving_sizes'] = measureList),
                setMealDetails(updatedData)
            meal.foodInfoRef = { ...updatedData }
            meal.comment = response?.data?.comment
            if (!RowCycle) meal.feedback = response?.data?.feedback
        } catch (e) {
            console.log('e', e)
        }
        meal.name = option?.name
        meal.foodInfoRef = { ...meal.foodInfoRef, ...option }
        // if (option.comment) {
        //     meal.comment = option?.comment
        //     delete option.comment
        // } else if (meal.comment) {
        //     meal.comment = null
        // }
        // exercise.exerciseInfoRef = option
        // if (option?.feedbackComment) {
        //     if (!forCycle) {
        //         meal.feedbackComment = option?.feedbackComment
        //     }
        //     delete option.feedbackComment
        // } else if (meal.feedbackComment) {
        //     meal.feedbackComment = null
        // }
        if (autoPrefill) {
            prefillSet(option._id, meal)
            // console.log('feed', meal.feedback)
        } else {
            console.log(meal.feedback)
            setMeal(meal)
        }
        setOptions([])
        setIsAddMealOption(false)
    }
    const prefillSet = async (exerciseId, meal) => {
        const clientId = location.pathname.split('/')[2]
        try {
            setTableLoading(true)
            // const response = await axios.get(
            //     `/workoutpnp/cycles/exerciseSet?clientId=${clientId}&exerciseId=${exerciseId}`,
            // )
            // exercise.exerciseSets = response.data
            setMeal(meal)
            // updateFieldRange()
            setTableLoading(false)
        } catch (error) {
            setError('Error 500')
        }
    }
    const gmQuantity = () => {
        let multiplier = 0
        let list = mealDetails?.serving_sizes?.filter(
            (items) => items?.unit == meal?.unit,
        )
        if (list?.length) {
            multiplier = list[0]?.multiplier
        }
        let quantityGm = meal?.quantity * multiplier
        // if (meal?.unit === 'gm') {
        //     quantityGm = meal?.quantity
        // }
        // if (meal?.unit === 'ml') {
        //     quantityGm = meal?.quantity
        // }
        // if (meal?.unit === 'cup') {
        //     quantityGm = meal?.quantity * 240
        // }
        // if (meal?.unit === 'glass') {
        //     quantityGm = meal?.quantity * 250
        // }
        // if (meal?.unit === 'bowl') {
        //     quantityGm = meal?.quantity * 150
        // }
        // if (meal?.unit === 'tsp') {
        //     quantityGm = meal?.quantity * 15
        // }
        return quantityGm
    }
    const updateData = () => {
        let protein, fat, calories, carbs
        let quantityGm = gmQuantity()
        if (meal?.unit && quantityGm && mealDetails?.protein) {
            protein = (mealDetails?.protein * quantityGm).toFixed(2)
            // console.log('protein', mealDetails, protein)
        }
        if (meal?.unit && quantityGm && mealDetails?.carbs) {
            carbs = (mealDetails?.carbs * quantityGm).toFixed(2)
        }
        if (meal?.unit && quantityGm && mealDetails?.fat) {
            fat = (mealDetails?.fat * quantityGm).toFixed(2)
        }
        if (meal?.unit && quantityGm && mealDetails?.calories) {
            calories = (mealDetails?.calories * quantityGm).toFixed(2)
        }
        const updatedData = { ...meal }
        ;(updatedData['protein'] = protein ? protein : meal?.protein),
            (updatedData['fat'] = fat ? fat : meal?.fat),
            (updatedData['carbs'] = carbs ? carbs : meal?.carbs),
            (updatedData['calories'] = calories ? calories : meal?.calories)
        setMeal(updatedData)
    }
    const fetchLastSearched = async () => {
        setLoading(true)
        try {
            const response = await axios.get(`/food/searchList`)
            setOptions(response?.data)
        } catch (e) {
            console.log(e)
        }
        setLoading(false)
    }
    const updateOptions = async (searchText) => {
        const clientId = location.pathname.split('/')[2]
        setLoading(true)
        try {
            const response = await axios.get(`/food?name=${searchText}`)
            // console.log('food item ', response?.data?.foodItems)
            setOptions(response?.data?.foodItems)
            if (response?.data?.foodItems?.length === 0) {
                setIsAddMealOption(true)
            }
            setError(false)
        } catch (error) {
            setError('Error 500')
        }
        setLoading(false)
    }

    const onChangeHandler = (evt, key) => {
        const searchText = evt.target.value
        setMealDetails({ ...mealDetails, [key]: searchText })
        if (key === 'name') {
            updateOptions(searchText)
        }
    }
    const fieldValueChange = (value, fieldName) => {
        let isDecimal = false
        // if (
        //     value[value.length - 1] == '.' &&
        //     fieldName === 'suggestedWeightRange'
        // ) {
        //     isDecimal = true
        // }
        // let newRange = fieldRange[fieldName]
        // newRange[range] = isNaN(value)
        //     ? null
        //     : value === ''
        //     ? null
        //     : parseFloat(value)
        // if (range == 0 && newRange[range] == null) {
        //     newRange[1] = null
        // }
        // let newFieldRange = { ...fieldRange }
        // let newExercise = JSON.parse(JSON.stringify(meal))
        // newExercise.exerciseSets.map((set) => {
        //     set[fieldName][range] =
        //         newRange[range] == null
        //             ? null
        //             : JSON.parse(JSON.stringify(newRange[range]))
        //     if (range == 0) {
        //         if (newRange[range] == null) {
        //             set[fieldName][1] = null
        //         } else {
        //             if (set[fieldName].length == 2) {
        //                 if (set[fieldName][1] <= newRange[range]) {
        //                     set[fieldName][1] = JSON.parse(
        //                         JSON.stringify(newRange[range]),
        //                     )
        //                 }
        //             } else {
        //                 set[fieldName][1] = JSON.parse(
        //                     JSON.stringify(newRange[range]),
        //                 )
        //                 newFieldRange[fieldName][1] = JSON.parse(
        //                     JSON.stringify(newRange[range]),
        //                 )
        //             }
        //         }
        //     }
        // })
        // if (range == 0 && newFieldRange[fieldName][1] <= newRange[range]) {
        //     newFieldRange[fieldName][1] = JSON.parse(
        //         JSON.stringify(newRange[range]),
        //     )
        // }
        // setMeal(newExercise)
        // if (isDecimal && newRange[range] !== null) {
        //     newRange[range] += '.'
        // }
        // if (
        //     value[value?.length - 2] == '.' &&
        //     value[value?.length - 1] == '0'
        // ) {
        //     newRange[range] += '.0'
        // } else if (value.includes('.') && value[value?.length - 1] == '0') {
        //     newRange[range] += '0'
        // }

        // newFieldRange[fieldName] = newRange
        // setFieldRange(newFieldRange)
    }

    const onBlurFieldHandler = (range) => {
        // let val = fieldRange['suggestedWeightRange'][range]
        // const newFieldRange = { ...fieldRange }
        // if (val?.[val?.length - 1] === '.') {
        //     val = val.split('.')[0]
        // }
        // newFieldRange['suggestedWeightRange'][range] = isNaN(parseFloat(val))
        //     ? null
        //     : parseFloat(val)
        // setFieldRange(newFieldRange)
    }

    const onValueChange = (item, key) => {
        setMeal({ ...meal, [key]: item })
    }

    const onCommentChange = (inputComment) => {
        const comment = inputComment
        if (comment.length) {
            meal.comment = comment
            setMeal({ ...meal })
        } else {
            if (meal.comment) {
                setMeal({ ...meal, comment: undefined })
            }
        }
    }
    const onFeedbackChange = (inputFeedback) => {
        // const feedback = inputFeedback.trim()
        if (inputFeedback.length) {
            meal.feedback = inputFeedback
            setMeal({ ...meal })
        } else {
            if (meal.feedback) {
                meal.feedback = undefined
                setMeal({ ...meal })
            }
        }
    }
    const suggestItem = async () => {
        setLoading(true)
        try {
            const response = await axios.post(
                `/food?name=${mealDetails?.name}dhal&action=suggest`,
            )
            setMessage(response?.data)
            setMealDetails({ ...mealDetails, name: '' })
        } catch (e) {
            console.log('errror in suggest api ', e)
            setError('Failed to suggest Item')
        }
        setLoading(false)
    }
    useEffect(() => {
        if (message) {
            setTimeout(() => {
                setMessage('')
                setIsAddMealOption(false)
            }, 2000)
        }
    }, [message])
    return (
        <>
            <div className="table-edit-exercise-mobile">
                <input
                    className="exercise-input"
                    value={mealDetails?.name}
                    placeholder="Food Item"
                    onChange={(e) => onChangeHandler(e, 'name')}
                />
                {loading ? (
                    <Loader />
                ) : error ? (
                    <InternalServerErrorPage />
                ) : options.length ? (
                    options?.map((o, idx) => (
                        <div
                            key={idx}
                            className="exercise-option-nutrition"
                            onClick={() => selectOption(o)}
                        >
                            {o?.name}
                        </div>
                    ))
                ) : isaddMealOption ? (
                    <div
                        // key={idx}
                        className="exercise-option-nutrition textGray"
                        onClick={() => setShowAddItemModal(true)}
                    >
                        Add item
                    </div>
                ) : null}
            </div>

            <div className="table-row-container table-editable-body">
                <div className="table-exercise">
                    <div className="selected-option">
                        <input
                            className="exercise-input"
                            value={mealDetails?.name}
                            placeholder="Food Item"
                            onChange={(e) => onChangeHandler(e, 'name')}
                        />
                    </div>
                    {loading ? (
                        <Loader />
                    ) : error ? (
                        <InternalServerErrorPage />
                    ) : options.length ? (
                        options?.map((o, idx) => (
                            <div
                                key={idx}
                                className="exercise-option-nutrition"
                                onClick={() => selectOption(o)}
                            >
                                {o?.name}
                            </div>
                        ))
                    ) : isaddMealOption ? (
                        message ? (
                            <div className="exercise-option-nutrition textMessage">
                                {message}
                            </div>
                        ) : (
                            <>
                                <div
                                    className="exercise-option-nutrition textGray"
                                    onClick={() => setShowAddItemModal(true)}
                                >
                                    Add item
                                </div>
                                <div
                                    className="exercise-option-nutrition textGray"
                                    onClick={() => suggestItem()}
                                >
                                    Suggest Item
                                </div>
                            </>
                        )
                    ) : null}
                    <div className="unit-quantity-row">
                        {/* <select
                            className="unit-input input-width"
                            value={meal?.unit}
                            onChange={(e) =>
                                onValueChange(e.target.value, 'unit')
                            }
                        >
                            {[
                                { value: '', name: 'Select unit' },
                                { value: 'gm', name: 'gm' },
                                { value: 'ml', name: 'ml' },
                                { value: 'bowl', name: 'Bowl' },
                                { value: 'glass', name: 'Glass' },
                                { value: 'cup', name: 'Cup' },
                                { value: 'tsp', name: 'tsp' },
                            ].map((unit, index) => {
                                return (
                                    <option key={index} value={unit.value}>
                                        {unit.name}
                                    </option>
                                )
                            })}
                        </select> */}
                        <select
                            className="unit-input input-width"
                            value={meal?.unit}
                            onChange={(e) => {
                                onValueChange(e.target.value, 'unit')
                            }}
                        >
                            <option value={''}>Select unit</option>
                            {mealDetails?.serving_sizes?.map((item, index) => {
                                return (
                                    <option key={index} value={item?.unit}>
                                        {item?.unit}
                                    </option>
                                )
                            })}
                        </select>
                        <div>
                            <input
                                className="quantity-input"
                                value={meal?.quantity}
                                placeholder="quantity"
                                onChange={(e) =>
                                    onValueChange(e.target.value, 'quantity')
                                }
                            />
                        </div>
                        <div className="table-action">
                            <Icon
                                icon={'ep:close-bold'}
                                onClick={deleteMeal}
                                className="close-rest-img ms-1"
                                height={13}
                            />
                        </div>
                    </div>
                </div>

                <div className="comment-container">
                    <div>
                        <Icon
                            icon="fa-regular:sticky-note"
                            height={25}
                            color="white"
                        />
                    </div>
                    <TextArea
                        divClassNames={'comment-textarea-container'}
                        inputClassNames={'comment-textarea'}
                        onChange={(e) => onCommentChange(e.target.value)}
                        rows="1"
                        cols="500"
                        placeholder={'Write your comment here'}
                        value={meal?.comment || ''}
                        maxLength={2000}
                    />
                </div>

                {showFeedback && (
                    <div className="comment-container">
                        <TextArea
                            divClassNames={'comment-textarea-container'}
                            inputClassNames={'comment-textarea'}
                            onChange={(e) => onFeedbackChange(e.target.value)}
                            rows="1"
                            cols="500"
                            value={meal?.feedback || ''}
                            maxLength={200}
                        />
                    </div>
                )}
            </div>
            <CustomModal
                title={'Add Food Item'}
                show={showAddItemModal}
                onHide={() => setShowAddItemModal(false)}
                width="medium"
                dark={true}
            >
                <AddFoodItem item={mealDetails?.name} />
            </CustomModal>
        </>
    )
}

EditMeal.propTypes = {
    exercise: PropTypes.object,
    setMeal: PropTypes.func,
    deleteMeal: PropTypes.func,
}

export default EditMeal
