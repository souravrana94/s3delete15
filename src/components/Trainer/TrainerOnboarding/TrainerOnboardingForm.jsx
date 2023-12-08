/* eslint-disable no-unused-vars */
import React, { forwardRef, useEffect, useState, useContext } from 'react'
import PropTypes from 'prop-types'
import Form from '../../Common/Form/Form'
import axios from '../../../store/axios-secure'
import Loader from '../../Common/Loader'
import ErrorPage from '../../Common/ErrorPage/InternalServerErrorPage'
import { useHistory } from 'react-router'
import AppContext from '../../../store/context'

const Onboarding = () => {
    const [isError, setIsError] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    const [form, setForm] = useState([])
    const [transformations, setTransformations] = useState([])
    const history = useHistory()
    const userContext = useContext(AppContext)

    const trainerOnboardingForm = [
        {
            label: 'Phone no.',
            type: 'number',
            placeholder: 'Enter your 10 digit Phone no.',
            fieldName: 'phoneNumber',
            required: true,
            classNames: 'col-lg-6 col-md-12',
            inputClassNames: 'white-border',
            inputLabel: '+91',
            labelClass: 'phone',
            validation: {
                required: true,
                minLength: 10,
                errorMessage: 'Please Enter a valid phone number',
                maxLength: 10,
            },
            maxLength: 10,
        },
        {
            label: 'DOB',
            type: 'date-picker',
            classNames: 'col-lg-3 col-md-4',
            required: true,
        },
        {
            type: 'gender-selection',
            classNames: 'col-lg-3 col-md-6',
        },
        // {
        //     label: 'Experience',
        //     type: 'number',
        //     fieldName: 'experience',
        //     placeholder: 'Select yrs. of experience',
        //     classNames: 'col-md-6',
        //     inputClassNames: 'white-border',
        //     labelClass: 'experience',
        //     maxLength: 2,
        // },
        // {
        //     label: 'People Trained',
        //     type: 'number',
        //     fieldName: 'peopleTrained',
        //     placeholder: 'Approx. People Trained',
        //     classNames: 'col-md-6',
        //     inputClassNames: 'white-border',
        //     labelClass: 'experience',
        //     maxLength: 5,
        // },
        // // {
        // //     label: 'Expertise',
        // //     type: 'dynamic-dropdown',
        // //     fieldName: 'expertise',
        // //     canCreate: true,
        // //     classNames: 'col-md-8',
        // //     placeholder: 'Select your expertise',
        // //     multi: true,
        // //     options: [],
        // //     maxCharLength: 15,
        // //     required: true,
        // //     maxOptions: 3,
        // //     minOptions: 1,
        // //     validation: {
        // //         errorMessage: 'Please enter between 1 to 3 expertise',
        // //     },
        // // },
        // {
        //     label: 'Certificate',
        //     type: 'dynamic-dropdown',
        //     fieldName: 'certificateName',
        //     canCreate: true,
        //     classNames: 'col-md-8',
        //     //inputContainerClass: 'certificate-input-container',
        //     placeholder: 'Select your Certification',
        //     options: [],
        //     maxCharLength: 20,
        //     validation: {
        //         errorMessage: 'Please enter valid name',
        //     },
        // },
        // {
        //     type: 'upload-button',
        //     fieldName: 'certificateFile',
        //     buttonText: 'Upload Your Certificate',
        //     classNames: 'col-md-4',
        //     requiredDependsOn: 'certificateName',
        //     onChange: (e) => {
        //         if (
        //             !['image/png', 'image/jpeg'].includes(
        //                 e.target.files[0].type,
        //             )
        //         ) {
        //             return 'Please upload a valid png or jpg file'
        //         } else if (e.target.files[0].size > 5000000) {
        //             return 'Please upload a file less than 5MB.'
        //         }
        //         return null
        //     },
        // },
        // {
        //     type: 'upload-button',
        //     fieldName: 'proofFile',
        //     buttonText: 'Aadhar Card(Front & Back) in pdf',
        //     acceptableFileExtensions: ['.pdf'],
        //     classNames: 'col-md-4',
        //     required: false,
        //     onChange: (e) => {
        //         if (e.target.files[0].type !== 'application/pdf') {
        //             return 'Please upload a valid pdf file'
        //         } else if (e.target.files[0].size > 5000000) {
        //             return 'Please upload a file less than 5MB.'
        //         }
        //         return null
        //     },
        // },
        // {
        //     label: 'Interests',
        //     type: 'dynamic-dropdown',
        //     fieldName: 'interests',
        //     canCreate: true,
        //     classNames: 'col-md-8',
        //     placeholder: 'Select your Interests',
        //     multi: true,
        //     options: [],
        //     maxCharLength: 20,
        //     required: true,
        //     minOptions: 1,
        //     maxOptions: 15,
        //     validation: {
        //         errorMessage: 'Please enter between 1 to 15 interests',
        //     },
        // },
        {
            type: 'color-selection',
            classNames: 'col-md-12',
        },
        // {
        //     label: 'Tagline',
        //     type: 'text',
        //     fieldName: 'tagline',
        //     placeholder: 'Select your tagline (Max 20 characters)',
        //     classNames: 'col-md-12',
        //     inputClassNames: 'white-border',
        //     labelClass: 'experience',
        //     validation: {
        //         maxLength: 20,
        //         errorMessage: 'Maximum characters allowed is 20',
        //     },
        //     maxLength: 20,
        // },
        // {
        //     label: 'Description',
        //     type: 'textarea',
        //     fieldName: 'description',
        //     placeholder:
        //         'Write about yourself, your journey into fitness and anything which will make people intrested in training with you',
        //     classNames: 'col-md-12',
        //     inputClassNames: 'white-border',
        //     labelClass: 'description',
        //     validation: {
        //         minLength: 50,
        //         errorMessage:
        //             'Please enter description of atleast 50 characters',
        //     },
        //     maxLength: 999999,
        // },
        // {
        //     type: 'transformations',
        // },
    ]
    const convertToLabelName = (options) => {
        return options?.map((option) => {
            return {
                value: option,
                label: option,
            }
        })
    }

    const fetchOptions = async () => {
        setIsLoading(true)
        try {
            // const expertiseResponse = await axios.get(
            //     'workout/admin/trainer-expertise/all',
            // )
            // const certificateResponse = await axios.get(
            //     'workout/admin/certificate-name/all',
            // )
            const formOptionsResponse = await axios.get(
                'admin/formOptions/trainerOnboarding',
            )
            const formOptions = formOptionsResponse?.data
            const formCopy = [...trainerOnboardingForm]
            // formCopy[5] = {
            //     ...formCopy[5],
            //     options: convertToLabelName(formOptions?.expertiseOptions),
            // }
            // formCopy[5] = {
            //     ...formCopy[5],
            //     options: convertToLabelName(formOptions?.certificationOptions),
            // }
            // formCopy[9] = {
            //     ...formCopy[9],
            //     options: convertToLabelName(formOptions?.interestOptions),
            // }
            setForm(formCopy)
        } catch (error) {
            setIsError(true)
        }
        setIsLoading(false)
    }

    const submitData = async (data) => {
        if (data) {
            setIsLoading(true)
            const response = await axios.post(`trainers/add`)
            userContext.setProfileRef(response?.data?.profileRef)
            setIsLoading(false)
            history.push('/')
        }
    }

    const modifier = (data) => {
        transformations?.forEach((tu, idx) => {
            let file = new File(
                [tu.imgUrl],
                `Transformation_${idx + 1}_${tu.name.replace(/\s+/g, '')}`,
                {
                    type: tu?.imgUrl?.type,
                },
            )
            console.log(URL.createObjectURL(file))
            transformations[idx].imgUrl = file
        })
        data['transformations'] = transformations
        const aadhar = new File(data['proofFile'], `AadharCard`, {
            type: data['proofFile'][0]?.type,
        })
        const certificate = new File(
            data['certificateFile'],
            `Certificate_${data.certificateName}`,
            {
                type: data['certificateFile'][0]?.type,
            },
        )

        if (data['displayPicture'].length) {
            const display = new File(data['displayPicture'], `displayPicture`, {
                type: data['displayPicture'][0].type,
            })
            data['displayPicture'] = display
        }
        data['proofFile'] = aadhar
        data['certificateFile'] = certificate
        return data
    }

    const submitHandler = async (data) => {
        const formData = new FormData()
        Object.keys(data).forEach((key) => {
            if (key === 'proofFile') {
                if (data[key].length != 0) {
                    formData.append(key, Array.from(data?.proofFile)[0])
                }
            } else if (key === 'certificateFile') {
                if (data[key].length != 0) {
                    formData.append(key, Array.from(data?.certificateFile)[0])
                }
            } else if (key === 'displayPicture') {
                if (data[key].length != 0) {
                    formData.append(key, Array.from(data?.displayPicture)[0])
                }
            } else {
                formData.append(key, data[key])
            }
        })
        return formData
    }

    useEffect(() => {
        // if (!isProfileComplete) {
        //     fetchOptions()
        // } else if (!verified) {
        //     setIsLoading(false)
        // }
        fetchOptions()
    }, [])

    const profileForm = (
        <>
            <Form
                classNames="container"
                formDetails={form}
                formName={'Trainer Onboarding'}
                requestType="post"
                showTitle={false}
                postUrl={'trainers/profile/add'}
                resetFormOnSubmit={true}
                callback={(data) => submitData(data)}
                previewCard={true}
                transformations={transformations}
                setTransformations={setTransformations}
                modifier={(data) => submitHandler(data)}
            />
            <small className="text-danger">{error}</small>
        </>
    )

    const verifiedPage = (
        <h2 className="text-center mt-5">Verification Under Progress</h2>
    )

    return isLoading ? <Loader /> : isError ? <ErrorPage /> : profileForm
}

Onboarding.propTypes = {
    callback: PropTypes.func,
    update: PropTypes.bool,
    defaultValues: PropTypes.object,
}

export default Onboarding
