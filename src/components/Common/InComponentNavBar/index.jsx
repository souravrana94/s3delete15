import React from 'react'
import PropTypes from 'prop-types'
import { useState } from 'react'

import './index.scss'

const InComponentNavBar = ({ navitems }) => {
    const [selectedIdx, setSelectedIdx] = useState(0)

    return (
        <div className="container navitem-container">
            <div className="header">
                {navitems.map((navitem, idx) => (
                    <span
                        onClick={() => setSelectedIdx(idx)}
                        key={idx}
                        className={`navitem ${
                            selectedIdx === idx && 'selected'
                        }`}
                    >
                        {navitem.title}
                    </span>
                ))}
            </div>
            <div className="content-container w-100">
                {navitems[selectedIdx].component}
            </div>
        </div>
    )
}

InComponentNavBar.propTypes = {
    navitems: PropTypes.array,
}

export default InComponentNavBar
