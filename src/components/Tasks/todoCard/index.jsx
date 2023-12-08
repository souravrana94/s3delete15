import React, { useState, useEffect } from 'react'
import './index.scss'
import PastHeader from './pastHeader'
import TodoTable from './todoTable'
import RemainingHeader from './remainingHeader'

const TodoCard = ({
    todo,
    past,
    clientId,
    setIndex,
    setDeleteIndex,
    idx,
    setShowModal,
    setEditingTodo,
}) => {
    return (
        <>
            <div className="todo-container">
                <div className="content">
                    {past ? (
                        <PastHeader data={todo} />
                    ) : (
                        <RemainingHeader
                            idx={idx}
                            data={todo}
                            setIndex={setIndex}
                            setDeleteIndex={setDeleteIndex}
                            setShowModal={setShowModal}
                            setEditingTodo={setEditingTodo}
                        />
                    )}
                    <TodoTable lists={todo.lists} past={past} />
                </div>
            </div>
        </>
    )
}

export default TodoCard
