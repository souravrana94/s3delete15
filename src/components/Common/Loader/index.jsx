import React from 'react'
import PropTypes from 'prop-types'
import './index.scss'

const Loader = ({ fullscreen = false, fullHeight = false }) => {
    return fullscreen ? (
        <>
            <div className={`loading-bg`}>
                <span className="spinner-border spinner-border-sm"></span>
            </div>
        </>
    ) : fullHeight ? (
        <div className="full-height-div">
            <Loader />
        </div>
    ) : (
        <div className="text-center">
            <span className="spinner-border spinner-border-sm"></span>
        </div>
    )
}

Loader.propTypes = {
    fullscreen: PropTypes.bool,
    fullHeight: PropTypes.bool,
}

export default Loader
