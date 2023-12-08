import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import axios from '../../../store/axios-secure'
import './index.scss'
import { getRange, getInputRange } from '../../../utilities/utilities'
import Loader from '../../Common/Loader'
import InternalServerErrorPage from '../../Common/ErrorPage/InternalServerErrorPage'
import Button from '../../Common/Button'
import { propTypes } from 'react-bootstrap/esm/Image'
import { Icon } from '@iconify/react'
import TextArea from '../../Common/Form/TextArea'
import { FaTimes, FaDotCircle } from 'react-icons/fa'

const EditExercise = ({
    exercise,
    setExercise,
    deleteExercise,
    getComment = true,
    autoPrefill = true,
    showFeedback = true,
    forCycle,
    clientId,
    routineRef,
    fetchActiveCycle,
    updatedSession,
    setUpdatedSession,
}) => {
    let invalidChars = ['-', '+', 'e']
    const [exerciseText, setExerciseText] = useState({
        name: exercise?.exerciseInfoRef?.name,
        gifUrl: exercise?.exerciseInfoRef?.gifUrl,
    })
    const [loading, setLoading] = useState(false)
    const [platform, setPlatform] = useState()
    const [tableLoading, setTableLoading] = useState(false)
    const [error, setError] = useState(false)
    const [options, setOptions] = useState([])
    const [commentsArray, setCommentsArray] = useState([]) //?
    const [comment, setComment] = useState('')
    let [feedbackOptions, setFeedbackOptions] = useState([])
    const [selectedFeedbackOption, setSelectedFeedbackOption] = useState(0) //.

    const [commentString, setCommentString] = useState('')
    const [enterCancelClicked, setEnterCancelClicked] = useState(false) //..
    const [lrtVisible, setLrtVisible] = useState(true)

    const [fieldRange, setFieldRange] = useState({
        suggestedWeightRange: getInputRange(
            exercise?.exerciseSets?.map((set) => set.suggestedWeightRange),
        ),
        suggestedRepRange: getInputRange(
            exercise?.exerciseSets?.map((set) => set.suggestedRepRange),
        ),
        suggestedRIRRange: getInputRange(
            exercise?.exerciseSets?.map((set) => set.suggestedRIRRange),
        ),
    })
    const determinePlatform = () => {
        const platform = window.navigator.platform
        if (platform.indexOf('Win') !== -1) return 'Windows'
        if (platform.indexOf('Mac') !== -1) return 'Mac OS'
        if (platform.indexOf('Linux') !== -1) return 'Linux'
        if (platform.indexOf('iPhone') !== -1) return 'iOS'
        if (platform.indexOf('Android') !== -1) return 'Android'
        if (platform.indexOf('iPad') !== -1) return 'iPad'
        return 'Unknown'
    }
    useEffect(() => {
        setSelectedFeedbackOption(0)
    }, [feedbackOptions])

    useEffect(() => {
        if (enterCancelClicked) {
            console.log('updatedSession1......', updatedSession)
            setUpdatedSession((updatedSession) => {
                const updatedVariants = updatedSession.variants.map(
                    (variant) => {
                        const updatedExercises = variant.exercises.map(
                            (variantExercise) => {
                                // Check if the exercise matches the one you want to update
                                if (
                                    variantExercise.exerciseInfoRef.name ===
                                    exercise.exerciseInfoRef.name
                                ) {
                                    const cmtString = commentsArray
                                        .map((item) => ` •${item}`)
                                        .join('')
                                    variantExercise.feedbackComment = cmtString
                                    // variantExercise.exerciseComment = exercise.exerciseComment; //?
                                    // variantExercise.load = exercise?.load || 'pair';
                                    // variantExercise.reps = exercise?.reps || 'reps';
                                    // variantExercise.tempo = exercise?.tempo || '3111';
                                }
                                return variantExercise
                            },
                        )

                        return {
                            ...variant,
                            exercises: updatedExercises,
                        }
                    },
                )

                return {
                    ...updatedSession,
                    variants: updatedVariants,
                }
            })
        }
        setEnterCancelClicked(false)
    }, [enterCancelClicked])

    useEffect(() => {
        const cmt = exercise.feedbackComment
        if (cmt && cmt.length > 0) {
            const newArray = cmt.split(' •')
            if (newArray.length > 0 && newArray[0] === '') {
                newArray.shift()
            }
            setCommentsArray(newArray)
        }
    }, [])

    useEffect(() => {
        setPlatform(determinePlatform())
    }, [])

    useEffect(() => {
        if (
            exercise?.load != null ||
            exercise?.reps != null ||
            exercise?.tempo != null
        ) {
            setLrtVisible(false)
        }
    }, [])

    useEffect(() => {
        if (exercise.feedbackComment) {
            console.log('exercise.feedbackComment', exercise.feedbackComment)
            const comments = exercise.feedbackComment.split(' •')
            // Remove the empty first element if there's one
            if (comments.length > 0 && comments[0] === '') {
                comments.shift()
            }
            console.log('comments', comments)
            if (
                comments.length === 1 &&
                comments[0] === exercise.feedbackComment
            ) {
                // If exercise.feedbackComment doesn't contain '•', treat it as a single comment.
                setCommentsArray([exercise.feedbackComment])
            } else {
                setCommentsArray(comments)
            }
        } else {
            // If exercise.feedbackComment is empty, leave commentsArray empty.
            setCommentsArray([])
        }
    }, [exercise.feedbackComment])

    const deleteCommentfromArray = async (cmt, index) => {
        try {
            //console.log("setIndex ....", setIndex);
            //console.log("deleteSet ", setIndex);
            const updatedCommentsArray = [...commentsArray]
            console.log('updatedCommentsArray ', updatedCommentsArray)
            updatedCommentsArray.splice(index, 1) // Remove the set at the specified index
            // Update the exercise object with the updated exercise sets
            // exercise.exerciseSets = updatedCommentArray
            // setEditedExerciseSets(updatedExerciseSets)
            // // You can also update the exercise object in your state if needed:
            // setExercise({ ...exercise })
            console.log('updatedCommentsArraynow... ', updatedCommentsArray)

            setCommentsArray(updatedCommentsArray)
            const cmtString = updatedCommentsArray
                .map((item) => ` •${item}`)
                .join('')
            console.log('commentstring', cmtString)
            // setCommentString(cmtString);
            exercise.feedbackComment = cmtString
            setExercise({ ...exercise })
            setEnterCancelClicked(true) //..
            const response = await axios.delete(
                //fc
                `/trainers/deleteFeedback?name=${cmt}&exerciseInfoRef=${exercise.exerciseInfoRef._id}&clientId=${clientId}&routineRef=${routineRef}`,
            )
            console.log('Response..................................', response)
            await fetchActiveCycle()
            console.log('Response..................................')
        } catch (error) {
            console.log('Error while updating comment array:', error)
        }
    }
    const updateFeedbackOptions = async (searchText) => {
        // const clientId = location.pathname.split('/')[2]
        //setLoading(true)
        try {
            // const response = await axios.get(
            //     `/workoutpnp/cycles/exercise?name=${searchText}&clientId=${clientId}`,
            // )
            // setOptions(response?.data?.exercises)
            // setLoading(false)
            // setError(false)
            console.log('searchText....', searchText)
            console.log('exerciseInfoRef....', exercise.exerciseInfoRef)
            console.log('comment..........', comment)
            if (searchText == '') {
                //||searchText.length < 2
                setFeedbackOptions([])
                return
            }

            // const response = await axios.get(
            //     `/workoutpnp/sessions/searchFeedbacks?name=${searchText}&exerciseInfoRef=${exercise.exerciseInfoRef._id}`,
            // )
            const response = await axios.get(
                `/trainers/feedbacks?name=${searchText}&exerciseInfoRef=${exercise.exerciseInfoRef._id}`,
            )
            console.log('Response..................................', response)

            // const encodedName = encodeURIComponent(comment);
            // const encodedExerciseInfoRef = encodeURIComponent(exercise.exerciseInfoRef._id);

            // const response = await axios.get(
            //     `/workoutpnp/sessions/searchFeedbacks?name=${encodedName}&exerciseInfoRef=${encodedExerciseInfoRef}`
            // );
            console.log('comments..', response?.data?.comments)
            //  setOptions(response?.data)
            setFeedbackOptions(response.data.comments)
            console.log('options..', feedbackOptions)
            //setLoading(false)
            // setError(false)
        } catch (error) {
            // setError('Error 500')a
            console.log(error)
        }
    }
    const selectFeedbackOption = async (option) => {
        commentsArray.push(option)

        console.log('comment array..', commentsArray)
        setCommentsArray(commentsArray)
        //  const commentString = commentArray.join('•');
        const cmtString = commentsArray.map((item) => ` •${item}`).join('')
        console.log(cmtString)
        setCommentString(cmtString)
        exercise.feedbackComment = cmtString
        setExercise({ ...exercise })
        console.log('exr..', exercise)
        // setExercise({ ...exercise });
        setFeedbackOptions([])
        const response = await axios.put(
            //fc
            `/trainers/addFeedback?name=${option}&exerciseInfoRef=${exercise.exerciseInfoRef._id}&clientId=${clientId}&routineRef=${routineRef}`,
        )
        console.log('Response..................................', response)
        await fetchActiveCycle()
    }
    // useEffect(() => {
    //     const newFieldRange = {
    //         weightRange: getInputRange(
    //             exercise?.exerciseSets?.map((set) => set.suggestedWeightRange),
    //         ),
    //         repsRange: getInputRange(
    //             exercise?.exerciseSets?.map((set) => set.suggestedRepRange),
    //         ),
    //         RIRRange: getInputRange(
    //             exercise?.exerciseSets?.map((set) => set.suggestedRIRRange),
    //         ),
    //     }
    //     setFieldRange(newFieldRange)
    // }, [])
    const selectOption = (option) => {
        setExerciseText({ name: option?.name, gifUrl: option?.gifUrl })
        if (option.exerciseComment && getComment) {
            exercise.exerciseComment = option?.exerciseComment
            delete option.exerciseComment
        } else if (exercise.exerciseComment) {
            exercise.exerciseComment = null
        }

        if (option.load) {
            exercise.load = option?.load
            delete option.load
            setLrtVisible(false)
        } else {
            exercise.load = null
        }
        if (option.reps) {
            exercise.reps = option?.reps
            delete option.reps
            setLrtVisible(false)
        } else {
            exercise.reps = null
        }
        if (option.tempo) {
            exercise.tempo = option?.tempo
            delete option.tempo
            setLrtVisible(false)
        } else {
            exercise.tempo = null
        }

        exercise.exerciseInfoRef = option
        if (option?.feedbackComment) {
            if (!forCycle) {
                exercise.feedbackComment = option?.feedbackComment
            }
            delete option.feedbackComment
        } else if (exercise.feedbackComment) {
            exercise.feedbackComment = null
        }
        if (autoPrefill) {
            prefillSet(option._id, exercise)
        } else {
            exercise.exerciseSets = [
                {
                    number: 1,
                    suggestedWeightRange: [],
                    suggestedRepRange: [10, 15],
                    suggestedRIRRange: [1, 3],
                },
                {
                    number: 2,
                    suggestedWeightRange: [],
                    suggestedRepRange: [10, 15],
                    suggestedRIRRange: [1, 3],
                },
                {
                    number: 3,
                    suggestedWeightRange: [],
                    suggestedRepRange: [10, 15],
                    suggestedRIRRange: [1, 3],
                },
            ]
            setExercise(exercise)
            updateFieldRange()
        }
        setOptions([])
    }
    const prefillSet = async (exerciseId, exercise) => {
        const clientId = location.pathname.split('/')[2]
        try {
            setTableLoading(true)
            const response = await axios.get(
                `/workoutpnp/cycles/exerciseSet?clientId=${clientId}&exerciseId=${exerciseId}`,
            )
            exercise.exerciseSets = response.data
            setExercise(exercise)
            updateFieldRange()
            setTableLoading(false)
        } catch (error) {
            setError('Error 500')
        }
    }
    const updateFieldRange = () => {
        const newFieldRange = {
            suggestedWeightRange: getInputRange(
                exercise?.exerciseSets?.map((set) => set.suggestedWeightRange),
            ),
            suggestedRepRange: getInputRange(
                exercise?.exerciseSets?.map((set) => set.suggestedRepRange),
            ),
            suggestedRIRRange: getInputRange(
                exercise?.exerciseSets?.map((set) => set.suggestedRIRRange),
            ),
        }
        setFieldRange(newFieldRange)
    }
    const updateOptions = async (searchText) => {
        const clientId = location.pathname.split('/')[2]
        setLoading(true)
        try {
            const response = await axios.get(
                `/workoutpnp/cycles/exercise?name=${searchText}&clientId=${clientId}`,
            )
            console.log(
                'response?.data?.exercises....',
                response?.data?.exercises,
            )
            setOptions(response?.data?.exercises)
            setLoading(false)
            setError(false)
        } catch (error) {
            setError('Error 500')
        }
    }

    const onChangeHandler = (evt) => {
        const searchText = evt.target.value
        setExerciseText(searchText)
        updateOptions(searchText)
    }
    const fieldValueChange = (value, fieldName, range) => {
        let isDecimal = false
        if (
            value[value.length - 1] == '.' &&
            fieldName === 'suggestedWeightRange'
        ) {
            isDecimal = true
        }
        let newRange = fieldRange[fieldName]
        newRange[range] = isNaN(value)
            ? null
            : value === ''
            ? null
            : parseFloat(value)
        if (range == 0 && newRange[range] == null) {
            newRange[1] = null
        }
        let newFieldRange = { ...fieldRange }
        let newExercise = JSON.parse(JSON.stringify(exercise))
        newExercise.exerciseSets.map((set) => {
            set[fieldName][range] =
                newRange[range] == null
                    ? null
                    : JSON.parse(JSON.stringify(newRange[range]))
            if (range == 0) {
                if (newRange[range] == null) {
                    set[fieldName][1] = null
                } else {
                    if (set[fieldName].length == 2) {
                        if (set[fieldName][1] <= newRange[range]) {
                            set[fieldName][1] = JSON.parse(
                                JSON.stringify(newRange[range]),
                            )
                        }
                    } else {
                        set[fieldName][1] = JSON.parse(
                            JSON.stringify(newRange[range]),
                        )
                        newFieldRange[fieldName][1] = JSON.parse(
                            JSON.stringify(newRange[range]),
                        )
                    }
                }
            }
        })
        if (range == 0 && newFieldRange[fieldName][1] <= newRange[range]) {
            newFieldRange[fieldName][1] = JSON.parse(
                JSON.stringify(newRange[range]),
            )
        }
        setExercise(newExercise)
        if (isDecimal && newRange[range] !== null) {
            newRange[range] += '.'
        }
        if (
            value[value?.length - 2] == '.' &&
            value[value?.length - 1] == '0'
        ) {
            newRange[range] += '.0'
        } else if (value.includes('.') && value[value?.length - 1] == '0') {
            newRange[range] += '0'
        }

        newFieldRange[fieldName] = newRange
        setFieldRange(newFieldRange)
    }

    const onBlurFieldHandler = (range) => {
        let val = fieldRange['suggestedWeightRange'][range]
        const newFieldRange = { ...fieldRange }
        if (val?.[val?.length - 1] === '.') {
            val = val.split('.')[0]
        }
        newFieldRange['suggestedWeightRange'][range] = isNaN(parseFloat(val))
            ? null
            : parseFloat(val)
        setFieldRange(newFieldRange)
    }

    const onBlurValueHandler = (idx, range) => {
        console.log('onBlurValueHandler ', idx) //?
        const setD = [...exercise.exerciseSets]
        let val = setD[idx]['suggestedWeightRange'][range]
        if (val?.[val?.length - 1] === '.') {
            val = val.split('.')[0]
        }
        setD[idx]['suggestedWeightRange'][range] = isNaN(parseFloat(val))
            ? null
            : parseFloat(val)

        setExercise({ ...exercise, exerciseSets: setD })
    }
    const onValueChange = (idx, value, fieldname, range) => {
        console.log('onValueChange ', value) //?
        const setD = [...exercise.exerciseSets]
        let isDecimal = false
        if (
            value[value?.length - 1] === '.' &&
            fieldname === 'suggestedWeightRange'
        ) {
            isDecimal = true
        }
        if (isNaN(value)) {
            if (value == '' || isNaN(value[0])) {
                setD[idx][fieldname][range] = null
                setExercise({ ...exercise, exerciseSets: setD })
            }
            return
        }
        if (value === '' || value === '.' || value === null) {
            setD[idx][fieldname][range] = null
            if (range == 0) {
                setD[idx][fieldname][1] = null
            }
        } else {
            let newValue = parseFloat(value)
            if (isDecimal && setD[idx][fieldname][range] !== null) {
                newValue += '.'
            }
            if (
                value[value?.length - 2] == '.' &&
                value[value?.length - 1] == '0'
            ) {
                newValue += '.0'
            } else if (value.includes('.') && value[value.length - 1] == '0') {
                newValue += '0'
            }
            setD[idx][fieldname][range] = newValue
            if (range == 0) {
                if (
                    !setD[idx][fieldname][1] ||
                    setD[idx][fieldname][1] <= newValue
                ) {
                    setD[idx][fieldname][1] = newValue
                }
            }
            // parseFloat(value)
        }

        setExercise({ ...exercise, exerciseSets: setD })
        let newFieldRange = {
            ...fieldRange,
        }
        newFieldRange[fieldname] = getInputRange(
            exercise?.exerciseSets?.map((set) => set[fieldname]),
        )
        setFieldRange(newFieldRange)
    }

    // const onCommentChange = (inputComment) => {
    //     const comment = inputComment
    //     console.log("input comment: ", inputComment);
    //     if (comment.length) {
    //         setExercise({ ...exercise, exerciseComment: comment })
    //     } else {
    //         if (exercise.exerciseComment) {
    //             setExercise({ ...exercise, exerciseComment: undefined })
    //         }
    //     }
    // }
    const onCommentChange = (inputComment) => {
        //console.log("input comment: ", inputComment);
        //setEnterCancelClicked(true);              //?
        if (inputComment.length) {
            exercise.exerciseComment = inputComment
            setExercise({ ...exercise })
        } else {
            if (exercise.exerciseComment) {
                exercise.exerciseComment = undefined
                setExercise({ ...exercise })
            }
        }
    }
    const onLoadChange = (selectedLoad) => {
        console.log('selectedLoad...', selectedLoad)
        if (selectedLoad != exercise?.load) {
            exercise.load = selectedLoad
            exercise.reps = exercise?.reps || 'reps'
            exercise.tempo = exercise?.tempo || '3111'
            setExercise({ ...exercise })
        }

        console.log('exercise...', exercise)
        // setEnterCancelClicked(true);
    }
    const onRepsChange = (selectedReps) => {
        if (selectedReps !== exercise?.reps) {
            exercise.reps = selectedReps
            exercise.load = exercise?.load || 'pair'
            exercise.tempo = exercise?.tempo || '3111'
            setExercise({ ...exercise })
        }
        // setEnterCancelClicked(true);
    }

    const onTempoChange = (selectedTempo) => {
        if (selectedTempo !== exercise?.tempo) {
            exercise.tempo = selectedTempo
            exercise.load = exercise?.load || 'pair'
            exercise.reps = exercise?.reps || 'reps'
            setExercise({ ...exercise })
        }
        // setEnterCancelClicked(true);
    }

    const onFeedbackChange = (inputFeedback) => {
        // const feedback = inputFeedback.trim()
        if (inputFeedback.length) {
            exercise.feedbackComment = inputFeedback
            setExercise({ ...exercise })
        } else {
            if (exercise.feedbackComment) {
                exercise.feedbackComment = undefined
                setExercise({ ...exercise })
            }
        }
    }
    const resetSetNumber = (setD) => {
        return setD.map((set, idx) => {
            return { ...set, number: idx + 1 }
        })
    }

    const deleteRow = (idx) => {
        var setD = exercise?.exerciseSets
        setD.splice(idx, 1)
        setD = resetSetNumber(setD)
        setExercise({ ...exercise, exerciseSets: setD })
    }

    const addRow = () => {
        // console.log({...exercise})
        // var setD = [
        //     ...exercise?.exerciseSets,
        //     {
        //         //setNumber: exercise?.exerciseSets?.length + 1,
        //         suggestedWeightRange: [],
        //         suggestedRepRange: [10,15],
        //         suggestedRIRRange: [1,3],
        //     },
        // ]
        exercise?.exerciseSets?.length != 0
            ? exercise?.exerciseSets.push({
                  number: exercise?.exerciseSets?.length + 1,
                  suggestedWeightRange: JSON.parse(
                      JSON.stringify(
                          exercise?.exerciseSets[
                              exercise?.exerciseSets?.length - 1
                          ]?.suggestedWeightRange,
                      ),
                  ),
                  suggestedRepRange: JSON.parse(
                      JSON.stringify(
                          exercise?.exerciseSets[
                              exercise?.exerciseSets?.length - 1
                          ]?.suggestedRepRange,
                      ),
                  ),
                  suggestedRIRRange: JSON.parse(
                      JSON.stringify(
                          exercise?.exerciseSets[
                              exercise?.exerciseSets?.length - 1
                          ]?.suggestedRIRRange,
                      ),
                  ),
              })
            : exercise?.exerciseSets.push({
                  number: exercise?.exerciseSets?.length + 1,
                  suggestedWeightRange: [],
                  suggestedRepRange: [10, 15],
                  suggestedRIRRange: [1, 3],
              })
        setExercise(exercise)
        //setExercise({ ...exercise, exerciseSets: setD })
    }

    return (
        <>
            <div className="table-edit-exercise-mobile">
                <input
                    className="exercise-input"
                    value={exerciseText?.name}
                    placeholder="Exercise name"
                    onChange={onChangeHandler}
                />
                {/* Unfixed Warning here {console.log(exerciseText?.name)} */}
                {loading ? (
                    <Loader />
                ) : error ? (
                    <InternalServerErrorPage />
                ) : (
                    options?.map((o, idx) => (
                        <div
                            key={idx}
                            className="exercise-option"
                            onClick={() => selectOption(o)}
                        >
                            {o?.name}
                        </div>
                    ))
                )}
            </div>

            <div className="table-row-container table-editable-body">
                <div className="table-exercise">
                    <div>
                        <div className="selected-option">
                            {exerciseText?.name == null ? null : platform ===
                              'iOS' ? null : (
                                <div className="exercise-video-gif">
                                    <video
                                        className="exercise-video"
                                        src={exerciseText?.gifUrl}
                                        autoPlay
                                        loop
                                    />
                                </div>
                            )}
                            <input
                                className="exercise-input"
                                value={exerciseText?.name}
                                placeholder="Exercise name"
                                onChange={onChangeHandler}
                            />
                        </div>
                        {lrtVisible ? (
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                {/* Load Dropdown */}
                                {/* <select className="exercise-dropdown" onChange={onLoadChange}> */}
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        flex: 3,
                                        paddingBottom: '5px',
                                    }}
                                >
                                    <span style={{ flex: 1 }}>load</span>
                                    <select
                                        className="exercise-dropdown"
                                        value={exercise?.load || 'pair'}
                                        onChange={(e) =>
                                            onLoadChange(e.target.value)
                                        }
                                    >
                                        {' '}
                                        <option value="pair">pair</option>31
                                        <option value="total">total</option>
                                        <option value="bodyweight">
                                            bodyweight
                                        </option>
                                        <option value="height">height</option>
                                    </select>
                                </div>
                                {/* Reps Dropdown */}
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        flex: 3,
                                        paddingBottom: '5px',
                                    }}
                                >
                                    <span style={{ flex: 1 }}>reps</span>
                                    <select
                                        className="exercise-dropdown"
                                        value={exercise?.reps || 'reps'}
                                        onChange={(e) =>
                                            onRepsChange(e.target.value)
                                        }
                                    >
                                        <option value="reps">reps</option>
                                        <option value="seconds">seconds</option>
                                        <option value="minutes">minutes</option>
                                    </select>
                                </div>

                                {/* Tempo Dropdown */}
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        flex: 3,
                                    }}
                                >
                                    <span style={{ flex: 1 }}>tempo</span>
                                    <select
                                        className="exercise-dropdown"
                                        value={exercise?.tempo || '3111'}
                                        onChange={(e) =>
                                            onTempoChange(e.target.value)
                                        }
                                    >
                                        <option value="3111">3111</option>
                                        <option value="4222">4222</option>
                                        <option value="5221">5221</option>
                                        <option value="3231">3231</option>
                                        <option value="4131">4131</option>
                                        <option value="none">none</option>
                                    </select>
                                </div>
                            </div>
                        ) : (
                            <div
                                className="edit-LRT"
                                onClick={() => setLrtVisible(true)}
                            >
                                Edit LRT
                            </div>
                        )}
                    </div>
                    {loading ? (
                        <Loader />
                    ) : error ? (
                        <InternalServerErrorPage />
                    ) : (
                        options?.map((o, idx) => (
                            <div
                                key={idx}
                                className="exercise-option"
                                onClick={() => selectOption(o)}
                            >
                                {platform === 'iOS' ? null : (
                                    <div className="exercise-video-gif">
                                        <video
                                            className="exercise-video"
                                            src={exerciseText?.gifUrl}
                                            autoPlay
                                            loop
                                        />
                                    </div>
                                )}
                                {o?.name}
                            </div>
                        ))
                    )}
                </div>
                {tableLoading ? (
                    <div
                        className="table-details"
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Loader />
                    </div>
                ) : (
                    <div className="table-details">
                        <div className="table-detail-row table-head">
                            <div className="table-sets">
                                {exercise?.exerciseSets?.length}
                            </div>
                            <div
                                className={`table-weights input-container ${
                                    fieldRange?.suggestedWeightRange[0]
                                        ?.toString()
                                        ?.includes('.') && 'table-weights-dec'
                                }`}
                            >
                                <input
                                    className={`table-weights table-weights-input header-input ${
                                        fieldRange?.suggestedWeightRange[0]
                                            ?.toString()
                                            ?.includes('.') &&
                                        'table-weights-input-dec'
                                    }`}
                                    value={
                                        fieldRange?.suggestedWeightRange[0] ==
                                        null
                                            ? ''
                                            : fieldRange
                                                  ?.suggestedWeightRange[0]
                                    }
                                    onChange={(e) => {
                                        fieldValueChange(
                                            e.target.value,
                                            'suggestedWeightRange',
                                            0,
                                        )
                                    }}
                                    onBlur={() => {
                                        onBlurFieldHandler(0)
                                    }}
                                    type="text"
                                    maxLength={
                                        fieldRange?.suggestedWeightRange[0]
                                            ?.toString()
                                            ?.includes('.')
                                            ? fieldRange.suggestedWeightRange[0]
                                                  .toString()
                                                  .split('.')[0].length + 3
                                            : 3
                                        // 5
                                    }
                                    onKeyDown={(e) => {
                                        if (
                                            e.key != '.' &&
                                            invalidChars.includes(e.key)
                                        ) {
                                            e.preventDefault()
                                        }
                                    }}
                                />
                                {fieldRange?.suggestedWeightRange[0] == null ? (
                                    <></>
                                ) : (
                                    <input
                                        className={`table-weights table-weights-input header-input ${
                                            fieldRange?.suggestedWeightRange[1]
                                                ?.toString()
                                                ?.includes('.') &&
                                            'table-weights-input-dec'
                                        }`}
                                        value={
                                            fieldRange
                                                ?.suggestedWeightRange[1] ==
                                            null
                                                ? ''
                                                : fieldRange
                                                      ?.suggestedWeightRange[1]
                                        }
                                        onChange={(e) => {
                                            fieldValueChange(
                                                e.target.value,
                                                'suggestedWeightRange',
                                                1,
                                            )
                                        }}
                                        onBlur={() => {
                                            onBlurFieldHandler(1)
                                        }}
                                        type="text"
                                        maxLength={
                                            fieldRange?.suggestedWeightRange[1]
                                                ?.toString()
                                                ?.includes('.')
                                                ? fieldRange.suggestedWeightRange[1]
                                                      .toString()
                                                      .split('.')[0].length + 3
                                                : 3
                                            // 5
                                        }
                                        onKeyDown={(e) => {
                                            if (
                                                e.key != '.' &&
                                                invalidChars.includes(e.key)
                                            ) {
                                                e.preventDefault()
                                            }
                                        }}
                                    />
                                )}
                            </div>
                            <div className="table-reps input-container">
                                <input
                                    className="table-weights header-input table-weights-input"
                                    value={
                                        fieldRange?.suggestedRepRange[0] == null
                                            ? ''
                                            : fieldRange?.suggestedRepRange[0]
                                    }
                                    onChange={(e) => {
                                        fieldValueChange(
                                            e.target.value,
                                            'suggestedRepRange',
                                            0,
                                        )
                                    }}
                                    onKeyDown={(e) => {
                                        if (invalidChars.includes(e.key)) {
                                            e.preventDefault()
                                        }
                                    }}
                                    onInput={(e) => {
                                        e.target.value = e.target.value.slice(
                                            0,
                                            3,
                                        )
                                    }}
                                />
                                {fieldRange?.suggestedRepRange[0] == null ? (
                                    <></>
                                ) : (
                                    <input
                                        className="table-weights header-input table-weights-input"
                                        value={
                                            fieldRange?.suggestedRepRange[1] ==
                                            null
                                                ? ''
                                                : fieldRange
                                                      ?.suggestedRepRange[1]
                                        }
                                        onChange={(e) => {
                                            fieldValueChange(
                                                e.target.value,
                                                'suggestedRepRange',
                                                1,
                                            )
                                        }}
                                        onKeyDown={(e) => {
                                            if (invalidChars.includes(e.key)) {
                                                e.preventDefault()
                                            }
                                        }}
                                        onInput={(e) => {
                                            e.target.value =
                                                e.target.value.slice(0, 3)
                                        }}
                                    />
                                )}
                            </div>
                            <div className="table-reps input-container">
                                <input
                                    className="table-weights header-input table-weights-input"
                                    value={
                                        fieldRange?.suggestedRIRRange[0] == null
                                            ? ''
                                            : fieldRange?.suggestedRIRRange[0]
                                    }
                                    onChange={(e) => {
                                        fieldValueChange(
                                            e.target.value,
                                            'suggestedRIRRange',
                                            0,
                                        )
                                    }}
                                    onKeyDown={(e) => {
                                        if (invalidChars.includes(e.key)) {
                                            e.preventDefault()
                                        }
                                    }}
                                    onInput={(e) => {
                                        e.target.value = e.target.value.slice(
                                            0,
                                            2,
                                        )
                                    }}
                                />
                                {fieldRange?.suggestedRIRRange[0] == null ? (
                                    <></>
                                ) : (
                                    <input
                                        className="table-weights header-input table-weights-input"
                                        value={
                                            fieldRange?.suggestedRIRRange[1] ==
                                            null
                                                ? ''
                                                : fieldRange
                                                      ?.suggestedRIRRange[1]
                                        }
                                        onChange={(e) => {
                                            fieldValueChange(
                                                e.target.value,
                                                'suggestedRIRRange',
                                                1,
                                            )
                                        }}
                                        onKeyDown={(e) => {
                                            if (invalidChars.includes(e.key)) {
                                                e.preventDefault()
                                            }
                                        }}
                                        onInput={(e) => {
                                            e.target.value =
                                                e.target.value.slice(0, 2)
                                        }}
                                    />
                                )}
                            </div>
                            <div className="table-action">
                                <Icon
                                    icon={'ep:close-bold'}
                                    onClick={deleteExercise}
                                    className="close-rest-img ms-1"
                                    height={13}
                                />
                            </div>
                        </div>
                        {exercise?.exerciseSets?.map((set, idx) => (
                            <div key={idx} className="table-detail-row">
                                <div className="table-sets">{idx + 1}</div>
                                <div
                                    className={`table-weights input-container ${
                                        fieldRange?.suggestedWeightRange[0]
                                            ?.toString()
                                            ?.includes('.') &&
                                        'table-weights-dec'
                                    }`}
                                >
                                    <input
                                        min="0"
                                        className={`table-weights table-weights-input ${
                                            set?.suggestedWeightRange[0]
                                                ?.toString()
                                                ?.includes('.') &&
                                            'table-weights-input-dec'
                                        }`}
                                        value={
                                            set?.suggestedWeightRange[0] == null
                                                ? ''
                                                : set?.suggestedWeightRange[0]
                                        }
                                        onChange={(evt) => {
                                            onValueChange(
                                                idx,
                                                evt?.target?.value,
                                                'suggestedWeightRange',
                                                0,
                                            )
                                        }}
                                        onBlur={() => {
                                            onBlurValueHandler(idx, 0)
                                        }}
                                        type="text"
                                        maxLength={
                                            set?.suggestedWeightRange[0]
                                                ?.toString()
                                                ?.includes('.')
                                                ? set.suggestedWeightRange[0]
                                                      .toString()
                                                      .split('.')[0].length + 3
                                                : 3
                                            // 5
                                        }
                                        onKeyDown={(e) => {
                                            if (
                                                e.key != '.' &&
                                                invalidChars.includes(e.key)
                                            ) {
                                                e.preventDefault()
                                            }
                                        }}
                                    />
                                    {set.suggestedWeightRange[0] != null ? (
                                        <input
                                            type="text"
                                            maxLength={
                                                set?.suggestedWeightRange[1]
                                                    ?.toString()
                                                    ?.includes('.')
                                                    ? set.suggestedWeightRange[1]
                                                          .toString()
                                                          .split('.')[0]
                                                          .length + 3
                                                    : 3
                                            }
                                            min={
                                                Number(
                                                    set.suggestedWeightRange[0],
                                                ) + 1
                                            }
                                            className={`table-weights table-weights-input ${
                                                fieldRange?.suggestedWeightRange[1]
                                                    ?.toString()
                                                    ?.includes('.') &&
                                                'table-weights-input-dec'
                                            }`}
                                            value={
                                                set?.suggestedWeightRange[1] ==
                                                null
                                                    ? ''
                                                    : set
                                                          ?.suggestedWeightRange[1]
                                            }
                                            onChange={(evt) =>
                                                onValueChange(
                                                    idx,
                                                    evt?.target?.value,
                                                    'suggestedWeightRange',
                                                    1,
                                                )
                                            }
                                            onBlur={() => {
                                                onBlurValueHandler(idx, 1)
                                            }}
                                            onKeyDown={(e) => {
                                                if (
                                                    e.key != '.' &&
                                                    invalidChars.includes(e.key)
                                                ) {
                                                    e.preventDefault()
                                                }
                                            }}
                                        />
                                    ) : null}
                                </div>
                                <div className="input-container">
                                    <input
                                        //required
                                        type="number"
                                        min={0}
                                        className="table-reps table-reps-input"
                                        value={
                                            set?.suggestedRepRange[0] == null
                                                ? ''
                                                : set?.suggestedRepRange[0]
                                        }
                                        onChange={(evt) =>
                                            onValueChange(
                                                idx,
                                                evt?.target?.value,
                                                'suggestedRepRange',
                                                0,
                                            )
                                        }
                                        onKeyDown={(e) => {
                                            if (invalidChars.includes(e.key)) {
                                                e.preventDefault()
                                            }
                                        }}
                                        onInput={(e) => {
                                            e.target.value =
                                                e.target.value.slice(0, 2)
                                        }}
                                    />
                                    {set.suggestedRepRange[0] != null ? (
                                        <input
                                            //required
                                            type="number"
                                            min={0}
                                            className="table-reps table-reps-input"
                                            value={
                                                set?.suggestedRepRange[1] ==
                                                null
                                                    ? ''
                                                    : set?.suggestedRepRange[1]
                                            }
                                            onChange={(evt) =>
                                                onValueChange(
                                                    idx,
                                                    evt?.target?.value,
                                                    'suggestedRepRange',
                                                    1,
                                                )
                                            }
                                            onKeyDown={(e) => {
                                                if (
                                                    invalidChars.includes(e.key)
                                                ) {
                                                    e.preventDefault()
                                                }
                                            }}
                                            onInput={(e) => {
                                                e.target.value =
                                                    e.target.value.slice(0, 2)
                                            }}
                                        />
                                    ) : null}
                                </div>

                                <div className="input-container">
                                    <input
                                        type="number"
                                        min={0}
                                        className="table-reps table-reps-input"
                                        value={
                                            set?.suggestedRIRRange[0] == null
                                                ? ''
                                                : set?.suggestedRIRRange[0]
                                        }
                                        onChange={(evt) =>
                                            onValueChange(
                                                idx,
                                                evt?.target?.value,
                                                'suggestedRIRRange',
                                                0,
                                            )
                                        }
                                        onKeyDown={(e) => {
                                            if (invalidChars.includes(e.key)) {
                                                e.preventDefault()
                                            }
                                        }}
                                        onInput={(e) => {
                                            e.target.value =
                                                e.target.value.slice(0, 2)
                                        }}
                                    />
                                    {set.suggestedRIRRange[0] != null ? (
                                        <input
                                            //required
                                            type="number"
                                            min={0}
                                            className="table-reps table-reps-input"
                                            value={
                                                set?.suggestedRIRRange[1] ==
                                                null
                                                    ? ''
                                                    : set?.suggestedRIRRange[1]
                                            }
                                            onChange={(evt) =>
                                                onValueChange(
                                                    idx,
                                                    evt?.target?.value,
                                                    'suggestedRIRRange',
                                                    1,
                                                )
                                            }
                                            onKeyDown={(e) => {
                                                if (
                                                    invalidChars.includes(e.key)
                                                ) {
                                                    e.preventDefault()
                                                }
                                            }}
                                            onInput={(e) => {
                                                e.target.value =
                                                    e.target.value.slice(0, 2)
                                            }}
                                        />
                                    ) : null}
                                </div>
                                <div className="table-action">
                                    <Icon
                                        icon={'ep:close-bold'}
                                        className="close-rest-img ms-1"
                                        onClick={() => deleteRow(idx)}
                                        height={13}
                                    />
                                </div>
                            </div>
                        ))}
                        <Button
                            classNames="add-session-btn"
                            onClick={() => addRow()}
                            text={'+ Add Set'}
                            size={'s'}
                        />
                    </div>
                )}
                <div className="comment-container">
                    <div>
                        <Icon
                            icon="fa-regular:sticky-note"
                            height={25}
                            color="white"
                        />
                    </div>
                    <TextArea
                        divClassNames={'comment-textarea-container'}
                        inputClassNames={'comment-textarea'}
                        onChange={(e) => onCommentChange(e.target.value)}
                        rows="1"
                        cols="500"
                        placeholder={'Write your comment here'}
                        value={exercise?.exerciseComment || ''}
                        maxLength={2000}
                    />
                </div>

                {showFeedback && (
                    <div className="feedbacks">
                        <textarea
                            rows={3}
                            className="new-comment-box"
                            placeholder="Add Feedback"
                            value={comment}
                            onChange={(event) => {
                                console.log('etv..........', event.target.value)
                                setComment(event.target.value)

                                updateFeedbackOptions(event.target.value)
                            }}
                            onKeyDown={async (event) => {
                                if (
                                    event.key === 'PageUp' ||
                                    event.key === 'ArrowUp'
                                ) {
                                    // Handle PageUp or ArrowUp key press to move selection up
                                    event.preventDefault()
                                    setSelectedFeedbackOption(
                                        selectedFeedbackOption === 0
                                            ? feedbackOptions.length - 1
                                            : selectedFeedbackOption - 1,
                                    )
                                } else if (
                                    event.key === 'PageDown' ||
                                    event.key === 'ArrowDown'
                                ) {
                                    // Handle PageDown or ArrowDown key press to move selection down
                                    event.preventDefault()
                                    setSelectedFeedbackOption(
                                        selectedFeedbackOption ===
                                            feedbackOptions.length - 1
                                            ? 0
                                            : selectedFeedbackOption + 1,
                                    )
                                } else if (
                                    (event.ctrlKey || event.metaKey) &&
                                    event.key === 'Enter'
                                ) {
                                    event.preventDefault() // Prevent the space character from being added
                                    const selected =
                                        feedbackOptions[selectedFeedbackOption]
                                    if (selected) {
                                        setComment(selected)
                                        setFeedbackOptions([]) // Clear the options
                                    }
                                } else if (
                                    event.key === 'Enter' &&
                                    comment.trim().length >= 1
                                ) {
                                    let arr = commentsArray
                                    arr.push(comment.trim())
                                    setCommentsArray(arr)
                                    setFeedbackOptions([]) // Clear the options
                                    setComment('') // Clear the textarea
                                    event.preventDefault() // Prevent the newline character from being added
                                    const cmtString = commentsArray
                                        .map((item) => ` •${item}`)
                                        .join('')
                                    setCommentString(cmtString)
                                    exercise.feedbackComment = cmtString
                                    setExercise({ ...exercise })
                                    setEnterCancelClicked(true) //..
                                    const response = await axios.put(
                                        //fc
                                        `/trainers/addFeedback?name=${event.target.value}&exerciseInfoRef=${exercise.exerciseInfoRef._id}&clientId=${clientId}&routineRef=${routineRef}`,
                                    )
                                    console.log(
                                        'Response..................................',
                                        response,
                                    )
                                    await fetchActiveCycle()
                                }
                            }}
                        />
                        <div className="feedback-comments">
                            {feedbackOptions?.map((o, index) => (
                                <div
                                    key={index}
                                    //className="feedback-option"
                                    className={`new-feedback-option ${
                                        index === selectedFeedbackOption
                                            ? 'selected'
                                            : ''
                                    }`}
                                    onClick={() => selectFeedbackOption(o)}
                                >
                                    {o}
                                </div>
                            ))}
                            {feedbackOptions &&
                                feedbackOptions.length < 1 &&
                                commentsArray.map((cmt, index) => (
                                    <div className="new-comment-array">
                                        <div>
                                            <FaDotCircle className="fadot" />
                                        </div>
                                        <div className="cmt-text1">{cmt}</div>
                                        <div>
                                            <FaTimes
                                                className="fatimes"
                                                onClick={() =>
                                                    deleteCommentfromArray(
                                                        cmt,
                                                        index,
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                ))}

                            {/* {
                            (commentsArray && commentsArray.length > 0) && (
                                commentsArray.map((cmt, index) => (
                                    <div className='new-comment-array'>
                                        <FaDotCircle
                                            className='fadot'
                                        />
                                        {cmt}
                                        <FaTimes
                                            className="fatimes"
                                            onClick={() => deleteCommentfromArray(cmt, index)}
                                        />
                                    </div>
                                ))
                            )
                        } */}
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

EditExercise.propTypes = {
    exercise: PropTypes.object,
    setExercise: PropTypes.func,
    deleteExercise: PropTypes.func,
}

export default EditExercise
