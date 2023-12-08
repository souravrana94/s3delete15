import React, { useState, useEffect } from 'react'
import Carousel from '../../Common/Carousel'
import TodoCard from '../todoCard'
import CustomModal from '../../Common/Modal'
import EditTodo from '../todoCard/editTodo'

const Todos = ({
    past = false,
    breakpoints = [1407, 1000],
    setTodos,
    todos,
    data,
    setClickIndex,
    showEditModal,
    setShowEditModal,
    clickIndex,
    setMessage,
    setIsSuccess,
    setIsError,
    editingTodo,
    setEditingTodo,
    excludeDates,
}) => {
    return (
        <div>
            <div className="container-xl">
                <Carousel breakpoints={breakpoints}>
                    {todos.map((todo, idx) => {
                        return (
                            <TodoCard
                                todo={todo}
                                key={idx}
                                past={past}
                                idx={idx}
                                setIndex={(i) => setClickIndex(i)}
                                setEditingTodo={setEditingTodo}
                                setShowModal={setShowEditModal}
                            />
                        )
                    })}
                </Carousel>
                <CustomModal
                    className="edit-Todo-modal"
                    title={'Edit TodoList'}
                    width="edit"
                    show={showEditModal}
                    onHide={() => {
                        setShowEditModal(false)
                    }}
                >
                    <EditTodo
                        data={{ ...editingTodo }}
                        index={clickIndex}
                        todos={todos}
                        setTodos={(todos) => {
                            setTodos(todos)
                        }}
                        setShow={(b) => setShowEditModal(b)}
                        setMessage={(m) => setMessage(m)}
                        setIsError={(e) => setIsError(e)}
                        setIsSuccess={(s) => setIsSuccess(s)}
                        excludeDates={excludeDates}
                    />
                </CustomModal>
            </div>
        </div>
    )
}

export default Todos
