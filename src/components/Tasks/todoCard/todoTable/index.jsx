import React from 'react'
import './index.scss'
import ListRow from './listRow'

const TodoTable = ({ lists, past }) => {
    return (
        <div className="todoTable">
            <div className="rowHeading">
                <div className="category">Category</div>
                {past && <div className="empty"></div>}
                <div className="list">Items</div>
            </div>
            {lists.map((list, idx) => {
                return <ListRow list={list} idx={idx} past={past} key={idx} />
            })}
        </div>
    )
}

export default TodoTable
