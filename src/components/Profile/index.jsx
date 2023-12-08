import React from 'react'
import { NavLink, Route } from 'react-router-dom'
import PropTypes from 'prop-types'
import routes from './profileRoutes'
import AccountHeader from './Components/AccountHeader'
import './index.scss'
import { Icon } from '@iconify/react'

const Profile = ({ match }) => {
    console.log(match)
    const sideNavList = () => (
        <ul className="side-profile-nav">
            {routes.map((navItem, index) => (
                <li key={index} className="side-nav">
                    <NavLink
                        activeClassName="active"
                        className="side-nav-link"
                        to={`${match.url}/${navItem.path}`}
                        exact={navItem.exact}
                    >
                        <Icon height={35} color="white" icon={navItem.icon} />
                        <span className="p-1 ps-3">{navItem.name}</span>
                    </NavLink>
                </li>
            ))}
        </ul>
    )

    const componentRoutes = () =>
        routes.map((navItem, idx) => (
            <Route
                key={idx}
                exact
                path={`${match.path}/${navItem.path}`}
                render={(props) => <navItem.component {...props} />}
            />
        ))

    return (
        <div className="profile-page">
            <div className="profile-page-container container">
                <div className="profile-page-container-content">
                    <div className="profile-sidebar">
                        <AccountHeader /> {sideNavList()}
                    </div>
                    <div className="profile-component-container">
                        {componentRoutes()}
                    </div>
                </div>
            </div>
        </div>
    )
}

Profile.propTypes = {
    match: PropTypes.object,
}

export default Profile
