import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import PropTypes from 'prop-types'
import axios from '../../../store/axios-secure'
import ListOfValues from './ListOfValues'
import Loader from '../../Common/Loader'
import ErrorPage from '../../Common/ErrorPage/InternalServerErrorPage'
import Button from '../Button'
import InputBox from './InputBox'
import TextArea from './TextArea'
import StarRating from '../StarRating'
import DynamicDropdown from './DynamicDropdown'
import GenderSelection from './GenderSelection'
import UploadFileButton from './UploadFileButton'
import './index.scss'
import ColorSelector from './ColorSelector'
import { Transformations } from './Transformations'
import PreviewCardContainer from './PreviewCardContainer'
import DatePickerComponent from './DatePicker'

const Form = ({
    formDetails,
    postUrl,
    formName,
    formIcon,
    showTitle = true,
    darkTheme = false,
    defaultValues,
    requestType = 'post',
    saveButtonText,
    classNames = '',
    saveForLater = false,
    previewCard = false,
    transformations,
    setTransformations,
    callback = () => {},
    modifier = (data) => {
        return data
    },
}) => {
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    const [error, setError] = useState()
    const [submittedData, setSubmittedData] = useState({})
    const getDefaultForm = () => {
        // console.log(defaultValues)

        let defaultKeyValues = {}

        if (defaultValues) {
            // console.log(defaultValues)
            // Unflatten list
            Object.values(formDetails).forEach((value) => {
                const keyName = value.idFieldName
                    ? value.idFieldName
                    : value.fieldName

                if (value.type === 'flatlist') {
                    defaultKeyValues[value.fieldName] = defaultValues[
                        keyName
                    ].map((v) => {
                        return {
                            [value.subFields[0].fieldName]: v,
                        }
                    })
                } else if (
                    value.type === 'dynamic-dropdown' &&
                    value.multi &&
                    defaultValues[keyName].length > 0 &&
                    typeof defaultValues[keyName][0] === 'object'
                ) {
                    defaultKeyValues[value.fieldName] = defaultValues[
                        keyName
                    ].map((value) => value.id)
                } else {
                    defaultKeyValues[value.fieldName] = defaultValues[keyName]
                }
            })

            return defaultKeyValues
        }

        formDetails.forEach((value) => {
            if (value.type === 'checkbox') {
                defaultKeyValues[value.fieldName] = false
            } else {
                defaultKeyValues[value.fieldName] = ''
            }
        })

        return defaultKeyValues
    }

    const textColour = darkTheme ? 'text-white' : 'text-black'

    const {
        register,
        handleSubmit,
        control,
        errors,
        reset,
        setValue,
        getValues,
        watch,
        formState: { isSubmitSuccessful },
    } = useForm({
        defaultValues: getDefaultForm(),
    })
    const allFields = watch()
    console.log(allFields)
    useEffect(() => {
        if (isSubmitSuccessful) {
            reset(getDefaultForm())
        }
    }, [isSubmitSuccessful, submittedData, reset])
    useEffect(() => {
        if (allFields?.phoneNumber?.length > 10) {
            setValue('phoneNumber', allFields?.phoneNumber?.slice(0, 10))
        }
        if (allFields?.experience?.length > 2) {
            setValue('experience', allFields?.experience?.slice(0, 2))
        }
        if (allFields?.tagline?.length > 20) {
            setValue('phoneNumber', allFields?.tagline?.slice(0, 20))
        }
        if (allFields?.peopleTrained?.length > 5) {
            setValue('peopleTrained', allFields?.peopleTrained?.slice(0, 5))
        }
    }, [allFields])
    const onSubmit = async (data) => {
        await saveData(data)
        setSubmittedData(data)
        setIsLoading(false)
    }

    const saveData = async (dataM) => {
        setIsLoading(true)
        // TODO Investigate why Null is there
        // TODO Remove Button Uncomment
        // Remove Nulls for list and flatlist
        const data = await modifier(dataM) //modify form data

        // Object.values(formDetails).forEach((value) => {
        //     if (value.type === 'flatlist' || value.type === 'list') {
        //         data[value.fieldName] = data[value.fieldName]?.filter(
        //             (d) => d !== null,
        //         )
        //     }
        // })

        // // Flatten flatlist
        // Object.values(formDetails).forEach((value) => {
        //     if (value.type === 'flatlist') {
        //         data[value.fieldName] = data[value.fieldName]?.map(
        //             (v) => v[value.subFields[0].fieldName],
        //         )
        //     }
        // })

        try {
            if (requestType === 'post') {
                const response = await axios.post(postUrl, data, {
                    headers: {
                        // 'Content-Type': `multipart/form-data; boundary=${data.getBoundary()}`,
                        'Content-Type': `multipart/form-data;`,
                    },
                })
                // TODO make changes to all the callbacks, like the one below
                callback(response.data)
            } else if (requestType === 'put') {
                const response = await axios.put(postUrl, data)
                callback({ response: response?.data, data: data })
            } else if (requestType === 'get') {
                callback(data)
            }
        } catch (err) {
            setError(err?.response?.data?.message)
            setIsError(true)
        }
    }

    const getFormDetails = () => {
        const formInputs = formDetails?.map((value, index) => {
            if (value.type === 'hidden-text') {
                return (
                    <input
                        key={index}
                        type={'text'}
                        className={`${
                            errors[value.fieldName] ? 'is-invalid' : ''
                        }`}
                        name={value.fieldName}
                        ref={register({ required: value.required })}
                        hidden
                    />
                )
            } else if (value.type === 'list' || value.type === 'flatlist') {
                let size
                if (
                    defaultValues &&
                    defaultValues[value.fieldName] &&
                    defaultValues[value.fieldName].length
                )
                    size = defaultValues[value.fieldName].length
                else size = 0
                return (
                    <div className={`p-2 ${value.classNames}`} key={index}>
                        <ListOfValues
                            darkTheme={darkTheme}
                            register={register}
                            control={control}
                            helper={value.helper}
                            fieldKey={value.fieldName}
                            subFields={value.subFields}
                            placeholder={value.placeholder}
                            size={size}
                        />
                    </div>
                )
            } else if (value.type === 'dynamic-dropdown') {
                return (
                    <div className={`p-2 ${value.classNames}`} key={index}>
                        <DynamicDropdown
                            defaultOptions={value.options}
                            placeholder={value.placeholder}
                            name={value.fieldName}
                            errorClassName={
                                errors[value.fieldName] ? 'is-invalid' : ''
                            }
                            control={control}
                            multi={value.multi}
                            canCreate={value.canCreate}
                            maxOptions={value.maxOptions}
                            maxCharLength={value.maxCharLength}
                            required={value.required}
                            minOptions={value?.minOptions}
                        />

                        {errors[value.fieldName] && (
                            <small
                                id="firstNameHelp"
                                className="form-text text-danger"
                            >
                                {value?.validation?.errorMessage}
                            </small>
                        )}
                        <small
                            id={value.fieldName + 'Help'}
                            className="form-text text-muted"
                        >
                            {value.helper}
                        </small>
                    </div>
                )
            } else if (value.type === 'upload-button') {
                let isRequired = false
                if (value.required) {
                    isRequired = true
                } else if (
                    // TODO write something better for this
                    value.requiredDependsOn &&
                    getValues(value.requiredDependsOn)?.length > 0
                ) {
                    isRequired = true
                }

                return (
                    <div className={`p-2 ${value.classNames}`} key={index}>
                        <UploadFileButton
                            name={value.fieldName}
                            refValue={register({
                                required: isRequired,
                                ...value?.validation,
                            })}
                            acceptableFileExtensions={
                                value.acceptableFileExtensions
                            }
                            isError={errors[value.fieldName]}
                            id={value.fieldName}
                            buttonText={value?.buttonText}
                            onChange={value.onChange}
                            required={value.required}
                        />
                    </div>
                )
            } else if (value.type === 'gender-selection') {
                // TODO Move somewhere else, or make it generic
                return (
                    <div className={`p-2 ${value.classNames}`} key={index}>
                        <GenderSelection register={register} />
                    </div>
                )
            } else if (value.type === 'color-selection') {
                return (
                    <div className={`p-2 ${value.classNames}`} key={index}>
                        <ColorSelector
                            setValue={setValue}
                            register={register}
                        />
                    </div>
                )
            } else if (value.type === 'date-picker') {
                return (
                    <DatePickerComponent
                        label={value.label}
                        classNames={value.classNames}
                        key={index}
                        register={register}
                    />
                )
            } else if (value.type === 'transformations') {
                return (
                    <Transformations
                        key={index}
                        transformations={transformations}
                        setTransformations={setTransformations}
                    />
                )
            } else if (value.type === 'checkbox') {
                return (
                    <div className={`p-2 ${value.classNames}`} key={index}>
                        <input
                            type={value.type}
                            placeholder={value.placeholder}
                            name={value.fieldName}
                            ref={register({ required: value.required })}
                            readOnly={value.disabled}
                        />
                        <small
                            id={value.fieldName + 'Help'}
                            className="form-text text-muted"
                        >
                            {value.helper}
                        </small>
                    </div>
                )
            } else if (value.type === 'textarea') {
                return (
                    <div className={`p-2 ${value.classNames}`} key={index}>
                        <TextArea
                            divClassNames={value.divClassNames}
                            labelClass={value.labelClass}
                            label={value.label}
                            name={value.fieldName}
                            rows="4"
                            cols="50"
                            placeholder={value.placeholder}
                            refValue={register({
                                required: value.required,
                                ...value?.validation,
                            })}
                            inputClassNames={value.inputClassNames}
                        />
                        {errors[value.fieldName] && (
                            <small
                                id="firstNameHelp"
                                className="form-text text-danger"
                            >
                                {value?.validation?.errorMessage}
                            </small>
                        )}
                        <small
                            id={value.fieldName + 'Help'}
                            className="form-text text-muted"
                        >
                            {value.helper}
                        </small>
                    </div>
                )
            } else if (value.type === 'star-rating') {
                return (
                    <div key={index}>
                        <input
                            name={value.fieldName}
                            type="hidden"
                            ref={register({
                                required: value.required,
                                ...value?.validation,
                            })}
                        />
                        <div className={`p-2 ${value.classNames}`} key={index}>
                            <StarRating
                                edit={true}
                                reverse={value.reverse}
                                size={value.size}
                                isHalf={false}
                                star={defaultValues?.star}
                                showNumber={value.showNumber}
                                onChange={(data) => {
                                    setValue(value.fieldName, data)
                                }}
                            />
                            {errors[value.fieldName] && (
                                <small
                                    id="firstNameHelp"
                                    className="form-text text-danger"
                                >
                                    {value?.validation?.errorMessage}
                                </small>
                            )}
                        </div>
                    </div>
                )
            } else {
                return (
                    <div className={`p-2 ${value.classNames}`} key={index}>
                        <InputBox
                            label={value.label}
                            errorClassName={
                                errors[value.fieldName] ? 'is-invalid' : ''
                            }
                            type={value.type}
                            placeholder={value.placeholder}
                            name={value.fieldName}
                            refValue={register({
                                required: value.required,
                                ...value?.validation,
                            })}
                            required={value.required}
                            readOnly={value.disabled}
                            labelClass={value.labelClass}
                            inputLabel={value.inputLabel}
                            divClassNames={value.divClassNames}
                            darkTheme={darkTheme}
                            inputClassNames={value.inputClassNames}
                            maxLength={value.maxLength}
                        />
                        {errors[value.fieldName] && (
                            <small
                                id="firstNameHelp"
                                className="form-text text-danger"
                            >
                                {value?.validation?.errorMessage}
                            </small>
                        )}
                        <small
                            id={value.fieldName + 'Help'}
                            className="form-text text-muted"
                        >
                            {value.helper}
                        </small>
                    </div>
                )
            }
        })

        return (
            <>
                <small className="message error">
                    All required fields are marked as *
                </small>
                <form onSubmit={handleSubmit(onSubmit)} className={classNames}>
                    <div className="row">
                        {formInputs}
                        {previewCard ? (
                            <PreviewCardContainer
                                props={allFields}
                                register={register}
                                setValue={setValue}
                            />
                        ) : (
                            <></>
                        )}
                        <div className="d-flex">
                            {isLoading ? (
                                <Button
                                    classNames="my-3"
                                    text={
                                        <span className="spinner-border spinner-border-sm"></span>
                                    }
                                    color="green"
                                />
                            ) : (
                                <Button
                                    type="submit"
                                    classNames="my-3"
                                    text={saveButtonText || 'Submit'}
                                    icon={formIcon}
                                    color="green"
                                />
                            )}
                        </div>
                    </div>
                </form>
            </>
        )
    }

    const displayData = (
        <>
            {showTitle && <h4 className={textColour}>{formName} Form</h4>}
            {getFormDetails()}
        </>
    )

    return (
        <div>
            {isLoading ? (
                <Loader />
            ) : isError ? (
                <ErrorPage text={error} />
            ) : (
                displayData
            )}
        </div>
    )
}

Form.propTypes = {
    formDetails: PropTypes.array,
    postUrl: PropTypes.string,
    formName: PropTypes.string,
    formIcon: PropTypes.string,
    showTitle: PropTypes.bool,
    darkTheme: PropTypes.bool,
    defaultValues: PropTypes.array,
    requestType: PropTypes.string,
    saveButtonText: PropTypes.string,
    callback: PropTypes.func,
    classNames: PropTypes.string,
}

export default Form
