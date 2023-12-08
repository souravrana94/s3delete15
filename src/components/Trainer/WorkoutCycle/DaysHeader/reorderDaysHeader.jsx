import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Button from '../../../Common/Button'
import './index.scss'
import { Icon } from '@iconify/react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'

const ReorderDaysHeader = ({
    actualCycle,
    setShowReorderModal,
    setSelectedCycle,
}) => {
    const [isError, setIsError] = useState(false)
    useEffect(() => {
        if (isError) {
            setTimeout(() => {
                setIsError(false)
            }, 4000)
        }
    }, [isError])

    const cycleRoutines = [...actualCycle.routineRefs]
    const onDragEnd = (result) => {
        if (!result.destination) {
            return
        }
        if (result?.destination?.index === result?.source?.index) {
            return
        }
        const [removed] = cycleRoutines.splice(result?.source?.index, 1)
        cycleRoutines?.splice(result?.destination?.index, 0, removed)
        cycleRoutines?.forEach(function (day, ind) {
            day.dayNumber = ind + 1
        })
    }

    const saveCycle = () => {
        setSelectedCycle(cycleRoutines)
        setShowReorderModal(false)
    }

    return (
        <>
            <div className="reorder-days-header">
                <div className="days-header">
                    <div className="routine-container">
                        <DragDropContext onDragEnd={onDragEnd}>
                            <Droppable
                                droppableId="cycleList"
                                // direction="horizontal"
                                key="cycleKey"
                            >
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                    >
                                        {cycleRoutines?.map((cr, idx) => (
                                            <Draggable
                                                draggableId={
                                                    'drag' + cr?.dayNumber
                                                }
                                                index={idx}
                                                key={'key' + cr?.dayNumber}
                                            >
                                                {(provided) => {
                                                    return (
                                                        <div
                                                            className="routine-summary"
                                                            key={cr?._id}
                                                            {...provided.dragHandleProps}
                                                            {...provided.draggableProps}
                                                            ref={
                                                                provided.innerRef
                                                            }
                                                        >
                                                            <div className="day-number">
                                                                {cr?.dayNumber}
                                                            </div>
                                                            <div className="routine-name">
                                                                {cr?.name}
                                                            </div>
                                                        </div>
                                                    )
                                                }}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                    </div>
                </div>
                {/* <div className="reorder-btn"> */}
                <Button
                    text={'Save'}
                    color="green"
                    onClick={() => {
                        saveCycle()
                    }}
                    classNames="reorder-btn"
                />
                {/* </div> */}
            </div>
        </>
    )
}

ReorderDaysHeader.propTypes = {
    actualCycle: PropTypes.array,
    setShowReorderModal: PropTypes.func,
    setSelectedCycle: PropTypes.func,
}

export default ReorderDaysHeader
