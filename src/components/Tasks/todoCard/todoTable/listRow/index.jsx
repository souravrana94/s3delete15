import React from 'react'
import './index.scss'
import ReactTooltip from 'react-tooltip'
import { renderToString } from 'react-dom/server'
import { Icon } from '@iconify/react'
import { FaAdjust } from 'react-icons/fa'

const ListRow = ({ list, idx, past }) => {
    let totalItems = 0
    let checkedItems = 0
    if (past) {
        for (let i = 0; i < list.items?.length; i++) {
            totalItems++
            if (list.items[i]?.isChecked) {
                checkedItems++
            }
        }
    }
    const getTooltipContent = (items) => {
        const stringData = renderToString(
            <div className="Items">
                {items.map((item, idx) => {
                    return (
                        <div className="itemrow" key={idx}>
                            <div className="item">
                                <span>
                                    {item.isChecked ? (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="15"
                                            height="15"
                                            viewBox="0 0 512 512"
                                        >
                                            <path
                                                fill="#7FD18C"
                                                d="M400 48H112a64.07 64.07 0 0 0-64 64v288a64.07 64.07 0 0 0 64 64h288a64.07 64.07 0 0 0 64-64V112a64.07 64.07 0 0 0-64-64Zm-35.75 138.29l-134.4 160a16 16 0 0 1-12 5.71h-.27a16 16 0 0 1-11.89-5.3l-57.6-64a16 16 0 1 1 23.78-21.4l45.29 50.32l122.59-145.91a16 16 0 0 1 24.5 20.58Z"
                                            />
                                        </svg>
                                    ) : (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="15"
                                            height="15"
                                            viewBox="0 0 32 32"
                                        >
                                            <path
                                                fill="currentColor"
                                                d="M26 4H6a2 2 0 0 0-2 2v20a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2ZM6 26V6h20v20Z"
                                            />
                                        </svg>
                                    )}
                                    {item.item}
                                </span>
                            </div>
                        </div>
                    )
                })}
            </div>,
        )

        return stringData
    }
    const rand = Math.random()
    return (
        <div className="listRow">
            {past ? (
                <>
                    <div className="category">{list.category}</div>
                    <div className="percent">{`${checkedItems}/${totalItems}`}</div>
                </>
            ) : (
                <div className="category"> {`${list.category}`}</div>
            )}

            <div className="item" data-for={`getContent-${rand}`} data-tip>
                {' '}
                <ReactTooltip
                    className="tooltip-container"
                    id={`getContent-${rand}`}
                    getContent={() => getTooltipContent(list.items)}
                    html={true}
                />
                {list?.items[0]?.item}
            </div>
        </div>
    )
}
export default ListRow
