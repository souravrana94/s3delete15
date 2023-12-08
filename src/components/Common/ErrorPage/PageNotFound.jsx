import React from 'react'
import ErrorPage from './index'
import './index.scss'

const PageNotFound = () => {
    return <ErrorPage errorType={'404'} />
}

export default PageNotFound
