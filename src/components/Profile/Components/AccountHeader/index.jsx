import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

import './index.scss'
import auth from '../../../../firebase-config'
import { useContext } from 'react'
import AppContext from '../../../../store/context'

const DefaultProfileIcon =
    'https://storage.googleapis.com/evolv-store/icons/auth/profile.jpg'

const AccountHeader = ({ classNames = '' }) => {
    const { currentUser } = auth
    const userContext = useContext(AppContext)
    return (
        <>
            <div className={`profile-image-text ${classNames}`}>
                <div className="profile-container">
                    <img
                        className="profile-image"
                        src={userContext?.profilePicture}
                    />
                </div>

                <div className="name-container">
                    <h6 className="fullname">{currentUser?.displayName}</h6>
                    <p className="username">{currentUser?.email}</p>
                </div>
            </div>
        </>
    )
}

AccountHeader.propTypes = {
    classNames: PropTypes.string,
}

export default AccountHeader
