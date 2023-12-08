import React, { useState, useEffect } from 'react'
import PreviewCard from '../../../Common/Form/PreviewCardContainer/PreviewCard'
import axios from '../../../../store/axios-secure'
import EditableRow from '../EditableRow'
import './index.scss'
import Loader from '../../../Common/Loader'
import ErrorPage from '../../../Common/ErrorPage'
import Slider, { Range } from 'rc-slider'
import 'rc-slider/assets/index.css'

const ProfileTab = () => {
    const [previewCard, setPreviewCard] = useState({
        tagline: '',
        peopleTrained: '',
        idx: 0,
        displayPictureUrl: '',
    })
    const convertToLabelName = (options) => {
        return options?.map((option) => {
            return {
                value: option,
                label: option,
            }
        })
    }
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    const [details, setDetails] = useState([])
    const [progress, setProgress] = useState(0)
    useEffect(async () => {
        try {
            setIsLoading(true)
            const profile = await axios('trainers/profile/profile')
            const profileData = profile.data
            let tempProgress = 10
            Object.entries(profileData).forEach((val) => {
                if (val[1] == '' || val[1] == []) {
                    tempProgress = tempProgress - 1
                    // console.log(val[1])
                }
            })
            setProgress(tempProgress)
            setPreviewCard({
                tagline: profileData.tagline,
                peopleTrained: profileData.peopleTrained,
                idx: Number(profileData.themeColor),
                displayPictureUrl: profileData.displayPictureUrl,
            })
            let updatedTransformations = profileData.transformations ?? []
            updatedTransformations.map((item) => {
                item['isEditing'] = false
            })
            const formOptionsResponse = await axios.get(
                'admin/formOptions/trainerOnboarding',
            )
            const formOptions = formOptionsResponse?.data
            const expertiseOptions = convertToLabelName(
                formOptions?.expertiseOptions,
            )
            const certificationOptions = convertToLabelName(
                formOptions?.certificationOptions,
            )
            const interestOptions = convertToLabelName(
                formOptions?.interestOptions,
            )
            const details = [
                {
                    type: 'previewCard',
                    classNames: 'col-md-12',
                    fieldName: 'displayPicture',
                    validateSubmit: (data, value) => {
                        return {
                            isError: false,
                        }
                    },
                },
                {
                    label: 'Experience',
                    fieldName: 'experience',
                    initialValue: profileData.experience,
                    validateSubmit: (data, value) => {
                        return {
                            isError: false,
                        }
                    },
                    type: 'number',
                    placeholder: 'Experience',
                    classNames: 'col-md-12',
                    maxLength: 2,
                },
                {
                    fieldName: 'peopleTrained',
                    validateSubmit: (data, value) => {
                        return {
                            isError: false,
                        }
                    },
                    type: 'number',
                    classNames: 'col-md-12',
                    placeholder: 'peopleTrained',
                    label: 'People Trained',
                    initialValue: profileData.peopleTrained,
                    maxLength: 5,
                },
                {
                    label: 'Expertise',
                    type: 'dynamic-dropdown',
                    options: expertiseOptions,
                    fieldName: 'expertise',
                    canCreate: true,
                    classNames: 'col-md-12',
                    placeholder: 'Select your expertise',
                    multi: true,
                    required: false,
                    initialValue: profileData.expertise.map((val) => {
                        return {
                            label: val,
                            value: val,
                        }
                    }),
                    validateSubmit: (data, value) => {
                        if (value?.length != 3) {
                            return {
                                isError: true,
                                message: 'Please enter exactly 3 fields',
                            }
                        }
                        return {
                            isError: false,
                        }
                    },
                    maxCharLength: 15,
                    maxOptions: 3,
                },
                // {
                //     label: 'Certificate',
                //     type: 'dynamic-dropdown',
                //     fieldName: 'certificateName',
                //     canCreate: true,
                //     classNames: 'col-md-12',
                //     placeholder: 'Enter certificate name',
                //     multi: false,
                //     required: false,
                //     initialValue: [profileData.certificateName],
                //     maxCharLength: 30,
                //     validateSubmit: (data, value) => {
                //         return {
                //             isError: false,
                //         }
                //     }
                // },
                {
                    type: 'upload-cert',
                    fieldName: 'certificate',
                    options: certificationOptions,
                    classNames: 'col-md-12',
                    buttonText: 'Upload your certificate',
                    label: 'Certificate',
                    validateSubmit: (data, value) => {
                        return {
                            isError: false,
                        }
                    },
                    maxOptions: 1,
                    placeholder: 'Enter certificate name',
                    multi: false,
                    required: false,
                    initialValue: {
                        label: profileData.certificateName,
                        value: profileData.certificateName,
                    },
                    certificateUrl: profileData.certificateUrl,
                    maxCharLength: 30,
                },
                {
                    type: 'aadhar',
                    fieldName: 'aadhar',
                    label: 'Aadhar',
                    fileURL: profileData.aadharUrl,
                },
                {
                    label: 'Interests',
                    maxCharLength: 15,
                    options: interestOptions,
                    type: 'dynamic-dropdown',
                    fieldName: 'interests',
                    canCreate: true,
                    classNames: 'col-md-12',
                    placeholder: 'Select your interests',
                    multi: true,
                    required: false,
                    initialValue: () =>
                        profileData.interests?.map((val) => {
                            return {
                                label: val,
                                value: val,
                            }
                        }),
                    maxOptions: 20,
                    validateSubmit: (data, value) => {
                        if (value?.length < 3 || value?.length >= 15) {
                            return {
                                isError: true,
                                message:
                                    'Please enter options between 3 and 15',
                            }
                        }
                        return {
                            isError: false,
                        }
                    },
                },
                /////added later for trainer upi ID

                {
                    label: 'UPI ID',
                    fieldName: 'UPIid',
                    initialValue: profileData.UPIid,
                    validateSubmit: (data, value) => {
                        return {
                            isError: false,
                        }
                    },
                    type: 'text',
                    placeholder: 'UPI ID',
                    classNames: 'col-md-12',
                    maxLength: 50,
                },
                {
                    type: 'UPIQRCode',
                    fieldName: 'QRCode',
                    label: 'UPI QR Code',
                    buttonText: 'Upload UPI QR Code',
                    fileURL: profileData.QRCodeUrl,
                },
                ///////////////////
                {
                    fieldName: 'tagline',
                    validateSubmit: (data, value) => {
                        return {
                            isError: false,
                        }
                    },
                    type: 'text',
                    classNames: 'col-md-12',
                    placeholder: 'Tagline',
                    label: 'Tagline',
                    initialValue: profileData.tagline,
                    maxLength: 20,
                },
                {
                    label: 'Description',
                    type: 'textarea',
                    fieldName: 'description',
                    placeholder:
                        'Write about yourself, your journey into fitness and anything which will make people intrested in training with you',
                    classNames: 'col-md-12',
                    inputClassNames: 'white-border',
                    validateSubmit: (data, value) => {
                        if (value?.length <= 50) {
                            return {
                                isError: true,
                                message: 'Please enter minimum 50 characters',
                            }
                        }
                        return {
                            isError: false,
                        }
                    },
                    initialValue: profileData.description,
                    maxLength: 99999,
                    divClassNames: 'text-area',
                },
                {
                    label: 'Theme Color',
                    type: 'color-picker',
                    fieldName: 'themeColor',
                    classNames: 'col-md-12',
                    initialValue: Number(profileData.themeColor),
                    validateSubmit: (data, value) => {
                        return {
                            isError: false,
                        }
                    },
                },
                {
                    type: 'transformations',
                    fieldName: 'transformations',
                    classNames: 'profile-transformation-div',
                    label: 'Transformations',
                    secondaryLabel: 'Transformations',
                    validateSubmit: (data, value) => {
                        return {
                            isError: false,
                        }
                    },
                    initialValue: updatedTransformations,
                },
            ]
            setDetails(details)
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
        <div className="profile-container">
            <p className="heading">Profile</p>
            <div className="profile-progress-bar">
                <p className="progress-header">
                    Complete your profile to get listed on the app
                </p>
                <div className="progress-bar-div">
                    <Slider
                        className="slider"
                        trackStyle={{
                            backgroundColor: '#38CC9E',
                            height: '10px',
                        }}
                        railStyle={{
                            backgroundColor: '#101317',
                            height: '10px',
                        }}
                        max={10}
                        min={0}
                        defaultValue={progress}
                    />
                    <p className="progress-text">
                        {progress == 0 ? '' : progress}0% completed
                    </p>
                </div>
            </div>
            {details.map((detail, idx) => {
                return (
                    <EditableRow
                        key={idx}
                        details={detail}
                        setPreviewCard={setPreviewCard}
                        previewCard={previewCard}
                    />
                )
            })}
        </div>
    )
}

export default ProfileTab
