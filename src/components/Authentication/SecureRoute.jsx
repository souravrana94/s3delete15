import React from 'react'
import PropTypes from 'prop-types'
import { Route } from 'react-router-dom'
import auth from '../../firebase-config'
import Unauthenticated from './Unauthenticated'

const SecureRoute = ({ path, component, exact = true }) => {
    const { currentUser } = auth
    if (currentUser) {
        return <Route path={path} component={component} exact={exact} />
    } else {
        return <Route path={path} component={Unauthenticated} exact={exact} />
    }
}

SecureRoute.propTypes = {
    path: PropTypes.string,
    component: PropTypes.object,
    exact: PropTypes.bool,
    role: PropTypes.array,
}

export default SecureRoute
