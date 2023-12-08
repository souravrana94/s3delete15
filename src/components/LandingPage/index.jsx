import React, { useState } from 'react'
import Auth from '../Authentication/common/AuthScreen'
import { Modal } from 'react-bootstrap'
import ErrorPage from '../Common/ErrorPage'
import './index.scss'
import Menu from './menu'

const Logo = 'https://storage.googleapis.com/evolv-assets/brand/EvolvLogo.png'
const LaptopImg =
    'https://storage.googleapis.com/evolv-assets/trainers/landingImage.png'

const LandingPage = () => {
    const [isError, setIsError] = useState(false)
    const [showAuthModal, setShowAuthModal] = useState(false)
    const loginTrainer = () => {
        setShowAuthModal(true)
    }

    const displayData = (
        <div className="bodyLanding">
            <Modal
                show={showAuthModal}
                centered
                contentClassName="modal-content"
            >
                <Auth setShowAuthModal={setShowAuthModal} />
            </Modal>
            <div className="row hero-container">
                <div className="col-md-8 info-section">
                    <div className="logo">
                        <img src={Logo} className="logo-img" alt="logo" />
                        <h1 className="logo-heading">EVOLV FIT</h1>
                    </div>
                    <h1 className="info-heading">
                        train{' '}
                        <span style={{ color: 'rgba(56, 204, 158, 1)' }}>
                            smart
                        </span>
                    </h1>
                    <p className="info-text">
                        Manage all your clients in one place.
                        <br />
                        Get new clients by showing your profile.
                        <br />
                        Make workouts and give feedback.{' '}
                    </p>
                    <div onClick={loginTrainer} className="sign-btn">
                        <h3 className="sign-btn-text">Sign in</h3>
                    </div>
                </div>
                <div className="col-md-4 hero-area">
                    <img
                        src={LaptopImg}
                        className="hero-img"
                        alt="image loading"
                    />
                </div>
            </div>

            <Menu />
        </div>
    )

    return <div>{isError ? <ErrorPage /> : displayData}</div>
}

export default LandingPage
