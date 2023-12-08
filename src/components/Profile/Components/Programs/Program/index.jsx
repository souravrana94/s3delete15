import React, { useEffect, useState } from 'react'
import './index.scss'
import { MdSave, MdEdit, MdClose } from 'react-icons/md'
import Button from '../../../../Common/Button'
import Loader from '../../../../Common/Loader'
import axios from '../../../../../store/axios-secure'
import { Icon } from '@iconify/react'
import CustomModal from '../../../../Common/Modal'
import ReactTooltip from 'react-tooltip'
import { renderToString } from 'react-dom/server'
const ProgramsComponent = ({
    program,
    programs,
    idx,
    deleteProgram,
    setPrograms,
    setDisableAddButton,
    isError,
    setIsError,
    setErrorMessage,
    errorMessage,
}) => {
    const [editing, setEditing] = useState(program?.editing)
    const [formDetails, setFormDetails] = useState(program)
    const [programTypesArr, setProgramTypesArr] = useState(
        program?.programTypes,
    )
    const [isSuccess, setIsSuccess] = useState(false)

    const [isLoading, setIsLoading] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    useEffect(() => {
        setDisableAddButton(editing)
    }, [editing])
    useEffect(() => {
        setTimeout(() => {
            if (isError) {
                setIsError(false)
            }
        }, 5000)
        setTimeout(() => {
            if (isSuccess) {
                setIsSuccess(false)
            }
        }, 5000)
    }, [isError, isSuccess])
    const getToolTip = ({ name, startDate, endDate }) => {
        const stringData = renderToString(
            <div className="program-tooltip-div">
                <div>{name}</div>
                <div className="date">Start: {startDate}</div>
                <div className="date">End: {endDate}</div>
            </div>,
        )
        return stringData
    }
    const rand = Math.random()
    const validate = (program) => {
        let found = false,
            newErrorMessage = ''
        programs?.map((pro) => {
            if (pro?._id != program?._id && program?.name == pro?.name) {
                newErrorMessage = 'Program name already exists'
                found = true
                return
            }
        })
        if (!found) {
            if (program.name == '') {
                newErrorMessage = 'Please enter the program name'
                found = true
            } else if (program.programTypes.length == 0) {
                newErrorMessage = 'Please enter atleast one Program Type'
                found = true
            } else {
                for (let obj of program.programTypes) {
                    const keys = Object.keys(obj)
                    for (let key of keys) {
                        if (obj[key] == '') {
                            newErrorMessage = `Please enter all the program type ${key}s in proper format`
                            found = true
                            break
                        } else if (
                            parseInt(obj[key]) == 0 &&
                            key == 'duration'
                        ) {
                            newErrorMessage = `Program type ${key}s cannot be 0`
                            found = true
                            break
                        } else if (
                            key == 'discount' &&
                            parseInt(obj[key]) > parseInt(obj['price'])
                        ) {
                            newErrorMessage = `Program type discount cannot be greater than the price!`
                            found = true
                            break
                        }
                    }
                    if (found == true) break
                }
                if (!found) {
                    if (program.description == '') {
                        newErrorMessage = 'Please enter the program description'
                        found = true
                    } else {
                        program.highlights.forEach((str) => {
                            if (str == '') {
                                newErrorMessage =
                                    'Please enter all program highlights'
                                found = true
                                return
                            }
                        })
                    }
                }
            }
        }
        if (found == true) {
            setErrorMessage({ message: newErrorMessage, idx: idx })
        }
        return found
    }
    const updateProgram = async (program) => {
        if (validate(program)) {
            setIsError(true)
            return
        }
        setIsLoading(true)
        try {
            if (program?._id == -1) {
                const response = await axios.post(`trainers/programs/add`, {
                    ...program,
                })
                const newProgram = response?.data
                newProgram['editing'] = false
                setIsSuccess(true)
                setIsError(false)
                setPrograms(newProgram)
            } else {
                const response = await axios.put(
                    `/trainers/programs/update?programId=${program?._id}`,
                    {
                        ...program,
                    },
                )
                const newProgram = response?.data
                newProgram['editing'] = false
                setIsSuccess(true)
                setIsError(false)
                setPrograms(newProgram)
            }
            setEditing(false)
        } catch (error) {
            setIsSuccess(false)
            setErrorMessage({
                message: 'Something went wrong',
                idx: idx,
            })
            setIsError(true)
        }
        setIsLoading(false)
    }

    const newProgramTypes = () => {
        let newProgramTypes = {
            duration: 7,
            price: 200,
            discount: 300,
        }
        let updatedProgramsArr = [...programTypesArr]
        updatedProgramsArr.push(newProgramTypes)
        setProgramTypesArr(updatedProgramsArr)
    }
    const deleteProgramType = (idx) => {
        let updatedProgram = [...programTypesArr]
        updatedProgram?.splice(idx, 1)
        setProgramTypesArr(updatedProgram)
    }
    useEffect(() => {
        setFormDetails(program)
    }, [program])
    return (
        <>
            <div className="program-container">
                <div className="program-header">
                    <div className="title">
                        {editing ? (
                            <div className="edit-title">
                                <input
                                    type="text"
                                    placeholder="Enter name of program"
                                    onChange={(e) => {
                                        setFormDetails({
                                            ...formDetails,
                                            name: e.target.value,
                                        })
                                    }}
                                    value={formDetails?.name}
                                />
                            </div>
                        ) : (
                            <span>{formDetails?.name}</span>
                        )}
                    </div>
                    <div className="options">
                        <span className="program-edit-button-container">
                            {isLoading ? (
                                <Loader />
                            ) : editing ? (
                                <MdSave
                                    size={20}
                                    onClick={() => {
                                        let updatedForm = formDetails
                                        updatedForm.programTypes =
                                            programTypesArr
                                        setFormDetails(updatedForm)
                                        updateProgram({
                                            ...formDetails,
                                            editing: false,
                                        })
                                    }}
                                />
                            ) : (
                                <MdEdit
                                    size={20}
                                    onClick={() => {
                                        setEditing(true)
                                    }}
                                />
                            )}
                        </span>
                        {isLoading ? (
                            <></>
                        ) : (
                            <span className="program-edit-button-container">
                                <MdClose
                                    size={20}
                                    onClick={(e) => {
                                        setEditing(false)
                                        // deleteProgram(idx)
                                        setShowDeleteModal(true)
                                    }}
                                />
                            </span>
                        )}
                    </div>
                </div>
                <div className="body">
                    {isSuccess ? (
                        <small className="message success">
                            Saved succesfully
                        </small>
                    ) : (
                        <></>
                    )}
                    {isError && errorMessage.idx == idx ? (
                        <small className="message error">
                            {errorMessage.message}
                        </small>
                    ) : (
                        <></>
                    )}
                    {editing ? (
                        <div className="details">
                            <div className="highlights">
                                <p>Highlights</p>
                                {formDetails?.highlights?.map(
                                    (highlight, idx) => {
                                        return (
                                            <div
                                                key={idx}
                                                className="highlight"
                                            >
                                                <input
                                                    type="text"
                                                    className="highlight-input"
                                                    placeholder={`Key Highlight 1`}
                                                    value={highlight}
                                                    onChange={(e) => {
                                                        let updatedHighlights =
                                                            formDetails?.highlights
                                                        updatedHighlights[idx] =
                                                            e.target.value
                                                        setFormDetails({
                                                            ...formDetails,
                                                            highlights:
                                                                updatedHighlights,
                                                        })
                                                    }}
                                                />
                                            </div>
                                        )
                                    },
                                )}
                            </div>
                            <div className="description">
                                <p>Description</p>
                                <p className="text-area">
                                    {/* {editing ? ( */}
                                    <textarea
                                        disabled={!editing}
                                        type="text"
                                        className="description-input"
                                        placeholder="Write about the program and what it has to offer in a description format"
                                        value={formDetails?.description}
                                        onChange={(e) => {
                                            setFormDetails({
                                                ...formDetails,
                                                description: e.target.value,
                                            })
                                        }}
                                    />
                                </p>
                            </div>
                        </div>
                    ) : null}
                    <div className="program-types">
                        <p>Program Types</p>
                        <div className="header">
                            <div>Duration</div>
                            <div>Price</div>
                            <div>Discount</div>
                        </div>
                        {programTypesArr?.map((program, idx) => {
                            return (
                                <div className="program-details" key={idx}>
                                    <div className="program-detail">
                                        {editing ? (
                                            <div className="edit-details">
                                                <input
                                                    type="text"
                                                    maxLength={3}
                                                    placeholder="Enter days"
                                                    value={program?.duration}
                                                    onChange={(e) => {
                                                        let updatedProgramTypes =
                                                            [...programTypesArr]
                                                        updatedProgramTypes[
                                                            idx
                                                        ].duration =
                                                            e.target.value
                                                        setProgramTypesArr(
                                                            updatedProgramTypes,
                                                        )
                                                    }}
                                                    onKeyPress={(e) => {
                                                        if (isNaN(e.key)) {
                                                            e.preventDefault()
                                                        }
                                                    }}
                                                />
                                            </div>
                                        ) : (
                                            <span
                                                style={{ marginRight: '5px' }}
                                            >
                                                {program?.duration}
                                            </span>
                                        )}
                                        <span>days</span>
                                    </div>
                                    <div className="program-detail">
                                        <Icon icon={'bx:rupee'} height={22} />
                                        {editing ? (
                                            <div className="edit-details">
                                                <input
                                                    type="text"
                                                    maxLength={5}
                                                    placeholder="Enter price"
                                                    value={program?.price}
                                                    onChange={(e) => {
                                                        let updatedProgramTypes =
                                                            [...programTypesArr]
                                                        updatedProgramTypes[
                                                            idx
                                                        ].price = e.target.value
                                                        setProgramTypesArr(
                                                            updatedProgramTypes,
                                                        )
                                                    }}
                                                    onKeyPress={(e) => {
                                                        if (isNaN(e.key)) {
                                                            e.preventDefault()
                                                        }
                                                    }}
                                                />
                                            </div>
                                        ) : (
                                            <span>{program?.price}</span>
                                        )}
                                    </div>
                                    <div className="program-detail">
                                        <Icon icon={'bx:rupee'} height={22} />
                                        {editing ? (
                                            <div className="edit-details">
                                                <input
                                                    type="text"
                                                    maxLength={4}
                                                    placeholder="Enter discount"
                                                    value={program?.discount}
                                                    onChange={(e) => {
                                                        let updatedProgramTypes =
                                                            [...programTypesArr]
                                                        updatedProgramTypes[
                                                            idx
                                                        ].discount =
                                                            e.target.value
                                                        setProgramTypesArr(
                                                            updatedProgramTypes,
                                                        )
                                                    }}
                                                    onKeyPress={(e) => {
                                                        if (isNaN(e.key)) {
                                                            e.preventDefault()
                                                        }
                                                    }}
                                                />
                                            </div>
                                        ) : (
                                            <span>{program?.discount}</span>
                                        )}
                                    </div>
                                    {editing ? (
                                        <MdClose
                                            className="close-icon"
                                            onClick={() => {
                                                deleteProgramType(idx)
                                            }}
                                        />
                                    ) : (
                                        <></>
                                    )}
                                </div>
                            )
                        })}
                        {editing ? (
                            <Button
                                text={'+ Add Program Type'}
                                color={'green'}
                                classNames="add-button"
                                onClick={() => {
                                    newProgramTypes()
                                }}
                            />
                        ) : (
                            <></>
                        )}
                    </div>
                    <div className="users">
                        {program?.userRefs?.map((user, idx) => {
                            return (
                                <div
                                    key={idx}
                                    data-for={`getContent-${rand + idx}`}
                                    data-tip
                                >
                                    <img
                                        class="profile-image"
                                        src={user?.photoUrl}
                                    />
                                    <ReactTooltip
                                        className="tooltip-container-user"
                                        id={`getContent-${rand + idx}`}
                                        getContent={() =>
                                            getToolTip({
                                                name: user?.name,
                                                startDate: new Date(
                                                    user?.currentProgramRef?.startDate,
                                                ).toLocaleDateString(),
                                                endDate: new Date(
                                                    user?.currentProgramRef?.endDate,
                                                ).toLocaleDateString(),
                                            })
                                        }
                                        html={true}
                                    />
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
            <CustomModal
                title={'Delete Program'}
                show={showDeleteModal}
                onHide={() => setShowDeleteModal(false)}
                width="medium"
                dark={true}
            >
                <div>
                    <p>Are you sure you want to delete the program?</p>
                    <div className="d-flex">
                        <Button
                            text={'Yes'}
                            color="green"
                            size="s"
                            onClick={() => {
                                deleteProgram(idx)
                            }}
                        />
                        <Button
                            text={'No'}
                            color="red"
                            size="s"
                            onClick={() => {
                                setShowDeleteModal(false)
                            }}
                        />
                    </div>
                </div>
            </CustomModal>
        </>
    )
}

export default ProgramsComponent
