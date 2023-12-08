import React, { useCallback, useEffect, useState } from 'react'
import { Dropdown } from 'react-bootstrap'
import { useHistory, useLocation } from 'react-router-dom'
import { Link } from 'react-router-dom'
import auth from '../../../firebase-config'
import { signOut } from 'firebase/auth'
import Search from '../../Trainer/Dashboard/Search/Search'
import './index.scss'
import { useContext } from 'react'
import profileRoutes from '../../Profile/profileRoutes'
import AppContext from '../../../store/context'
import { Icon } from '@iconify/react'
const AddExercise = React.lazy(() =>
    import('../../Profile/Components/AddExercise'),
)
const PaymentsPage = React.lazy(() =>
    import('../../../components/Profile/Components/Payments'),
)
const Navbar = () => {
    const [showShadowClass, setShowShadowClass] = useState('')
    const location = useLocation()
    const history = useHistory()
    const userContext = useContext(AppContext)
    // useEffect(() => {
    //     if (auth.currentUser.email === process.env.REACT_APP_ADMIN_MAIL) {
    //         if (
    //             profileRoutes.filter((obj) => obj.path === 'payments').length ==
    //             0
    //         ) {
    //             profileRoutes.push({
    //                 path: 'payments',
    //                 exact: true,
    //                 component: PaymentsPage,
    //                 name: 'Payments',
    //                 icon: 'bi-wallet-fill',
    //             })
    //         }
    //     }
    // }, [])
    const logout = () => {
        signOut(auth)
        userContext.setProfileRef(null)
        history.push('/')
    }
    // TODO @rt Find a better method. To Many rerenders
    const handleUserKeyPress = useCallback(() => {
        var scrolled = document.scrollingElement.scrollTop
        if (scrolled >= 10) {
            // TODO remove if not needed
            // setShowShadowClass('scrolled')
        } else {
            setShowShadowClass('')
        }
    }, [])

    useEffect(() => {
        window.addEventListener('scroll', handleUserKeyPress)

        return () => {
            window.removeEventListener('scroll', handleUserKeyPress)
        }
    }, [handleUserKeyPress])

    return (
        <>
            {auth.currentUser ? (
                <div
                    className={`navbar sticky-top store-navbar ${showShadowClass}`}
                >
                    <div className="logoContainer">
                        <Link
                            className="navbar-brand"
                            to={
                                userContext.profileRef
                                    ? '/'
                                    : '/trainer-onboarding'
                            }
                        >
                            <img
                                src="/images/evolvfitwhite.svg"
                                alt="Evolv Fit"
                                className="navbar-evolv-logo"
                                width="48px"
                                height="40px"
                            />
                        </Link>
                        <h3>
                            EVOLV
                            <br />
                            <span>FIT</span>
                        </h3>
                    </div>
                    {location.pathname == '/' && userContext.verified ? (
                        <Search />
                    ) : (
                        ''
                    )}
                    <div className="navbar-right-content">
                        <div className="profile-dropdown-right-content">
                            <Dropdown>
                                <Dropdown.Toggle
                                    variant="none"
                                    id="dropdown-basic"
                                    className="dropdown-toggle"
                                >
                                    <img
                                        src={auth?.currentUser?.photoURL}
                                        //alt="Profile"
                                        className="profile-icon"
                                    />
                                </Dropdown.Toggle>
                                <Dropdown.Menu className="dropdown-container">
                                    {userContext.verified ? (
                                        <>
                                            {profileRoutes.map((item, idx) => (
                                                <Dropdown.Item
                                                    key={idx}
                                                    className="custom-dropdown-item"
                                                    as={Link}
                                                    to={`/profile/${item.path}`}
                                                >
                                                    <div className="dropdown-item-container">
                                                        <Icon
                                                            height={43}
                                                            color="white"
                                                            icon={item.icon}
                                                        />
                                                        <p>{item.name}</p>
                                                    </div>
                                                </Dropdown.Item>
                                            ))}
                                        </>
                                    ) : null}

                                    <button
                                        className="logout-button"
                                        onClick={logout}
                                    >
                                        {'Log out'}
                                    </button>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    )
}

export default Navbar
