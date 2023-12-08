import React from 'react'
import PropTypes from 'prop-types'
import { Link, useHistory } from 'react-router-dom'
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import auth from '../../../firebase-config'
import './index.scss'
import Button from '../../Common/Button'

const CloseButtonIcon =
    'https://storage.googleapis.com/evolv-store/icons/common/close.svg'
const EvolvLogo =
    'https://storage.googleapis.com/evolv-store/icons/common/EvolvLogoBlack.png'

const AuthScreen = ({ setShowAuthModal }) => {
    const closeAuthModal = () => {
        setShowAuthModal(false)
    }

    const signInWithGoogle = () => {
        const provider = new GoogleAuthProvider()
        signInWithPopup(auth, provider)
            .then((result) => {
                setShowAuthModal(false)
            })
            .catch((error) => {
                // Handle Errors here.
                const errorCode = error.code
                const errorMessage = error.message
                // The email of the user's account used.
                const email = error.email
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error)
                console.log(errorMessage)
            })
    }

    return (
        <div className="card card-container auth">
            <div className="close-button" onClick={closeAuthModal}>
                <img
                    className="close-button-icon"
                    src={CloseButtonIcon}
                    alt="close-icon"
                />
            </div>
            <img
                src={EvolvLogo}
                alt="profile-img"
                className="d-flex align-self-center"
                height="80px"
                width="80px"
            />
            <b>
                <h5 className="text-center mt-2 mb-4 companyNameText">
                    EVOLV FIT
                </h5>
            </b>

            <span className="google-login-button">
                <Button
                    onClick={signInWithGoogle}
                    text="Login With Google"
                    color="white"
                    classNames="p-3"
                    iconComponent={'flat-color-icons:google'}
                    iconSize={30}
                />
            </span>
            <div className="row">
                <p className="col-md-12 auth-small-font auth-box text-center">
                    By logging in, you agree to{' '}
                    <Link to="/privacy-policy">
                        {"EvolvFit's Privacy Policy"}
                    </Link>{' '}
                    and <Link to="/terms-of-use">Terms of Use.</Link>
                </p>
            </div>
        </div>
    )
}

AuthScreen.propTypes = {
    onSubmit: PropTypes.func,
}

export default AuthScreen
