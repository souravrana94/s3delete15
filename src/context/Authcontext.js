import React, { createContext, useState } from 'react'
import PropTypes from 'prop-types'

export const AuthContext = createContext({})

export const AuthContextProvider = (props) => {
    const [modalState, setModalState] = useState('login')
    const [isLoginRegister, setisLoginRegister] = useState({
        redirect: '',
        redirectTo: '',
        text: '',
    })
    const [isSubmitLoading, setisSubmitLoading] = useState(false)
    const [closeButton, setcloseButton] = useState(false)
    const [googleButton, setGoogleButton] = useState(true)
    const [roles, setRoles] = useState([])
    const [formFields, setFormFields] = useState([])
    const [showPrivacyPolicy, setshowPrivacyPolicy] = useState(true)
    const [submitButtonText, setSubmitButtonText] = useState({
        text: '',
        onClick: () => {},
        redirectTo: '',
    })
    const [errorMessage, setErrorMessage] = useState({ text: '', color: '' })
    const [successMessage, setSuccessMessage] = useState({
        text: '',
        color: '',
    })
    const onLoginModal = ({ roles = [], closeButton = true }) => {
        setRoles(roles)
        setGoogleButton(true)
        setModalState('login')
        setSuccessMessage({})
        setcloseButton(closeButton) //Modal size and close icon
        setSubmitButtonText({ text: 'Login' })
        setErrorMessage({ text: '', color: '' })
        setshowPrivacyPolicy(true)
        //setErrorMessage({ text: 'Invalid User', color: 'text-danger' })
    }

    const onMessageModal = (
        modalFlag = false,
        message,
        redirectText = '',
        func = () => {},
    ) => {
        setRoles([])
        setGoogleButton(false)
        setcloseButton(modalFlag)
        setSuccessMessage({
            text: message,
            redirectText,
            func,
        })
        setFormFields([])
        setisLoginRegister({
            text: '',
            func: () => {},
        })
        setSubmitButtonText({ text: '' })
        setErrorMessage({ text: '', color: '' })
        setshowPrivacyPolicy(false)
    }

    return (
        <div className="App">
            <AuthContext.Provider
                value={{
                    roles,
                    googleButton,
                    closeButton,
                    formFields,
                    showPrivacyPolicy,
                    submitButtonText,
                    errorMessage,
                    isLoginRegister,
                    onLoginModal,
                    setErrorMessage,
                    setisSubmitLoading,
                    isSubmitLoading,
                    successMessage,
                    setSuccessMessage,
                    modalState,
                    onMessageModal,
                }}
            >
                {props.children}
            </AuthContext.Provider>
        </div>
    )
}

AuthContextProvider.propTypes = {
    children: PropTypes.element,
}
