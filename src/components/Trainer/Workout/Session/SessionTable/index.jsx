import React, { useState } from 'react'
import PropTypes from 'prop-types'
import TableRow from './TableRow'
import EditExercise from '../../../EditExercise'
import './index.scss'
import { useEffect } from 'react'
import Button from '../../../../Common/Button'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'

const SessionTable = ({
    exercises,
    completed,
    setExercises,
    isEditing,
    isError = false,
    getComment,
    errorMessage = 'please select exercise',
    modal = false,
    autoPrefill = true,
    showFeedback = true,
    forCycle = false,
    variantType,
    clientId,
    routineRef,
    fetchActiveCycle,
    updatedSession,
    setUpdatedSession,
}) => {
    const [editingExercise, setEditableExercise] = useState(-1)
    useEffect(() => {
        if (!isEditing) {
            setEditableExercise(-1)
        }
    }, [isEditing])
    // console.log(variantType)
    const setExercise = (exercise, idx) => {
        const updatedExercises = [...exercises]
        updatedExercises[idx] = {
            ...updatedExercises[idx],
            exerciseInfoRef: exercise?.exerciseInfoRef,
            exerciseSets: exercise?.exerciseSets,
            exerciseComment: exercise?.exerciseComment,
            load: exercise?.load,
            reps: exercise?.reps,
            tempo: exercise?.tempo,
        }
        setExercises(updatedExercises)
    }
    const addExercise = () => {
        const updatedExercises = [
            ...exercises,
            {
                _id: Math.random(),
                exerciseInfoRef: '-',
                exerciseSets: [
                    {
                        number: 1,
                        suggestedWeightRange: [],
                        suggestedRepRange: [10, 15],
                        suggestedRIRRange: [1, 3],
                    },
                    {
                        number: 2,
                        suggestedWeightRange: [],
                        suggestedRepRange: [10, 15],
                        suggestedRIRRange: [1, 3],
                    },
                    {
                        number: 3,
                        suggestedWeightRange: [],
                        suggestedRepRange: [10, 15],
                        suggestedRIRRange: [1, 3],
                    },
                ],
            },
        ]

        // console.log('updated exercises', updatedExercises)
        setExercises(updatedExercises)
    }
    const deleteExercise = (idx) => {
        const updatedExercises = [...exercises]
        updatedExercises.splice(idx, 1)
        setExercises(updatedExercises)
        setEditableExercise(-1)
    }

    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list)
        const [removed] = result.splice(startIndex, 1)
        result.splice(endIndex, 0, removed)

        return result
    }
    function getStyle(style, snapshot) {
        if (!snapshot.isDropAnimating) {
            return style
        }
        const { moveTo, curve, duration } = snapshot.dropAnimation
        // move to the right spot
        const translate = `translate(${moveTo.x}px, ${moveTo.y}px)`
        return {
            ...style,
            transform: `${translate} `,
        }
    }

    function onDragEnd(result) {
        if (!result.destination) {
            return
        }

        if (result.destination.index === result.source.index) {
            return
        }

        const exercises1 = reorder(
            exercises,
            result.source.index,
            result.destination.index,
        )
        if (editingExercise != -1) {
            setEditableExercise(-1)
        }
        setExercises(exercises1)
    }
    return (
        <div className="table-container">
            <div className="table-heading">
                <div className="table-row-container">
                    <div className="table-exercise">{`Exercise(${variantType})`}</div>
                    <div className="table-sets">Sets</div>
                    <div className="table-weights">Weight</div>
                    <div className="table-reps">Reps</div>
                    <div className="table-reps">RIR</div>
                    {isEditing && <div className="table-action"></div>}
                </div>
            </div>
            <div className="table-body-container">
                <div>
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable
                            droppableId="list"
                            isDropDisabled={!isEditing}
                        >
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                >
                                    {exercises?.map((exercise, index) => {
                                        return (
                                            <Draggable
                                                isDragDisabled={!isEditing}
                                                draggableId={exercise?._id?.toString()}
                                                index={index}
                                                key={exercise?._id}
                                            >
                                                {(provided, snapshot) => {
                                                    if (
                                                        snapshot.isDragging &&
                                                        !modal
                                                    ) {
                                                        provided.draggableProps.style.left =
                                                            provided.draggableProps.style.offsetLeft
                                                        provided.draggableProps.style.top =
                                                            provided.draggableProps.style.offsetTop
                                                    }
                                                    return (
                                                        <div
                                                            ref={
                                                                provided.innerRef
                                                            }
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            style={getStyle(
                                                                provided
                                                                    .draggableProps
                                                                    .style,
                                                                snapshot,
                                                            )}
                                                        >
                                                            {editingExercise ===
                                                            index ? (
                                                                <EditExercise
                                                                    exercise={
                                                                        exercise
                                                                    }
                                                                    setExercise={(
                                                                        exercise,
                                                                    ) => {
                                                                        setExercise(
                                                                            exercise,
                                                                            index,
                                                                        )
                                                                    }}
                                                                    deleteExercise={() =>
                                                                        deleteExercise(
                                                                            index,
                                                                        )
                                                                    }
                                                                    getComment={
                                                                        getComment
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
                                                                    clientId={
                                                                        clientId
                                                                    }
                                                                    routineRef={
                                                                        routineRef
                                                                    }
                                                                    fetchActiveCycle={
                                                                        fetchActiveCycle
                                                                    }
                                                                    updatedSession={
                                                                        updatedSession
                                                                    }
                                                                    setUpdatedSession={
                                                                        setUpdatedSession
                                                                    }
                                                                />
                                                            ) : (
                                                                <TableRow
                                                                    exercise={
                                                                        exercise
                                                                    }
                                                                    completed={
                                                                        completed
                                                                    }
                                                                    isEditing={
                                                                        isEditing
                                                                    }
                                                                    editExercise={() =>
                                                                        setEditableExercise(
                                                                            index,
                                                                        )
                                                                    }
                                                                />
                                                            )}
                                                            {isError &&
                                                            errorMessage?.index ==
                                                                index ? (
                                                                <small className="message error">
                                                                    {
                                                                        errorMessage?.message
                                                                    }
                                                                </small>
                                                            ) : (
                                                                <></>
                                                            )}
                                                        </div>
                                                    )
                                                }}
                                            </Draggable>
                                        )
                                    })}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </div>
                {/* </div>
            <div className="table-body-container"> */}
                {/* {exercises?.map((e, idx) =>
                    editingExercise === idx ? (
                        <EditExercise
                            key={idx}
                            exercise={e}
                            setExercise={(exercise) =>
                                setExercise(exercise, idx)
                            }
                            deleteExercise={() => deleteExercise(idx)}
                        />
                    ) : (
                        <TableRow
                            key={idx}
                            exercise={e}
                            completed={completed}
                            isEditing={isEditing}
                            editExercise={() => setEditableExercise(idx)}
                        />
                    ),
                )} */}

                {isEditing && (
                    <Button
                        classNames="add-exercise-btn"
                        onClick={() => addExercise()}
                        text={'+ Add Exercise'}
                        size={'s'}
                    />
                )}
            </div>
        </div>
    )
}

SessionTable.propTypes = {
    exercises: PropTypes.array,
    completed: PropTypes.bool,
    isEditing: PropTypes.bool,
    setExercises: PropTypes.func,
}

export default SessionTable
