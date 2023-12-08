import React, { useState, useEffect } from 'react'
import './index.scss'
import Button from '../../../../Common/Button'
import TextArea from '../../../../Common/Form/TextArea'
import { Icon } from '@iconify/react'
const EditRow = ({ list, index, todo, setTodo }) => {
    const setList = (value, idx) => {
        let todoList = { ...todo }
        todoList.lists[index].items[idx].item = value
        setTodo({ ...todoList })
    }
    const removeItem = (idx) => {
        list.items.splice(idx, 1)
        let todoList = { ...todo }
        todoList.lists[index] = list
        setTodo({ ...todoList })
    }
    const addItem = () => {
        let listItems = [...list.items, { isChecked: false, item: '' }]
        let todoList = { ...todo }
        todoList.lists[index].items = listItems
        console.log(todo)
        setTodo({ ...todoList })
    }
    return (
        <div className="editable-row">
            <div className="list-header">
                <div className="category">{list.category}</div>
                <div>
                    <Button
                        disabled={false}
                        type="button"
                        classNames="add-category-btn add-button"
                        text={'+ Item'}
                        onClick={() => {
                            addItem()
                        }}
                    />
                </div>
            </div>
            {list.items.map((item, idx) => {
                return (
                    <div
                        key={idx}
                        className="item"
                        // onClick={setEditItemIndex(idx)}
                    >
                        {item.item == 'Finish Workout' ||
                        item.item == 'Finish Steps' ||
                        item.item == 'Add Weight' ? (
                            <div>{item.item}</div>
                        ) : (
                            <div className="text-area">
                                <TextArea
                                    rows="1"
                                    value={item.item ?? ''}
                                    className="editable-item"
                                    onChange={(e) => {
                                        setList(e.target.value, idx)
                                        e.preventDefault()
                                    }}
                                />
                                <Icon
                                    icon={'ep:close-bold'}
                                    height={18}
                                    width={18}
                                    className="close-exercise"
                                    onClick={() => {
                                        removeItem(idx)
                                    }}
                                />
                            </div>
                        )}
                    </div>
                )
            })}
            <div></div>
        </div>
    )
}

export default EditRow
