import React, { useEffect, useState } from 'react'
import { Card } from 'react-bootstrap'
import InputBox from '../../InputBox'
import UploadFileButton from '../../UploadFileButton'
import './index.scss'
import { Icon } from '@iconify/react'

export const TransformationCard = ({
    props,
    deleteTransformation,
    disabled,
    idx,
    updateTransformation,
    updateEditing = () => {},
    isEditing,
}) => {
    const [editing, setEditing] = useState(isEditing)
    const [isError, setIsError] = useState(false)
    useEffect(() => {
        updateEditing(idx, editing)
    }, [editing])
    useEffect(() => {
        if (disabled) {
            if (!editing) setEditing(false)
        }
    }, [disabled])
    const [formDetails, setFormDetails] = useState(props)
    useEffect(() => {
        setFormDetails(props)
    }, [props])
    const validate = () => {
        if (
            formDetails.imageUrl == null ||
            formDetails.duration == '' ||
            formDetails.beforeWeight == 0 ||
            formDetails.afterWeight == 0 ||
            formDetails.title == '' ||
            formDetails.name == ''
        ) {
            setIsError(true)
            return false
        }
        return true
    }
    return (
        <div className="transformation-container" key={idx + 1}>
            <Card className="bg-dark text-white card">
                {formDetails.imageUrl == '' || formDetails.imageUrl == null ? (
                    <Card.Img
                        key={idx + 1}
                        style={{ height: '200px', visibility: 'hidden' }}
                    />
                ) : (
                    <Card.Img
                        style={{ height: '200px' }}
                        key={idx}
                        src={
                            typeof formDetails.imageUrl == 'string'
                                ? formDetails.imageUrl
                                : URL.createObjectURL(formDetails.imageUrl)
                        }
                    />
                )}
                <Card.ImgOverlay className="card-image-overlay">
                    <div className="content">
                        <div className="title">
                            {editing ? (
                                <InputBox
                                    type={'text'}
                                    placeholder={'Enter title'}
                                    inputClassNames={'white-border'}
                                    value={formDetails.title}
                                    onChange={(e) => {
                                        setFormDetails({
                                            ...formDetails,
                                            title: e.target.value,
                                        })
                                    }}
                                    maxLength={15}
                                />
                            ) : (
                                <span>{formDetails.title}</span>
                            )}
                            {editing ? (
                                <div className="days-edit-container">
                                    <InputBox
                                        type={'number'}
                                        placeholder={'-'}
                                        inputClassNames={'white-border days'}
                                        value={formDetails.duration}
                                        maxLength={3}
                                        onChange={(e) => {
                                            setFormDetails({
                                                ...formDetails,
                                                duration: e.target.value,
                                            })
                                        }}
                                    />
                                    <span>days</span>
                                </div>
                            ) : (
                                <span>{formDetails.duration} days</span>
                            )}
                        </div>
                        <div style={{ width: '80%' }}>
                            {editing ? (
                                formDetails.imageUrl == null ? (
                                    <UploadFileButton
                                        buttonText="Upload img"
                                        onChange={(e) => {
                                            if (
                                                !e.target.files ||
                                                e.target.files.length === 0
                                            ) {
                                                return
                                            }
                                            setFormDetails({
                                                ...formDetails,
                                                imageUrl: e.target.files[0],
                                            })
                                        }}
                                    />
                                ) : (
                                    <></>
                                )
                            ) : (
                                <></>
                            )}
                        </div>
                        <div className="weight-container">
                            <div className="weight">
                                {editing ? (
                                    <>
                                        <InputBox
                                            type={'number'}
                                            placeholder={'-'}
                                            inputClassNames={'weight-edit'}
                                            value={formDetails.beforeWeight}
                                            onChange={(e) => {
                                                setFormDetails({
                                                    ...formDetails,
                                                    beforeWeight:
                                                        e.target.value,
                                                })
                                            }}
                                            maxLength={3}
                                        />
                                        <span className="weight-value">kg</span>
                                    </>
                                ) : (
                                    <p className="weight-value">
                                        {formDetails.beforeWeight} kg
                                    </p>
                                )}
                            </div>
                            <div className="weight">
                                {editing ? (
                                    <>
                                        <InputBox
                                            type={'number'}
                                            placeholder={'-'}
                                            inputClassNames={'weight-edit'}
                                            value={formDetails.afterWeight}
                                            onChange={(e) => {
                                                setFormDetails({
                                                    ...formDetails,
                                                    afterWeight: e.target.value,
                                                })
                                            }}
                                            maxLength={3}
                                        />
                                        <span className="weight-value">kg</span>
                                    </>
                                ) : (
                                    <p className="weight-value">
                                        {formDetails.afterWeight} kg
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                    {editing && formDetails.imageUrl != null ? (
                        <div className="close-button">
                            <Icon
                                icon={'ep:close-bold'}
                                onClick={() => {
                                    setFormDetails({
                                        ...formDetails,
                                        imageUrl: null,
                                    })
                                }}
                                color="white"
                            />
                        </div>
                    ) : (
                        <></>
                    )}
                </Card.ImgOverlay>
            </Card>
            <div className="card-title">
                {editing ? (
                    <>
                        <InputBox
                            type={'text'}
                            placeholder={'Enter Name'}
                            inputClassNames={'white-border'}
                            value={formDetails.name}
                            onChange={(e) => {
                                setFormDetails({
                                    ...formDetails,
                                    name: e.target.value,
                                })
                            }}
                            maxLength={30}
                        />
                    </>
                ) : (
                    <p className="title-name">{formDetails.name}</p>
                )}
                {!disabled ? (
                    <div className="card-actions">
                        {editing ? (
                            <Icon
                                icon={'bx:save'}
                                onClick={() => {
                                    if (!validate()) {
                                        return
                                    }
                                    setIsError(false)
                                    setEditing(false)
                                    updateTransformation({
                                        ...formDetails,
                                    })
                                }}
                                height={24}
                                className="action-icons"
                                color="white"
                            />
                        ) : (
                            <Icon
                                icon={'ci:edit'}
                                onClick={() => {
                                    setEditing(true)
                                    // updateTransformation({
                                    //     ...formDetails,
                                    //     isEditing: isEditing,
                                    // })
                                }}
                                height={23}
                                className="action-icons"
                                color="white"
                            />
                        )}
                        <Icon
                            icon={'ep:close-bold'}
                            onClick={() => {
                                deleteTransformation()
                            }}
                            color="white"
                            height={23}
                            className="action-icons"
                            //fontSize="40px"
                        />
                    </div>
                ) : (
                    <></>
                )}
            </div>
            {isError ? (
                <small id="firstNameHelp" className="form-text text-danger">
                    Please enter all fields
                </small>
            ) : (
                <></>
            )}
        </div>
    )
}
