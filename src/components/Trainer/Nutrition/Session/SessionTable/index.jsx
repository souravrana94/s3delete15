import React, { useState } from 'react'
import PropTypes from 'prop-types'
import './index.scss'
import { useEffect } from 'react'
import Button from '../../../../Common/Button'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import MealTableRow from './TableRow'
import EditMeal from '../../EditMeal'
import { Icon } from '@iconify/react'

const SessionTable = ({
    RowCycle,
    clientId,
    foodItems,
    completed,
    setFoodItems,
    graphData,
    setGraphData,
    isEditing,
    setIsEditing,
    showAddButton,
    isError = false,
    errorMessage = 'please select exercise',
    modal = false,
    autoPrefill = true,
    showFeedback = true,
    forCycle = false,
}) => {
    const [editingMeal, setEditableMeal] = useState(-1)
    const [expanded, setExpanded] = useState([])
    const mealTypeArray = [
        'Breakfast',
        'Morning Snacks',
        'Lunch',
        'Evening Snacks',
        'Dinner',
    ]
    useEffect(() => {
        if (mealTypeArray.indexOf(errorMessage?.expandMeal) !== -1) {
            let updatedExpand = [...expanded]
            updatedExpand = [
                ...updatedExpand,
                mealTypeArray.indexOf(errorMessage?.expandMeal),
            ]
            setExpanded(updatedExpand)
        }
    }, [errorMessage])
    useEffect(() => {
        if (!isEditing) {
            setEditableMeal(-1)
        }
    }, [isEditing])
    useEffect(() => {
        let fat = 0,
            protein = 0,
            carbs = 0,
            calories = 0,
            takenFat = 0,
            takenCalories = 0,
            takenCarbs = 0,
            takenProtein = 0
        foodItems?.map((item) => {
            fat = fat + Number(item?.fat ? item?.fat : 0)
            protein = protein + Number(item?.protein ? item?.protein : 0)
            carbs = carbs + Number(item?.carbs ? item?.carbs : 0)
            calories = calories + Number(item?.calories ? item?.calories : 0)
            takenFat = takenFat + Number(item?.takenFat ? item?.takenFat : 0)
            takenProtein =
                takenProtein +
                Number(item?.takenProtein ? item?.takenProtein : 0)
            takenCarbs =
                takenCarbs + Number(item?.takenCarbs ? item?.takenCarbs : 0)
            takenCalories =
                takenCalories +
                Number(item?.takenCalories ? item?.takenCalories : 0)
        })
        // console.log("akhja",  fat , Number(fat))
        setGraphData({
            fat: Number(Number(fat)?.toFixed(0)),
            protein: Number(Number(protein)?.toFixed(0)),
            carbs: Number(Number(carbs)?.toFixed(0)),
            calories: Number(Number(calories)?.toFixed(0)),
            takenFat: Number(Number(takenFat)?.toFixed(0)),
            takenProtein: Number(Number(takenProtein)?.toFixed(0)),
            takenCalories: Number(Number(takenCalories)?.toFixed(0)),
            takenCarbs: Number(Number(takenCarbs)?.toFixed(0)),
        })
    }, [foodItems])

    const handleExpand = (index, e) => {
        if (e.target.id !== 'addButton') {
            let updatedExpand = [...expanded]
            if (expanded.includes(index)) {
                updatedExpand.splice(updatedExpand.indexOf(index), 1)
            } else {
                updatedExpand = [...updatedExpand, index]
            }
            setExpanded(updatedExpand)
        }
    }
    const setMeal = (food, idx) => {
        const updatedExercises = [...foodItems]

        const index = updatedExercises.findIndex(
            (item) => item?._id === idx || item?.id === idx,
        )
        updatedExercises[index] = {
            ...updatedExercises[index],
            name: food?.name,
            unit: food?.unit,
            quantity: food?.quantity,
            foodInfoRef: food?.foodInfoRef,
            protein: food?.protein,
            calories: food?.calories,
            fat: food?.fat,
            carbs: food?.carbs,
            // exerciseInfoRef: exercise?.exerciseInfoRef,
            // exerciseSets: exercise?.exerciseSets,
            // exerciseComment: exercise?.exerciseComment,
        }
        setFoodItems(updatedExercises)
        // console.log("----easia", food, idx, updatedExercises)
    }
    const addExercise = () => {
        // const updatedExercises = [
        //     ...exercises,
        //     {
        //         _id: Math.random(),
        //         exerciseInfoRef: '-',
        //         exerciseSets: [
        //             {
        //                 number: 1,
        //                 suggestedWeightRange: [],
        //                 suggestedRepRange: [10, 15],
        //                 suggestedRIRRange: [1, 3],
        //             },
        //             {
        //                 number: 2,
        //                 suggestedWeightRange: [],
        //                 suggestedRepRange: [10, 15],
        //                 suggestedRIRRange: [1, 3],
        //             },
        //             {
        //                 number: 3,
        //                 suggestedWeightRange: [],
        //                 suggestedRepRange: [10, 15],
        //                 suggestedRIRRange: [1, 3],
        //             },
        //         ],
        //     },
        // ]
        // setExercises(updatedExercises)
    }
    const deleteMeal = (idx) => {
        let index = foodItems.findIndex(
            (item) => item?._id === idx || item?.id === idx,
        )
        if (index !== -1) {
            const updatedExercises = [...foodItems]
            updatedExercises.splice(index, 1)
            setFoodItems(updatedExercises)
        }
        setEditableMeal(-1)
    }

    const handleAddMeal = (type, e, index) => {
        if (!expanded.includes(index)) {
            let updatedExpand = [...expanded]
            updatedExpand = [...updatedExpand, index]
            setExpanded(updatedExpand)
        }
        const mealId = Math.floor(Math.random() * 10 ** 10)
        const meal = {
            id: mealId,
            mealType: type,
            name: '',
            unit: '',
            quantity: '',
            calories: '',
            protein: '',
            fat: '',
            carbs: '',
            comment: '',
            feedback: '',
            isCompleted: false,
        }
        let updatedFoodItems
        foodItems
            ? (updatedFoodItems = [...foodItems, meal])
            : (updatedFoodItems = [meal])

        setFoodItems(updatedFoodItems)
        setEditableMeal(mealId)
    }

    return (
        <div className="table-container">
            <div className="table-heading">
                <div className="table-row-container">
                    <div className="table-meal">Meal</div>
                    <div className="table-column width-column2">Unit</div>
                    <div className="table-column width-column1">Quantity</div>
                    <div className="table-column width-column1">Calorie</div>
                    <div className="table-column width-column1">Protein</div>
                    <div className="table-column width-column2">Fat</div>
                    <div className="table-column width-column2">Carbs</div>
                    {isEditing && (
                        <div className="table-column width-column3"></div>
                    )}
                </div>
            </div>
            <div className="table-body-container">
                <div className="table-body">
                    {mealTypeArray.map((type, index) => {
                        return (
                            <div key={index} className="accordionBorder">
                                <div
                                    id={'accordion'}
                                    className="meal-type-header"
                                    onClick={(e) => handleExpand(index, e)}
                                >
                                    {isEditing ? (
                                        <button
                                            id={'addButton'}
                                            className="meal-button"
                                            onClick={(e) =>
                                                handleAddMeal(type, e, index)
                                            }
                                        >
                                            + {type}
                                        </button>
                                    ) : (
                                        <div
                                            id={'accordion'}
                                            className="meal-type"
                                        >
                                            {type}
                                        </div>
                                    )}
                                    <div>
                                        {expanded.includes(index) ? (
                                            <Icon
                                                icon={'ic:round-expand-less'}
                                                // onClick={()=>setExpanded(null)}
                                                className="close-rest-img ms-1"
                                                height={20}
                                            />
                                        ) : (
                                            <Icon
                                                icon={'ic:round-expand-more'}
                                                // onClick={()=>setExpanded(index)}
                                                className="close-rest-img ms-1"
                                                height={20}
                                            />
                                        )}
                                    </div>
                                </div>

                                {expanded.includes(index)
                                    ? foodItems
                                          ?.filter(
                                              (item) => item.mealType === type,
                                          )
                                          ?.map((item, index2) => {
                                              let matchId = item?._id
                                                  ? item?._id
                                                  : item.id
                                              return (
                                                  <div key={index2}>
                                                      {editingMeal ===
                                                          item?._id ||
                                                      editingMeal ===
                                                          item?.id ? (
                                                          <EditMeal
                                                              RowCycle={
                                                                  RowCycle
                                                              }
                                                              clientId={
                                                                  clientId
                                                              }
                                                              key={index2}
                                                              meal={item}
                                                              setMeal={(
                                                                  meal,
                                                              ) => {
                                                                  setMeal(
                                                                      meal,
                                                                      matchId,
                                                                  )
                                                              }}
                                                              deleteMeal={() =>
                                                                  deleteMeal(
                                                                      matchId,
                                                                  )
                                                              }
                                                              autoPrefill={
                                                                  autoPrefill
                                                              }
                                                              showFeedback={
                                                                  showFeedback
                                                              }
                                                              forCycle={
                                                                  forCycle
                                                              }
                                                          />
                                                      ) : (
                                                          <MealTableRow
                                                              key={index2}
                                                              meal={item}
                                                              completed={
                                                                  completed
                                                              }
                                                              isEditing={
                                                                  isEditing
                                                              }
                                                              setIsEditing={
                                                                  setIsEditing
                                                              }
                                                              showAddButton={
                                                                  showAddButton
                                                              }
                                                              editMeal={() => {
                                                                  setEditableMeal(
                                                                      matchId,
                                                                  )
                                                              }}
                                                          />
                                                      )}

                                                      {isError &&
                                                          (errorMessage?.index ==
                                                          matchId ? (
                                                              <small className="message error">
                                                                  {
                                                                      errorMessage?.message
                                                                  }
                                                              </small>
                                                          ) : (
                                                              <></>
                                                          ))}
                                                  </div>
                                              )
                                          })
                                    : null}
                            </div>
                        )
                    })}
                </div>

                {/* {isError && errorMessage?.index == matchId ? (
                    <small className="message error">
                        {errorMessage?.message}
                    </small>
                ) : (
                    <></>
                )} */}
            </div>
        </div>
    )
}

SessionTable.propTypes = {
    foodItems: PropTypes.array,
    completed: PropTypes.bool,
    isEditing: PropTypes.bool,
    setFoodItems: PropTypes.func,
}

export default SessionTable
