import React from 'react'
import ErrorPage from './index'
import './index.scss'

const InternalServerErrorPage = () => {
    return <ErrorPage errorType={'500'} />
}

export default InternalServerErrorPage
