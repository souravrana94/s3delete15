import React from 'react'
import PropTypes from 'prop-types'
import './index.scss'

const ErrorImage =
    'https://storage.googleapis.com/evolv-assets/MVP/ErrorImage.png'

const ErrorPage = ({ errorType, customType, customMessage }) => {
    const errorMessage = customType
        ? customType
        : errorType === '404'
        ? '404 Page Not Found'
        : '500 Internal Server Error'

    const errorSubMessage = customMessage
        ? customMessage
        : errorType === '404'
        ? 'Maybe this page has been moved or got deleted. Or maybe it never existed in the first place?'
        : 'Something went wrong! We are looking to see what happened.'

    return (
        <div className="empty-cart-container">
            <img className="empty-cart-icon" src={ErrorImage} alt="no-item" />
            <p className="text">{errorMessage}</p>
            <p className="small-text">{errorSubMessage}</p>
        </div>
    )
}

ErrorPage.propTypes = {
    errorType: PropTypes.string,
    customMessage: PropTypes.string,
    customType: PropTypes.string,
}

export default ErrorPage
