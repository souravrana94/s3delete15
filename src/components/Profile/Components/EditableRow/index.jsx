import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import axios from '../../../../store/axios-secure'
import InputBox from '../../../Common/Form/InputBox'
import './index.scss'
import GenderSelection from '../../../Common/Form/GenderSelection'
import DatePickerComponent from '../../../Common/Form/DatePicker'
import DynamicDropdown from '../../../Common/Form/DynamicDropdown'
import ColorSelector from '../../../Common/Form/ColorSelector'
import UploadFileButton from '../../../Common/Form/UploadFileButton'
import Creatable from 'react-select/creatable'
import TextArea from '../../../Common/Form/TextArea'
import { Transformations } from '../../../Common/Form/Transformations'
import PreviewCard from '../../../Common/Form/PreviewCardContainer/PreviewCard'

import { Icon } from '@iconify/react'
import Button from '../../../Common/Button'
import { Link } from 'react-router-dom'
import Loader from '../../../Common/Loader'

const customStyles = {
    control: (provided) => ({
        ...provided,
        color: 'white',
        background: 'transparent',
        borderColor: 'white',
        borderRadius: 8,
    }),
    singleValue: (provided) => ({
        ...provided,
        color: 'white',
    }),
    container: (provided) => ({
        ...provided,
        color: 'black',
        background: 'transparent',
    }),
    svg: (provided) => ({
        ...provided,
        color: 'black',
        background: 'transparent',
    }),
}
const EditableRow = ({
    details,
    saveData = () => {},
    previewCard,
    setPreviewCard,
    url,
}) => {
    const [transformations, setTransformations] = useState(details.initialValue)
    const [value, setValue] = useState(details.initialValue)
    const [success, setSuccess] = useState(false)
    const [error, setErrors] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [editable, setEditable] = useState(false)
    const [cert, setCert] = useState(details.initialValue)
    const [isLoading, setIsLoading] = useState(false)
    useEffect(() => {
        if (details.fieldName === 'peopleTrained') {
            setPreviewCard({
                ...previewCard,
                peopleTrained: value,
            })
        }
        if (details.fieldName === 'tagline') {
            setPreviewCard({
                ...previewCard,
                tagline: value,
            })
        }
        if (details.fieldName === 'themeColor') {
            setPreviewCard({
                ...previewCard,
                idx: value,
            })
        }
    }, [value])
    const onSubmitHandler = async () => {
        let validated = true
        setIsLoading(true)
        if (details.fieldName == 'transformations') {
            transformations?.forEach((val) => {
                if (val.isEditing) {
                    setErrorMessage(
                        'Please save transformations before proceeding',
                    )
                    setErrors(true)
                    validated = false
                    setIsLoading(false)
                    return
                }
            })
        }
        if (validated) {
            setErrors(false)
            if (editable) {
                if (
                    details.fieldName == 'aadhar' ||
                    details.fieldName === 'QRCode'
                ) {
                    validated = true
                    const formData = new FormData()
                    formData.append('uploadedFile', value)
                    formData.append('field', details.fieldName)
                    try {
                        let res = await axios.patch(
                            'trainers/profile/file',
                            formData,
                            {
                                headers: {
                                    'Content-Type': 'multipart/form-data',
                                },
                            },
                        )
                        setSuccess(true)
                    } catch (e) {
                        setErrors(true)
                        // setErrorMessage("Could not upload file")
                        console.log('error while uploading adhar or QR')
                    }
                    setIsLoading(false)
                    setEditable(!editable)
                    return
                }
                // If value not changed, just save
                if (
                    details.initialValue === value &&
                    details.fieldName === 'certificate' &&
                    details.initialValue.value != cert.value
                ) {
                    setErrorMessage('Please Upload file')
                    setErrors(true)
                    setIsLoading(false)
                    return
                }
                if (
                    details.initialValue === value &&
                    details.fieldName !== 'transformations'
                ) {
                    setSuccess(true)
                } else {
                    const response = details.validateSubmit(
                        details.fieldName,
                        value,
                    )
                    if (response?.isError) {
                        setErrorMessage(response?.message)
                        setErrors(true)
                        setIsLoading(false)
                        return
                    } else {
                        setErrorMessage('')
                        setErrors(false)
                    }
                    var data = {}
                    data['field'] = details.fieldName
                    if (
                        details.fieldName === 'interests' ||
                        details.fieldName === 'expertise'
                    ) {
                        data['value'] = value.map((item) => item.value)
                    } else {
                        data['value'] = value
                    }
                    try {
                        let res
                        if (details.fieldName === 'transformations') {
                            const formData = new FormData()
                            transformations.map((item, i) => {
                                const transformationJson = item
                                //if img url is gcpurl then don't append
                                if (typeof item.imageUrl != 'string') {
                                    formData.append(
                                        'transformations',
                                        item.imageUrl,
                                        `${i}.${item.imageUrl.name
                                            .split('.')
                                            .pop()}`,
                                    )
                                }
                                // formData.append(
                                //     'transformations',
                                //     item.imageUrl,
                                //     `${i}.${item.imageUrl.name
                                //         .split('.')
                                //         .pop()}`,
                                // )
                                delete transformationJson.imageUrl
                                delete transformationJson.isEditing
                                formData.append(
                                    i.toString(),
                                    JSON.stringify(transformationJson),
                                )
                            })
                            res = await axios.patch(
                                'trainers/profile/transformations',
                                formData,
                                {
                                    headers: {
                                        'Content-Type': 'multipart/form-data',
                                    },
                                },
                            )
                            let updatedTransformations =
                                res.data.transformations
                            updatedTransformations.map((item) => {
                                item['isEditing'] = false
                            })
                            setTransformations(updatedTransformations)
                            // console.log(updatedTransformations)
                        } else if (
                            typeof value === 'object' &&
                            details.fieldName !== 'interests' &&
                            details.fieldName !== 'expertise' &&
                            details.fieldName !== 'DOB'
                        ) {
                            const formData = new FormData()
                            formData.append('uploadedFile', value)
                            if (details.fieldName === 'certificate') {
                                formData.append('certName', cert.value)
                            }
                            formData.append('field', details.fieldName)
                            res = await axios.patch(
                                'trainers/profile/file',
                                formData,
                                {
                                    headers: {
                                        'Content-Type': 'multipart/form-data',
                                    },
                                },
                            )
                        } else {
                            res = await axios.patch(
                                url ?? 'trainers/profile/profile',
                                data,
                            )
                        }
                        if (res.status === 200) {
                            setSuccess(true)
                            setErrors(false)
                            // saveData(data)
                        } else {
                            setErrors(true)
                            setErrorMessage(res.data.message)
                        }
                        if (details.fieldName === 'username') {
                            alert(
                                'Username has been changed. Please login again',
                            )
                        }
                    } catch (err) {
                        setErrors(true)
                        setSuccess(false)
                    }
                }
            }
            setIsLoading(false)
            setEditable(!editable) /* 1 */
        }
    }
    const input = () => {
        if (details.type === 'gender-selection') {
            return (
                <div className={`${details.divClassNames}`}>
                    <GenderSelection
                        disabled={!editable}
                        initialValue={details.initialValue}
                        setValue={setValue}
                    />
                </div>
            )
        } else if (details.type === 'date-picker') {
            return (
                <DatePickerComponent
                    initialValue={value}
                    setValue={setValue}
                    label={details.label}
                    classNames={details.inputClassNames}
                    disabled={!editable}
                />
            )
        } else if (details.type === 'dynamic-dropdown') {
            return (
                <div className="label-input-container">
                    <span style={{ width: 'fit-content' }} className="label">
                        {details.label}
                    </span>
                    <Creatable
                        options={details.options}
                        defaultValue={details.initialValue}
                        className="white-border"
                        styles={customStyles}
                        placeholder={details.placeholder}
                        isMulti={details.multi}
                        onChange={(values) => {
                            setValue(values)
                        }}
                        isDisabled={!editable}
                        isClearable
                        isValidNewOption={(value, values) => {
                            return (
                                value.length > 0 &&
                                value.length < details.maxCharLength &&
                                values.length < details.maxOptions
                            )
                        }}
                    />
                </div>
            )
        } else if (details.type === 'textarea') {
            return (
                <TextArea
                    divClassNames={details.divClassNames}
                    labelClass={details.labelClass}
                    label={details.label}
                    name={details.fieldName}
                    rows="4"
                    cols="50"
                    placeholder={details.placeholder}
                    inputClassNames={details.inputClassNames}
                    disabled={!editable}
                    initialValue={details.initialValue}
                    onChange={(e) => {
                        setValue(e.target.value)
                    }}
                />
            )
        } else if (details.type === 'color-picker') {
            return (
                <ColorSelector
                    getValue={(idx) => {
                        setValue(idx)
                    }}
                    disabled={!editable}
                    initialValue={details.initialValue}
                />
            )
        } else if (details.type === 'transformations') {
            return (
                <>
                    <Transformations
                        transformations={transformations}
                        setTransformations={setTransformations}
                        breakpoints={[2500, 1200]}
                        disabled={!editable}
                        label={false}
                        divClassName={'profile-transformation-carousel'}
                    />
                </>
            )
        } else if (details.type === 'upload-file') {
            return (
                <UploadFileButton
                    disabled={!editable}
                    name={details.fieldName}
                    id={details.fieldName}
                    buttonText={details?.buttonText}
                    onChange={(e) => {
                        setValue(e.target.files[0])
                    }}
                />
            )
        } else if (details.type === 'upload-cert') {
            return (
                <div className="upload-cert-div">
                    <div className="upload-cert-div-left label-input-container">
                        <span
                            style={{ width: 'fit-content' }}
                            className="label"
                        >
                            {details.label}
                        </span>
                        <Creatable
                            options={details.options}
                            defaultValue={details.initialValue}
                            className="white-border"
                            styles={customStyles}
                            placeholder={details.placeholder}
                            isMulti={false}
                            onChange={(values) => {
                                setCert(values)
                            }}
                            isDisabled={!editable}
                            isClearable
                            isValidNewOption={(value, values) => {
                                return (
                                    value.length > 0 &&
                                    value.length < details.maxCharLength &&
                                    values.length < details.maxOptions
                                )
                            }}
                        />
                    </div>
                    <div className="upload-cert-div-right">
                        {editable ? (
                            <UploadFileButton
                                disabled={!editable}
                                name={details.fieldName}
                                id={details.fieldName}
                                buttonText={details?.buttonText}
                                onChange={(e) => {
                                    setValue(e.target.files[0])
                                }}
                            />
                        ) : (
                            <Link
                                to={{
                                    pathname: details.certificateUrl,
                                }}
                                target="_blank"
                            >
                                <Button
                                    style={{
                                        backgroundColor:
                                            'rgba(196, 196, 196, 0.1)',
                                    }}
                                    text={'View Certificate'}
                                />
                            </Link>
                        )}
                    </div>
                </div>
            )
        } else if (details.type === 'previewCard') {
            return (
                <div className="profile-preview-card">
                    <div className="card-label">Your Card</div>
                    <PreviewCard
                        idx={previewCard.idx}
                        value={previewCard}
                        disabled={!editable}
                        onChange={(e) => {
                            setValue(e.target.files[0])
                        }}
                    />
                </div>
            )
        } else if (details.type === 'aadhar' || details.type === 'UPIQRCode') {
            return (
                <>
                    {/* <div className="card-label">Aadhar</div> */}
                    <div className="card-label">{details.label}</div>
                    <div className="upload-aadhar-div-right">
                        {editable ? (
                            <UploadFileButton
                                disabled={!editable}
                                name={details.fieldName}
                                id={details.fieldName}
                                buttonText={details?.buttonText}
                                onChange={(e) => {
                                    setValue(e.target.files[0])
                                }}
                            />
                        ) : (
                            <Link
                                to={{
                                    pathname: details.fileURL,
                                }}
                                target="_blank"
                            >
                                <Button
                                    style={{
                                        backgroundColor:
                                            'rgba(196, 196, 196, 0.1)',
                                    }}
                                    text={`View ${details.label}`}
                                />
                            </Link>
                        )}
                    </div>
                </>
            )
        } else {
            return (
                <InputBox
                    id={details.placeholder}
                    type={details.type}
                    placeholder={details.placeholder}
                    value={value}
                    label={details.label}
                    disabled={!editable}
                    inputClassNames="white-border"
                    onChange={(evt) => setValue(evt.target.value)}
                    divClassNames={'col-md-12'}
                    labelClass={'label'}
                    maxLength={details.maxLength}
                />
            )
        }
    }
    return (
        <div className={`edit-row-container`}>
            <div className={`box-edit-container ${details.classNames}`}>
                {input()}
                {details.type === 'transformations' ? (
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        {details.secondaryLabel}
                        <span
                            className="edit-button-container"
                            onClick={onSubmitHandler}
                        >
                            {editable ? (
                                <>
                                    <Icon
                                        className="edit-icon"
                                        icon={'bx:save'}
                                        color="white"
                                        height={23}
                                    />
                                    {/* <img
                                        src={BlackSaveIcon}
                                        alt=""
                                        className="edit-icon"
                                    /> */}
                                </>
                            ) : (
                                <>
                                    <Icon
                                        className="edit-icon"
                                        icon={'ci:edit'}
                                        color="white"
                                        height={23}
                                    />
                                    {/* <img
                                        src={EditIcon}
                                        alt=""
                                        className="edit-icon"
                                    /> */}
                                </>
                            )}
                        </span>
                    </div>
                ) : (
                    <span
                        className="edit-button-container"
                        onClick={onSubmitHandler}
                    >
                        {isLoading ? (
                            <>
                                <Loader />
                            </>
                        ) : editable ? (
                            <>
                                <Icon
                                    icon="bx:save"
                                    height={23}
                                    color="white"
                                />
                            </>
                        ) : (
                            <>
                                <Icon
                                    icon="ci:edit"
                                    height={23}
                                    color="white"
                                />
                            </>
                        )}
                    </span>
                )}
            </div>

            {error ? (
                <small className="message error">
                    {errorMessage || <>{details.label} could not be saved</>}
                </small>
            ) : success ? (
                <small className="message success">
                    {details.label} saved successfully.
                    {details.label == 'Transformations'
                        ? ' Updation of images might take time'
                        : ''}
                </small>
            ) : (
                ''
            )}
        </div>
    )
}

EditableRow.propTypes = {
    details: PropTypes.object,
    saveData: PropTypes.func,
}

export default EditableRow
