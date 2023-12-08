import React, { useState, useEffect } from 'react'
import { Image, Row } from 'react-bootstrap'
import PropTypes from 'prop-types'
import './index.scss'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import VideoPlayer from 'react-player'
import { ReactMediaRecorder } from 'react-media-recorder'
import AudioRecorder from '../../../Common/AudioRecorder'
import ReactPlayer from 'react-player'
import DVideoPlayer from './OfflinePlayer'
import axios from '../../../../store/axios-secure'
import { FaEdit, FaSave, FaTimes, FaDotCircle } from 'react-icons/fa'
import EditExercise from '../../EditExercise'
import Button from '../../../Common/Button'
import CustomModal from '../../../Common/Modal'
import ERMGraph from '../../../Common/ERMGraph'

const attributeHeading = ['Sets', 'Load', 'Reps', 'RIR']

const FeedbackCard = ({
    sessionId,
    routineRef,
    variantType,
    idx,
    exercise,
    setExercise,
    deleteExercise,
    modifier = (data) => {
        return data
    },
    setDisableSave,
    fetchActiveCycle,
    clientId,
    saveFeedClicked,
    setSaveFeedClicked,
    setFeedbackCompleted,
    setCanExerciseAdded,
    setExerciseUpdated,
}) => {
    const [form, setForm] = useState(exercise?.formRating ?? 0)
    //const [comment, setComment] = useState(exercise?.feedbackComment)
    const [comment, setComment] = useState('')
    const [isEditingCard, setIsEditingCard] = useState(false) // State to track edit mode
    const [showSuccessMessage, setShowSuccessMessage] = useState(false) //? for successMessage
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [enterName, setEnterName] = useState(false)
    let [weightT, setWeightT] = useState([])
    let [repT, setRepT] = useState([])
    let [rirT, setRirT] = useState([])
    const [ermData, setERMData] = useState()
    const [exerciseInfoRef1, setExerciseInfoRef1] = useState(
        exercise.exerciseInfoRef,
    )
    const [exerciseSets1, setExerciseSets1] = useState(exercise.exerciseSets)

    const [editedExerciseSets, setEditedExerciseSets] = useState(
        exercise?.exerciseSets || [],
    ) //?
    const [neutral, setNeutral] = useState(
        exercise?.exerciseInfoRef?.name ? true : false,
    )
    let [audioUrl, isRecording, startRecording, stopRecording, audioFile] =
        AudioRecorder()
    let [options, setOptions] = useState([])
    const [selectedOption, setSelectedOption] = useState(0) //.
    // const [commentArray, setCommentArray] = useState([]);
    const [commentString, setCommentString] = useState('')
    const [commentArray, setCommentArray] = useState([])
    const [showGraph, setShowGraph] = useState(false)
    const [timeperiod, setTimeperiod] = useState('monthly')

    useEffect(() => {
        setSelectedOption(0)
    }, [options])

    useEffect(() => {
        // const cmtString = " •The push-up engages your body from top  •this is Push Upjfhsjjjfs •do push up for good health •cool exercise •pu";
        // console.log("efc..........", exercise.feedbackComment)
        const cmt = exercise.feedbackComment
        // Use split(' •') to split the string into an array of elements
        if (cmt && cmt.length > 0) {
            const newArray = cmt.split(' •')
            // Remove the empty first element if there's one
            if (newArray.length > 0 && newArray[0] === '') {
                newArray.shift()
            }

            // Set the state with the new array
            //setComment(exercise.feedbackComment);
            setCommentArray(newArray)
        }
        // fetchERMDetails()
    }, []) // Empty dependency array to run this code only once on component mount

    const fetchERMDetails = async () => {
        const res = await axios.get(
            `trainers/getE1rm?clientId=${clientId}&exerciseInfoRefId=${
                exercise?.exerciseInfoRef?._id
            }&timeperiod=${timeperiod === 'last7workouts' ? '' : timeperiod}`,
        )
        setERMData(res?.data)
    }

    useEffect(() => {
        fetchERMDetails()
    }, [timeperiod])
    useEffect(() => {
        const cmt = exercise.feedbackComment
        if (cmt && cmt.length > 0) {
            const newArray = cmt.split(' •')
            if (newArray.length > 0 && newArray[0] === '') {
                newArray.shift()
            }
            setComment('')
            setCommentArray(newArray)
        } else {
            setComment('')
            setCommentArray([])
        }
        neutral ? setCanExerciseAdded(true) : setCanExerciseAdded(false)
    }, [neutral])

    useEffect(() => {
        if (saveFeedClicked) {
            // If saveFeedClicked is true, set isEditingCard to false
            setIsEditingCard(false)
            //  setEditedExerciseSets(exercise?.exerciseSets || []);
            setSaveFeedClicked(false)
        }
    }, [saveFeedClicked])

    // const getDashOrValue = (value) => (!value || value === -1 ? '-' : value)
    const getDashOrValue = (value) => {
        if (!value) {
            return '-'
        } else if (Array.isArray(value)) {
            if (
                value.length === 1 ||
                (value.length === 2 && value[0] == value[1])
            ) {
                return value[0]
            } else if (
                (value[0] === null || value[0] === '') &&
                value[1] !== null
            ) {
                return value[1]
            } else if (
                (value[1] === null || value[1] === '') &&
                value[0] !== null
            ) {
                return value[0]
            } else {
                return value.join('-')
            }
        } else {
            return value
        }
    }
    // const saveExercise = async () => {
    //     setNeutral(true);
    // }
    const handleAllSet = (key, value) => {
        const updatedExerciseSets = editedExerciseSets.map((set) => ({
            ...set,
            suggestedWeightRange:
                key == 'weight'
                    ? value.length == 2
                        ? value
                        : [set.suggestedWeightRange[0], value[0]]
                    : set.suggestedWeightRange,
            suggestedRepRange:
                key == 'rep'
                    ? value.length == 2
                        ? value
                        : [set.suggestedRepRange[0], value[0]]
                    : set.suggestedRepRange,
            suggestedRIRRange:
                key == 'rir'
                    ? value.length == 2
                        ? value
                        : [set.suggestedRIRRange[0], value[0]]
                    : set.suggestedRIRRange,
            // suggestedRepRange: set.performedRep === 0 ? [10, 15] : [set.performedReps, set.performedReps],
            // suggestedRIRRange: set.performedRIR === 0 ? [1, 3] : [set.performedRIR, set.performedRIR],
        }))
        key == 'weight'
            ? value.length == 2
                ? setWeightT([value[0], value[1]])
                : setWeightT([weightT[0], value[0]])
            : ''
        key == 'rep'
            ? value.length == 2
                ? setRepT([value[0], value[1]])
                : setRepT([repT[0], value[0]])
            : ''
        key == 'rir'
            ? value.length == 2
                ? setRirT([value[0], value[1]])
                : setRirT([rirT[0], value[0]])
            : ''
        // key == 'rep' ? setRepT([repT[0], value[0]]) : '';
        // key == 'rir' ? setRirT([rirT[0], value[0]]) : '';

        exercise.exerciseSets = updatedExerciseSets
        setEditedExerciseSets(updatedExerciseSets)
        setExercise({ ...exercise })
        setIsEditingCard(true)
    }

    const handleDoubleClick = async () => {
        try {
            if (!isEditingCard) {
                console.log('editedESets....', editedExerciseSets)
                setExerciseSets1(exercise.exerciseSets)
                const updatedExerciseSets = editedExerciseSets.map((set) => ({
                    ...set,
                    suggestedWeightRange:
                        set.performedWeight === 0 || !set.performedWeight
                            ? [0, 0]
                            : [set.performedWeight, set.performedWeight],
                    suggestedRepRange:
                        set.performedReps === 0 || !set.performedReps
                            ? [10, 15]
                            : [set.performedReps, set.performedReps],
                    suggestedRIRRange:
                        set.performedRIR === 0 || !set.performedRIR
                            ? [1, 3]
                            : [set.performedRIR, set.performedRIR],
                }))

                let minWeight = Number.MAX_VALUE
                let maxWeight = Number.MIN_VALUE
                let minRep = Number.MAX_VALUE
                let maxRep = Number.MIN_VALUE
                let minRir = Number.MAX_VALUE
                let maxRir = Number.MIN_VALUE
                updatedExerciseSets.forEach((set) => {
                    if (set.suggestedWeightRange[0] < minWeight) {
                        minWeight = set.suggestedWeightRange[0]
                    }
                    if (set.suggestedWeightRange[1] > maxWeight) {
                        maxWeight = set.suggestedWeightRange[1]
                    }
                    if (set.suggestedRepRange[0] < minRep) {
                        minRep = set.suggestedRepRange[0]
                    }
                    if (set.suggestedRepRange[1] > maxRep) {
                        maxRep = set.suggestedRepRange[1]
                    }
                    if (set.suggestedRIRRange[0] < minRir) {
                        minRir = set.suggestedRIRRange[0]
                    }
                    if (set.suggestedRIRRange[1] > maxRir) {
                        maxRir = set.suggestedRIRRange[1]
                    }
                })
                if (maxWeight == 5e-324) {
                    maxWeight = minWeight
                }
                if (maxRep == 5e-324) {
                    maxRep = ''
                }
                if (maxRir == 5e-324) {
                    maxRir = ''
                }
                setWeightT([minWeight, maxWeight]) // Set the weightT state
                setRepT([minRep, maxRep])
                setRirT([minRir, maxRir])
                // setWeightT([]);
                // setRepT([]);
                // setRirT([]);
                exercise.exerciseSets = updatedExerciseSets
                console.log('updatedExerciseSets:....... ', updatedExerciseSets)
                setEditedExerciseSets(updatedExerciseSets)
                setExercise({ ...exercise })
                setIsEditingCard(true)
            }
        } catch (error) {
            console.log(error)
        }
    }
    const addNewSet = async () => {
        try {
            // setEditedExerciseSets(exercise.exerciseSets)
            const updatedExerciseSets = [...editedExerciseSets]
            // console.log('editedExerciseSets: ', editedExerciseSets)

            const setLen = updatedExerciseSets.length + 1
            //  console.log('setLen: ', setLen)
            // console.log('updatedExerciseSets: ', updatedExerciseSets)
            if (setLen > 1) {
                const weight1 =
                    updatedExerciseSets[setLen - 2].suggestedWeightRange[0]
                const weight2 =
                    updatedExerciseSets[setLen - 2].suggestedWeightRange[1]
                const rep1 =
                    updatedExerciseSets[setLen - 2].suggestedRepRange[0]
                const rep2 =
                    updatedExerciseSets[setLen - 2].suggestedRepRange[1]
                const rir1 =
                    updatedExerciseSets[setLen - 2].suggestedRIRRange[0]
                const rir2 =
                    updatedExerciseSets[setLen - 2].suggestedRIRRange[1]

                updatedExerciseSets.push({
                    number: setLen,
                    suggestedWeightRange: [weight1, weight2],
                    suggestedRepRange: [rep1, rep2],
                    suggestedRIRRange: [rir1, rir2],
                    // performedWeight: 0,
                    // performedReps: 0,
                    // performedRIR: 0,
                })
            } else {
                // If there are no existing sets, create a new set with default values
                updatedExerciseSets.push({
                    number: setLen,
                    //suggestedWeightRange: [null, null],
                    suggestedWeightRange: [weightT[0], weightT[1]],
                    suggestedRepRange: [10, 15],
                    suggestedRIRRange: [1, 3],
                    // performedWeight: 0,
                    // performedReps: 0,
                    // performedRIR: 0,
                })
            }
            //exercise.editedExerciseSets = exercise.updatedExerciseSets
            exercise.exerciseSets = updatedExerciseSets

            console.log('updatedExerciseSets:....... ', updatedExerciseSets)

            setEditedExerciseSets(updatedExerciseSets)
            setExercise({ ...exercise })
        } catch (error) {
            console.log('error while adding set: ', error)
        }
    }
    const deleteSet = (setIndex) => {
        try {
            const updatedExerciseSets = [...editedExerciseSets]
            updatedExerciseSets.splice(setIndex, 1) // Remove the set at the specified index
            // Update the exercise object with the updated exercise sets
            exercise.exerciseSets = updatedExerciseSets
            setEditedExerciseSets(updatedExerciseSets)
            setExercise({ ...exercise })
            if (updatedExerciseSets.length < 1) {
                setWeightT(['', ''])
                setRepT([10, 15])
                setRirT([1, 3])
                return
            } else {
                let minWeight = Number.MAX_VALUE
                let maxWeight = Number.MIN_VALUE
                let minRep = Number.MAX_VALUE
                let maxRep = Number.MIN_VALUE
                let minRir = Number.MAX_VALUE
                let maxRir = Number.MIN_VALUE
                updatedExerciseSets.forEach((set) => {
                    if (set.suggestedWeightRange[0] < minWeight) {
                        minWeight = set.suggestedWeightRange[0]
                    }
                    if (set.suggestedWeightRange[1] > maxWeight) {
                        maxWeight = set.suggestedWeightRange[1]
                    }
                    if (set.suggestedRepRange[0] < minRep) {
                        minRep = set.suggestedRepRange[0]
                    }
                    if (set.suggestedRepRange[1] > maxRep) {
                        maxRep = set.suggestedRepRange[1]
                    }
                    if (set.suggestedRIRRange[0] < minRir) {
                        minRir = set.suggestedRIRRange[0]
                    }
                    if (set.suggestedRIRRange[1] > maxRir) {
                        maxRir = set.suggestedRIRRange[1]
                    }
                })
                if (maxWeight == 5e-324) {
                    maxWeight = ''
                }
                if (maxRep == 5e-324) {
                    maxRep = ''
                }
                if (maxRir == 5e-324) {
                    maxRir = ''
                }
                setWeightT([minWeight, maxWeight]) // Set the weightT state
                setRepT([minRep, maxRep])
                setRirT([minRir, maxRir])
            }
        } catch (error) {
            console.log('Error while deleting set:', error)
        }
    }

    const handleUpdateClick = async () => {
        try {
            setNeutral(false)
            setExerciseInfoRef1(exercise?.exerciseInfoRef)
            console.log('exriref...', exerciseInfoRef1)
        } catch (error) {
            console.log(error)
        }
    }

    const handleSaveClick = async () => {
        try {
            if (!exercise?.exerciseInfoRef?.name) {
                setEnterName(true)
                setTimeout(() => {
                    setEnterName(false)
                }, 1500)
                return
            }
            // setEnterName(false);

            setEditedExerciseSets(exercise.exerciseSets)
            if (
                exerciseInfoRef1 &&
                exerciseInfoRef1.name != exercise.exerciseInfoRef.name
            ) {
                setComment(exercise?.feedbackComment)
            }
            setExercise({ ...exercise })
            setIsEditingCard(false)
            const exerciseInfoRefId = exercise.exerciseInfoRef._id.toString()
            const exerciseId = exercise._id.toString()
            // console.log("exercise.exerciseSets ..", exercise.exerciseSets);
            // console.log("exerciseSets1 ..", exerciseSets1);
            // console.log("exercise.exerciseSets&&exerciseSets1 ..", exercise.exerciseSets == exerciseSets1);
            // console.log("exercise.exerciseSets && exerciseSets1 ..", JSON.stringify(exercise.exerciseSets) === JSON.stringify(exerciseSets1));

            const requestData = {
                sessionId,
                clientId,
                routineRef,
                variantType,
                exerciseInfoRef1,
                exercise: {
                    ...exercise,
                    exerciseInfoRef: {
                        ...exercise.exerciseInfoRef,
                        _id: exerciseInfoRefId, // Ensure it's a string
                    },
                    _id: exerciseId,
                    exerciseSets: exercise.exerciseSets.map((set) => ({
                        number: set.number,
                        suggestedWeightRange: set.suggestedWeightRange,
                        suggestedRepRange: set.suggestedRepRange,
                        suggestedRIRRange: set.suggestedRIRRange,
                        _id: set._id,
                    })),
                    //hasEdited: true,
                    hasEdited:
                        exercise.exerciseInfoRef != exerciseInfoRef1 ||
                        JSON.stringify(exercise.exerciseSets) !==
                            JSON.stringify(exerciseSets1)
                            ? true
                            : false,
                    // Remove performedWeight, performedReps, and performedRIR
                    performedWeight: undefined,
                    performedReps: undefined,
                    performedRIR: undefined,
                    userFeedback: undefined,
                    videoUrl: undefined,
                    feedbackComment: undefined,
                },
            }
            setEditedExerciseSets(exercise.exerciseSets)
            setExerciseSets1(exercise.exerciseSets)
            // console.log("exerciseInfoRef1...", exerciseInfoRef1);
            // console.log("exercise.exerciseInfoRef...", exercise.exerciseInfoRef);

            if (
                neutral == false &&
                exerciseInfoRef1.name != exercise.exerciseInfoRef.name
            ) {
                exercise.videoUrl = undefined
                exercise.userFeedback = undefined
                // exercise.feedbackComment = exercise.feedbackComment;
                setExercise(exercise)
            }
            console.log(
                'exercise.exerciseInfoRef11...',
                exercise.exerciseInfoRef,
            )
            setExerciseInfoRef1(exercise.exerciseInfoRef)
            setNeutral(true)
            const response = await axios.post(
                '/workoutpnp/sessions/addExerciseToRoutine',
                requestData,
            )
            await fetchActiveCycle()
            console.log('Exercise saved successfully:', response.data)
            setShowSuccessMessage(true)
            if (
                exercise.exerciseInfoRef != exerciseInfoRef1 ||
                JSON.stringify(exercise.exerciseSets) !==
                    JSON.stringify(exerciseSets1)
            ) {
                //setFeedbackCompleted(true)
                setExerciseUpdated(true)
            }
            setTimeout(() => {
                setShowSuccessMessage(false)
            }, 1000)
        } catch (error) {
            console.error('Error saving exercise:', error)
        }
    }

    const removeExercise = async () => {
        try {
            console.log('Removekey: ', idx)
            //  console.log("exc.", exercise);

            deleteExercise(idx)
            const exerciseInfoRefId = exercise.exerciseInfoRef._id.toString()

            const requestData = {
                routineRef: routineRef, // Assuming routineRef is defined elsewhere
                exerciseInfoRefId: exerciseInfoRefId,
                variantType: variantType,
            }
            const response = await axios.delete(
                '/workoutpnp/sessions/removeExerciseFromRoutine',
                { data: requestData },
            )
            await fetchActiveCycle()

            console.log('Exercise deleted successfully:', response.data)
        } catch (error) {
            console.error(error)
        } finally {
            setShowDeleteModal(false) // Close the delete modal after deletion
        }
    }

    const handleInputChange = (index, key, value) => {
        const updatedExerciseSets = [...editedExerciseSets]

        if (typeof value === 'string') {
            if (key === 'suggestedRIRRange' || key === 'suggestedRepRange') {
                // For RIR and RepRange, split and parse as integers
                const parsedValue = value.split('-').map(Number)
                updatedExerciseSets[index][key] = parsedValue
            } else if (key === 'suggestedWeightRange') {
                // For suggestedWeightRange, split and parse as integers
                const parsedValue = value
                    .split('-')
                    .map((numString) => parseInt(numString, 10))
                updatedExerciseSets[index][key] = parsedValue
            }
        } else if (Array.isArray(value)) {
            // Handle array values (lower and upper range)
            //  updatedExerciseSets[index][key] = value;

            // if (value.length == 1) {
            //     updatedExerciseSets[index][key] = value;
            // }
            // else if (value[0] === null && value[1] !== null) {
            //     updatedExerciseSets[index][key] = [value[1]];
            // } else if (value[1] === null && value[0] !== null) {
            //     updatedExerciseSets[index][key] = [value[0]];
            // } else {
            //     updatedExerciseSets[index][key] = value;
            // }
            const cleanedValue = value.filter((v) => v !== null)
            updatedExerciseSets[index][key] =
                cleanedValue.length === 0 ? null : cleanedValue
        } else {
            updatedExerciseSets[index][key] = value // Use the value as is if it's not a string or array
        }
        let minWeight = Number.MAX_VALUE
        let maxWeight = Number.MIN_VALUE
        let minRep = Number.MAX_VALUE
        let maxRep = Number.MIN_VALUE
        let minRir = Number.MAX_VALUE
        let maxRir = Number.MIN_VALUE
        updatedExerciseSets.forEach((set) => {
            if (set.suggestedWeightRange[0] < minWeight) {
                minWeight = set.suggestedWeightRange[0]
            }
            if (set.suggestedWeightRange[1] > maxWeight) {
                maxWeight = set.suggestedWeightRange[1]
            }
            if (set.suggestedRepRange[0] < minRep) {
                minRep = set.suggestedRepRange[0]
            }
            if (set.suggestedRepRange[1] > maxRep) {
                maxRep = set.suggestedRepRange[1]
            }
            if (set.suggestedRIRRange[0] < minRir) {
                minRir = set.suggestedRIRRange[0]
            }
            if (set.suggestedRIRRange[1] > maxRir) {
                maxRir = set.suggestedRIRRange[1]
            }
        })
        if (maxWeight == 5e-324) {
            maxWeight = ''
        }
        if (maxRep == 5e-324) {
            maxRep = ''
        }
        if (maxRir == 5e-324) {
            maxRir = ''
        }
        setWeightT([minWeight, maxWeight])
        setRepT([minRep, maxRep])
        setRirT([minRir, maxRir])
        setEditedExerciseSets(updatedExerciseSets)
    }

    useEffect(() => {
        setDisableSave(isRecording)
    }, [isRecording])
    if (audioFile) modifier({ audioFile, audioUrl })

    const [playedSeconds, setPlayedSeconds] = useState(0)

    const handleSeek = (seconds) => {
        console.log('Seeking to ', seconds)
        setPlayedSeconds(seconds)
    }

    const updateOptions = async (searchText) => {
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
                setOptions([])
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
            setOptions(response.data.comments)
            console.log('options..', options)
            //setLoading(false)
            // setError(false)
        } catch (error) {
            // setError('Error 500')a
            console.log(error)
        }
    }

    const selectOption = async (option) => {
        commentArray.push(option)
        console.log('comment array..', commentArray)
        setCommentArray(commentArray)
        //  const commentString = commentArray.join('•');
        const cmtString = commentArray.map((item) => ` •${item}`).join('')
        console.log(cmtString)
        setCommentString(cmtString)
        exercise.feedbackComment = cmtString
        setExercise({ ...exercise })
        console.log('exr..', exercise)
        // setExercise({ ...exercise });
        setOptions([])
        const response = await axios.put(
            //fc
            `/trainers/addFeedback?name=${option}&exerciseInfoRef=${exercise.exerciseInfoRef._id}&clientId=${clientId}&routineRef=${routineRef}`,
        )
        console.log('Response..................................', response)
        await fetchActiveCycle()
    }
    const deleteCommentfromArray = async (cmt, index) => {
        try {
            //console.log("setIndex ....", setIndex);
            //console.log("deleteSet ", setIndex);
            const updatedCommentArray = [...commentArray]
            updatedCommentArray.splice(index, 1) // Remove the set at the specified index
            // Update the exercise object with the updated exercise sets
            // exercise.exerciseSets = updatedCommentArray
            // setEditedExerciseSets(updatedExerciseSets)
            // // You can also update the exercise object in your state if needed:
            // setExercise({ ...exercise })
            setCommentArray(updatedCommentArray)
            console.log('updatedCommentArray ', updatedCommentArray)

            const cmtString = updatedCommentArray
                .map((item) => ` •${item}`)
                .join('')
            console.log(cmtString)
            setCommentString(cmtString)
            exercise.feedbackComment = cmtString
            setExercise({ ...exercise })

            const response1 = await axios.delete(
                //fc
                `/trainers/deleteFeedback?name=${cmt}&exerciseInfoRef=${exercise.exerciseInfoRef._id}&clientId=${clientId}&routineRef=${routineRef}`,
            )
            const response2 = await axios.put(
                '/workoutpnp/sessions/update/feedbackComment',
                {
                    sessionId: sessionId,
                    exerciseInfoRefId: exercise.exerciseInfoRef._id,
                    commentString: cmtString,
                },
            )
            setFeedbackCompleted(true)
            await fetchActiveCycle()
        } catch (error) {
            console.log('Error while updating comment array:', error)
        }
    }

    return exercise?.exerciseInfoRef?.name && neutral ? (
        <div
            className={`feedback-card-container`}
            // onDoubleClick={handleDoubleClick} // Enable edit mode on double click
        >
            <div className="content">
                <div
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                    <div className="routine pb-4">
                        {exercise?.exerciseInfoRef?.name}
                        <FaEdit
                            className="fa-times"
                            onClick={handleUpdateClick}
                        />
                    </div>
                    {isEditingCard ? (
                        <FaSave
                            className="fa-save"
                            onClick={handleSaveClick}
                        ></FaSave>
                    ) : null}
                    <div>
                        <FaTimes
                            className="fa-times"
                            onClick={() => {
                                setShowDeleteModal(true)
                            }}
                        />
                    </div>
                </div>
                <div onDoubleClick={handleDoubleClick}>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}
                    >
                        <div className="heading">
                            <div className="set">Sets</div>
                            <div className="weight">Weight</div>
                            <div className="rep">Reps</div>
                            <div className="rir">RIR</div>
                        </div>
                        {showSuccessMessage && (
                            <div className="success-message">
                                Exercise saved!
                            </div>
                        )}
                    </div>
                    <div className="body">
                        {isEditingCard && (
                            <div className="set-row">
                                <div className="set m-1"></div>
                                <div className="weight">
                                    <input
                                        className="input-set"
                                        type="number"
                                        value={weightT[0]}
                                        onChange={(e) =>
                                            handleAllSet('weight', [
                                                e.target.value,
                                                e.target.value,
                                            ])
                                        }
                                    />
                                    <input
                                        className="input-set"
                                        type="number"
                                        value={weightT[1]}
                                        onChange={(e) =>
                                            handleAllSet('weight', [
                                                e.target.value,
                                            ])
                                        }
                                    />
                                </div>
                                <div className="rep">
                                    <input
                                        className="input-set"
                                        type="number"
                                        value={repT[0]}
                                        onChange={(e) =>
                                            handleAllSet('rep', [
                                                e.target.value,
                                                e.target.value,
                                            ])
                                        }
                                    />
                                    <input
                                        className="input-set"
                                        type="number"
                                        value={repT[1]}
                                        onChange={(e) =>
                                            handleAllSet('rep', [
                                                e.target.value,
                                            ])
                                        }
                                    />
                                </div>
                                <div className="rep">
                                    <input
                                        className="input-set"
                                        type="number"
                                        value={rirT[0]}
                                        onChange={(e) =>
                                            handleAllSet('rir', [
                                                e.target.value,
                                                e.target.value,
                                            ])
                                        }
                                    />
                                    <input
                                        className="input-set"
                                        type="number"
                                        value={rirT[1]}
                                        onChange={(e) =>
                                            handleAllSet('rir', [
                                                e.target.value,
                                            ])
                                        }
                                    />
                                </div>
                                <div></div>
                            </div>
                        )}
                        {exercise?.exerciseSets?.map((s, idx) => (
                            <div className="set-row" key={idx}>
                                <div className="set m-1">
                                    {getDashOrValue(idx + 1)}
                                </div>
                                <div className="weight">
                                    <div className="left">
                                        {isEditingCard ? (
                                            <>
                                                <input
                                                    className="input-set"
                                                    type="number"
                                                    value={
                                                        Array.isArray(
                                                            s?.suggestedWeightRange,
                                                        )
                                                            ? s
                                                                  ?.suggestedWeightRange[0]
                                                            : ''
                                                        // s?.performedWeight
                                                    }
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            idx,
                                                            'suggestedWeightRange',
                                                            [
                                                                e.target.value,
                                                                e.target.value, //s?.suggestedWeightRange[1] // Preserve upper range value
                                                            ],
                                                        )
                                                    }
                                                />

                                                <input
                                                    className="input-set"
                                                    type="number"
                                                    value={
                                                        Array.isArray(
                                                            s?.suggestedWeightRange,
                                                        )
                                                            ? s
                                                                  ?.suggestedWeightRange[1]
                                                            : ''
                                                        // s?.performedWeight
                                                    }
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            idx,
                                                            'suggestedWeightRange',
                                                            [
                                                                s
                                                                    ?.suggestedWeightRange[0], // Preserve lower range value
                                                                e.target.value,
                                                            ],
                                                        )
                                                    }
                                                />
                                            </>
                                        ) : (
                                            getDashOrValue(
                                                s?.suggestedWeightRange,
                                            )
                                        )}
                                    </div>
                                    {!isEditingCard && (
                                        <div className="right">
                                            {getDashOrValue(s?.performedWeight)}
                                        </div>
                                    )}

                                    {/* <div className="right">
                                        {getDashOrValue(s?.performedWeight)}
                                    </div> */}
                                </div>
                                <div className="rep">
                                    <div className="left">
                                        {isEditingCard ? (
                                            <>
                                                <input
                                                    className="input-set"
                                                    type="number"
                                                    value={
                                                        Array.isArray(
                                                            s?.suggestedRepRange,
                                                        )
                                                            ? s
                                                                  ?.suggestedRepRange[0]
                                                            : ''
                                                    }
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            idx,
                                                            'suggestedRepRange',
                                                            [
                                                                e.target.value,
                                                                e.target.value, //s?.suggestedRepRange[1] // Preserve upper range value
                                                            ],
                                                        )
                                                    }
                                                />
                                                <input
                                                    className="input-set"
                                                    type="number"
                                                    value={
                                                        Array.isArray(
                                                            s?.suggestedRepRange,
                                                        )
                                                            ? s
                                                                  ?.suggestedRepRange[1]
                                                            : ''
                                                    }
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            idx,
                                                            'suggestedRepRange',
                                                            [
                                                                s
                                                                    ?.suggestedRepRange[0], // Preserve lower range value
                                                                e.target.value,
                                                            ],
                                                        )
                                                    }
                                                />
                                            </>
                                        ) : (
                                            getDashOrValue(s?.suggestedRepRange)
                                        )}
                                    </div>
                                    {!isEditingCard && (
                                        <div className="right">
                                            {getDashOrValue(s?.performedReps)}
                                        </div>
                                    )}
                                    {/* <div className="right">
                                        {getDashOrValue(s?.performedReps)}
                                    </div> */}
                                </div>
                                <div className="rep">
                                    <div className="left">
                                        {isEditingCard ? (
                                            <>
                                                <input
                                                    className="input-set"
                                                    type="number"
                                                    value={
                                                        Array.isArray(
                                                            s?.suggestedRIRRange,
                                                        )
                                                            ? s
                                                                  ?.suggestedRIRRange[0]
                                                            : ''
                                                    }
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            idx,
                                                            'suggestedRIRRange',
                                                            [
                                                                e.target.value,
                                                                e.target.value, //s?.suggestedRIRRange[1] // Preserve upper range value
                                                            ],
                                                        )
                                                    }
                                                />
                                                <input
                                                    className="input-set"
                                                    type="number"
                                                    value={
                                                        Array.isArray(
                                                            s?.suggestedRIRRange,
                                                        )
                                                            ? s
                                                                  ?.suggestedRIRRange[1]
                                                            : ''
                                                    }
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            idx,
                                                            'suggestedRIRRange',
                                                            [
                                                                s
                                                                    ?.suggestedRIRRange[0], // Preserve lower range value
                                                                e.target.value,
                                                            ],
                                                        )
                                                    }
                                                />
                                            </>
                                        ) : (
                                            getDashOrValue(s?.suggestedRIRRange)
                                        )}
                                    </div>
                                    {!isEditingCard && (
                                        <div className="right">
                                            {getDashOrValue(s?.performedRIR)}
                                        </div>
                                    )}
                                    {/* <div className="right">
                                        {getDashOrValue(s?.performedRIR)}
                                    </div> */}
                                </div>
                                {isEditingCard ? (
                                    <div>
                                        <FaTimes
                                            className="fa-times1"
                                            onClick={() => deleteSet(idx)} // Call deleteSet function with the set index
                                        />
                                    </div>
                                ) : null}
                            </div>
                        ))}
                        {isEditingCard ? (
                            <Button
                                text={'+add set'}
                                style={{
                                    padding: '0px',
                                }}
                                onClick={addNewSet}
                            />
                        ) : null}
                    </div>
                    {/* */}
                </div>
                {/* <div>
                        <div className="row form-row pt-2 px-2">User Feedback</div>
                        <div className="feedback-heading">
                            notinng else{exercise?.userFeedback}
                        </div>
                    </div> */}
                <div className="toggle-div-feedbackCard">
                    <div>Video</div>
                    <label className="switch">
                        <input
                            type="checkbox"
                            onChange={() => {
                                setShowGraph(!showGraph)
                            }}
                            checked={showGraph}
                        />
                        <span className="sliderN round"></span>
                    </label>
                    <div>Graph</div>
                </div>
                {showGraph ? (
                    ermData ? (
                        <ERMGraph
                            clientId={clientId}
                            ermData={ermData}
                            timeperiod={timeperiod}
                            setTimeperiod={setTimeperiod}
                        />
                    ) : null
                ) : exercise?.videoUrl ? (
                    <>
                        {' '}
                        <div className="d-flex video-container">
                            <DVideoPlayer url={exercise?.videoUrl} />

                            {/* <ReactPlayer
                                    url={exercise?.videoUrl}
                                    controls={true}
                                    onSeek={handleSeek}
                                    height="200px"
                                /> */}

                            {/* <VideoPlayer
                                    url={exercise?.videoUrl}
                                    controls
                                    height={'200px'}
                                /> */}
                        </div>
                        {/* <div className="row form-row pt-2 px-2">
                                <div className="feedback-heading">
                                    FORM
                                    {form ? (
                                        <img
                                            className="col-md-2"
                                            src="/images/tick.svg"
                                            height="20px"
                                        />
                                    ) : null}
                                </div>
                                <div className="form-row">
                                    <Slider
                                        //TODO : Change styling to match theme
                                        max={10}
                                        min={1}
                                        defaultValue={form}
                                        onChange={(value) => {
                                            setForm(value)
                                            setExercise({
                                                ...exercise,
                                                formRating: value,
                                            })
                                        }}
                                        style={{
                                            width: '80%',
                                        }}
                                    />
                                    <div className="col-md-2 attribute-heading">
                                        {form}/10
                                    </div>
                                </div>
                            </div> */}
                        {/* <div className="row pt-4 px-2">
                                <div className="feedback-heading m-0 pb-2 form-row">
                                    RECORD
                                    {exercise?.feedbackVoiceNoteUrl ? (
                                        <img
                                            className="col-md-2"
                                            src="/images/tick.svg"
                                            height="20px"
                                        />
                                    ) : null}
                                </div>
                                <div className="form-row">
                                    {isRecording == false ? (
                                        <img
                                            src="/images/record.svg"
                                            height="25px"
                                            onClick={startRecording}
                                            style={{ marginLeft: '10px' }}
                                        />
                                    ) : (
                                        <img
                                            // className="col-md-2"
                                            src="/images/stop.svg"
                                            style={{ marginLeft: '10px' }}
                                            height="25px"
                                            onClick={() => {
                                                stopRecording()
                                                setExercise({
                                                    ...exercise,
                                                    feedbackVoiceNoteUrl: audioFile,
                                                })
                                            }}
                                        />
                                    )}
                                    <audio
                                        className="audio-player"
                                        src={
                                            // audioUrl == ''
                                            exercise?.feedbackVoiceNoteUrl
                                            // : audioUrl
                                        }
                                        controls
                                    />
                                </div>
                            </div> */}
                        {/* {exercise?.userFeedback && (
                            <div>
                                <div className="row form-row pt-2 px-2">
                                    User Feedback
                                </div>
                                <div className="feedback-heading">
                                    {exercise?.userFeedback}
                                </div>
                            </div>
                        )} */}
                        {/* <div className="row px-2 pt-4">
                            <div className="feedback-heading  form-row">
                                COMMENTS
                                {comment ? (
                                    <img
                                        className="col-md-2"
                                        src="/images/tick.svg"
                                        height="20px"
                                    />
                                ) : null}
                            </div>
                        </div>
                        <textarea
                            rows={3}
                            value={comment}
                            className="comment-box"
                            onChange={(event) => {
                                setComment(event?.target?.value)
                                setExercise({
                                    ...exercise,
                                    feedbackComment: event?.target?.value,
                                })
                            }}
                        /> */}
                    </>
                ) : null}

                {exercise?.userFeedback && (
                    <div>
                        <div className="row form-row pt-2 px-2">
                            User Feedback
                        </div>
                        <div className="feedback-heading">
                            {exercise?.userFeedback}
                        </div>
                    </div>
                )}
                <div className="row px-2 pt-4">
                    <div className="feedback-heading  form-row">
                        COMMENTS
                        {comment ? (
                            <img
                                className="col-md-2"
                                src="/images/tick.svg"
                                height="20px"
                            />
                        ) : null}
                    </div>
                </div>
                {/* <textarea
                    rows={3}
                    // value={exercise.feedbackComment}
                    // value={comment}
                    className="comment-box"
                    placeholder='Add FeedbackComment'
                    // onChange={(event) => {
                    //     setComment(event?.target?.value)
                    //     setExercise({
                    //         ...exercise,
                    //         feedbackComment: event?.target?.value,
                    //     })
                    // }}
                    //onChange={commentOnChangeHandler}
                    onChange={(event) => { setComment(event.target.value); console.log("evcom...", event.target.value); }}
                    onKeyDown={commentOnChangeHandler}
                /> */}
                <textarea
                    rows={3}
                    className="comment-box"
                    placeholder="Add Feedback"
                    value={comment}
                    onChange={(event) => {
                        console.log('etv..........', event.target.value)
                        setComment(event.target.value)
                        // Call updateOptions with the current value of comment
                        updateOptions(event.target.value)
                    }}
                    onKeyDown={async (event) => {
                        if (event.key === 'PageUp' || event.key === 'ArrowUp') {
                            // Handle PageUp or ArrowUp key press to move selection up
                            event.preventDefault()
                            setSelectedOption(
                                selectedOption === 0
                                    ? options.length - 1
                                    : selectedOption - 1,
                            )
                        } else if (
                            event.key === 'PageDown' ||
                            event.key === 'ArrowDown'
                        ) {
                            // Handle PageDown or ArrowDown key press to move selection down
                            event.preventDefault()
                            setSelectedOption(
                                selectedOption === options.length - 1
                                    ? 0
                                    : selectedOption + 1,
                            )
                        } else if (
                            (event.ctrlKey || event.metaKey) &&
                            event.key === 'Enter'
                        ) {
                            event.preventDefault() // Prevent the space character from being added
                            const selected = options[selectedOption]
                            if (selected) {
                                setComment(selected)
                                setOptions([]) // Clear the options
                                // You can also add it to commentArray if needed
                            }
                        } else if (
                            event.key === 'Enter' &&
                            comment.trim().length >= 1
                        ) {
                            const trimmedComment = comment.trim()
                            console.log(
                                'trimmedComment.........',
                                trimmedComment,
                            )

                            if (!commentArray.includes(trimmedComment)) {
                                let arr = commentArray // Create a copy of the original array
                                arr.push(trimmedComment)
                                setCommentArray(arr)
                                console.log('arrr.........', arr)
                            }

                            // let arr = commentArray
                            // arr.push(comment.trim())
                            // setCommentArray(arr)
                            setOptions([]) // Clear the options
                            setComment('') // Clear the textarea
                            event.preventDefault() // Prevent the newline character from being added
                            const cmtString = commentArray
                                .map((item) => ` •${item}`)
                                .join('')
                            setCommentString(cmtString)
                            exercise.feedbackComment = cmtString
                            setExercise({ ...exercise })
                            const response1 = await axios.put(
                                `/trainers/addFeedback?name=${event.target.value}&exerciseInfoRef=${exercise.exerciseInfoRef._id}&clientId=${clientId}&routineRef=${routineRef}&sessionId=${sessionId}`,
                            )

                            const response2 = await axios.put(
                                '/workoutpnp/sessions/update/feedbackComment',
                                {
                                    sessionId: sessionId,
                                    exerciseInfoRefId:
                                        exercise.exerciseInfoRef._id,
                                    commentString: cmtString,
                                },
                            )

                            setFeedbackCompleted(true)
                            await fetchActiveCycle()
                        }
                    }}
                />

                {
                    //  loading ? (
                    //         <Loader />
                    //     ) : error ? (
                    //         <InternalServerErrorPage />
                    //     ) : (
                    options?.map((o, index) => (
                        <div
                            key={index}
                            // className="feedback-option"
                            className={`feedback-option ${
                                index === selectedOption ? 'selected' : ''
                            }`}
                            onClick={() => selectOption(o)}
                        >
                            {/* {platform === 'iOS' ? null : (
                                    <div className="exercise-video-gif">
                                        <video
                                            className="exercise-video"
                                            src={exerciseText?.gifUrl}
                                            autoPlay
                                            loop
                                        />
                                    </div>
                                )} */}
                            {/* {o?.feedbackComment} */}
                            {o}
                        </div>
                    ))

                    //)
                }
                {options &&
                    options.length < 1 &&
                    commentArray.map((cmt, index) => (
                        <div className="comment-array">
                            <div>
                                <FaDotCircle className="fa-dot-circle" />
                            </div>
                            <div className="cmt-text"> {cmt}</div>
                            <div>
                                <FaTimes
                                    className="fa-times-comment"
                                    onClick={() =>
                                        deleteCommentfromArray(cmt, index)
                                    }
                                />
                            </div>
                        </div>
                    ))}

                {/* <div>
                        <div className="row form-row pt-2 px-2">User Feedback</div>
                        <div className="feedback-heading">
                            {exercise?.userFeedback}
                        </div>
                    </div> */}
            </div>
            <CustomModal
                title={'Delete Exercise'}
                show={showDeleteModal}
                onHide={() => setShowDeleteModal(false)}
                width="small"
                dark={true}
            >
                <div>
                    <p>
                        Are you sure you want to delete the Exercise from
                        routine?
                    </p>
                    <div className="d-flex">
                        <Button
                            text={'Yes'}
                            color="green"
                            size="s"
                            onClick={removeExercise}
                        />
                        <Button
                            text={'No'}
                            color="red"
                            size="s"
                            onClick={() => setShowDeleteModal(false)}
                        />
                    </div>
                </div>
            </CustomModal>
        </div>
    ) : (
        !neutral && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="save-cancle-btn">
                    {/* {enterName && (<p className='enter-exercise'>please enter exercise!</p>)} */}
                    {enterName && (
                        <div className="success-message">
                            please enter exercise!
                        </div>
                    )}

                    <FaSave
                        className="fa-save"
                        onClick={handleSaveClick}
                    ></FaSave>
                    <FaTimes
                        className="fa-times2"
                        // onClick={() => {
                        //     setShowDeleteModal(true)
                        // }}
                        //onClick={deleteExercise}
                        onClick={() => {
                            deleteExercise()
                            setCanExerciseAdded(true) // Set canExerciseAdded to true after deleting
                        }}
                    />
                </div>
                <EditExercise
                    exercise={exercise}
                    setExercise={(exercise) => {
                        setExercise(exercise, idx)
                    }}
                    deleteExercise={() => deleteExercise(idx)}
                    showFeedback={false}
                    // getComment={
                    //     getComment
                    // }
                    // autoPrefill={
                    //     autoPrefill
                    // }

                    // forCycle={
                    //     forCycle
                    // }
                />

                {/* <div className="save-cancle-btn">
                    <Button
                        classNames="add-exercise-btn"
                        onClick={handleSaveClick}
                        text={'+ save'}
                    />
                    <Button
                        classNames="add-exercise-btn"
                        onClick={deleteExercise}
                        //onClick={() => handleCancelClick(key)}
                        text={'cancel'}
                    />
                </div> */}
            </div>
        )
    )
}

FeedbackCard.propTypes = {}
export default FeedbackCard
