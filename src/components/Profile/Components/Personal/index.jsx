import React, { useState, useEffect } from 'react'
import EditableRow from '../EditableRow'
import axios from '../../../../store/axios-secure'

import './index.scss'
import Loader from '../../../Common/Loader'
import ErrorPage from '../../../Common/ErrorPage'

const Personal = () => {
    const [details, setDetails] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    useEffect(async () => {
        try {
            setIsLoading(true)
            const personal = await axios('trainers/profile/personal')
            const profileData = personal.data
            const details = [
                {
                    label: 'Phone Number',
                    fieldName: 'phoneNumber',
                    initialValue: profileData.phoneNumber,
                    validateSubmit: (data, value) => {
                        return {
                            isError: false,
                        }
                    },
                    type: 'number',
                    classNames: 'col-md-12',
                    placeholder: 'Phone no.',
                    maxLength: 10,
                },
                {
                    fieldName: 'DOB',
                    validateSubmit: (data, value) => {
                        return {
                            isError: false,
                        }
                    },
                    type: 'date-picker',
                    classNames: 'col-md-12',
                    placeholder: 'DOB',
                    label: 'DOB',
                    initialValue: new Date(profileData.DOB),
                },
                {
                    fieldName: 'gender',
                    initialValue: profileData.gender,
                    validateSubmit: (data, value) => {
                        return {
                            isError: false,
                        }
                    },
                    type: 'gender-selection',
                    classNames: 'col-md-12',
                    placeholder: 'Gender Selection',
                },
            ]
            setDetails(details)
            console.log(profileData)
            setIsLoading(false)
        } catch (error) {
            setIsError(true)
        }
    }, [])
    return isLoading ? (
        <Loader fullHeight />
    ) : isError ? (
        <ErrorPage />
    ) : (
        <div className="personal-container">
            <p className="heading">Personal</p>
            {details.map((detail, idx) => {
                return (
                    <EditableRow
                        key={idx}
                        details={detail}
                        url="trainers/profile/personal"
                    />
                )
            })}
        </div>
    )
}

export default Personal
