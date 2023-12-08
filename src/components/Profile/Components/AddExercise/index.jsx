import * as React from 'react'
import Creatable from 'react-select/creatable'
import Button from '../../../Common/Button'
import InputBox from '../../../Common/Form/InputBox'
import UploadFileButton from '../../../Common/Form/UploadFileButton'
import axios from '../../../../store/axios-secure'
import Loader from '../../../Common/Loader'
import './style.scss'

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
const AddExerciseToDB = ({ name, exerciseInfo }) => {
    const [exerciseName, setExerciseName] = React.useState(name ? name : '')
    const [videoId, setVideoId] = React.useState()
    const [orientation, setOrientation] = React.useState(
        exerciseInfo?.layout === 'H'
            ? {
                  value: 'Horizontal',
                  label: 'Horizontal',
              }
            : {
                  value: 'Vertical',
                  label: 'Vertical',
              },
    )
    const [youtubeLink, setYoutubeLink] = React.useState('')
    const [animation, setAnimation] = React.useState('')
    const [error, setError] = React.useState({
        exerciseName: '',
        youtubeLink: '',
        animation: '',
    })
    const [isValid, setIsValid] = React.useState(true)
    const [isLoading, setIsLoading] = React.useState(false)
    const [errorMsg, setErrorMsg] = React.useState('')
    const [successMsg, setSuccessMsg] = React.useState('')
    const [displayMsg, setDisplayMsg] = React.useState(false)

    const handleValidation = () => {
        let formIsValid = true
        // if (!animation) {
        //     setIsValid(false)
        //     formIsValid = false
        //     setError((error) => ({
        //         ...error,
        //         animation: 'Please upload animation of the Exercise',
        //     }))
        // } else
        if (animation) {
            if (
                animation?.name?.split('.')[
                    animation?.name?.split('.').length - 1
                ] !== 'mp4'
            ) {
                console.log(
                    '-',
                    animation?.name.split('.')[
                        animation?.name.split('.').length - 1
                    ],
                    animation?.name.split('.'),
                    animation?.name.split('.').length - 1,
                )
                setIsValid(false)
                formIsValid = false
                setError((error) => ({
                    ...error,
                    animation: " Please upload animation of type 'mp4'",
                }))
            } else {
                setError((error) => ({ ...error, animation: '' }))
            }
        }
        if (!exerciseName) {
            setIsValid(false)
            formIsValid = false
            setError((error) => ({
                ...error,
                exerciseName: 'Please enter Name of the Exercise',
            }))
        } else {
            setError((error) => ({ ...error, exerciseName: '' }))
        }
        if (!youtubeLink) {
            setIsValid(false)
            formIsValid = false
            setError((error) => ({
                ...error,
                youtubeLink: 'Please enter Youtube link of the Exercise',
            }))
        } else {
            try {
                new URL(youtubeLink)
                setError((error) => ({ ...error, youtubeLink: '' }))
            } catch (err) {
                setIsValid(false)
                formIsValid = false
                setError((error) => ({
                    ...error,
                    youtubeLink: 'Not a Valid Link',
                }))
            }
        }
        return formIsValid
    }
    const handleAddExercise = async () => {
        let formIsValid = handleValidation()

        let video_id
        try {
            video_id = youtubeLink.split('v=')[1]
            let ampersandPosition = video_id.indexOf('&')
            if (ampersandPosition != -1) {
                video_id = video_id.substring(0, ampersandPosition)
            }
        } catch (e) {
            formIsValid = false
            setIsValid(false)
            setError((error) => ({
                ...error,
                youtubeLink: 'Not a Valid Link with video Id',
            }))
        }
        console.log('youtube id ', video_id)
        let formData = new FormData()
        formData.append('name', exerciseName)
        formData.append('layout', orientation.value)
        formData.append('tutorialUrl', video_id)
        formData.append('gifFile', animation)
        if (formIsValid) {
            setIsLoading(true)
            try {
                const response = await axios.post(
                    '/admin/exerciseInfos/add',
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    },
                )
                setSuccessMsg('Exercise Added successfully')
            } catch (err) {
                console.log(err)
                setErrorMsg("Exercise couldn't be saved. Please try again!")
            }
            setIsLoading(false)
        }
    }

    const handleUpdateExerciseValidation = () => {
        let formIsValid = true
        if (animation) {
            if (
                animation?.name?.split('.')[
                    animation?.name?.split('.').length - 1
                ] !== 'mp4'
            ) {
                console.log(
                    '-',
                    animation?.name.split('.')[
                        animation?.name.split('.').length - 1
                    ],
                    animation?.name.split('.'),
                    animation?.name.split('.').length - 1,
                )
                setIsValid(false)
                formIsValid = false
                setError((error) => ({
                    ...error,
                    animation: " Please upload animation of type 'mp4'",
                }))
            } else {
                setError((error) => ({ ...error, animation: '' }))
            }
        }
        if (youtubeLink) {
            try {
                new URL(youtubeLink)
                let video_id = youtubeLink.split('v=')[1]
                let ampersandPosition = video_id.indexOf('&')
                if (ampersandPosition != -1) {
                    video_id = video_id.substring(0, ampersandPosition)
                    setVideoId(video_id)
                }
                setError((error) => ({ ...error, youtubeLink: '' }))
            } catch (err) {
                setIsValid(false)
                formIsValid = false
                setError((error) => ({
                    ...error,
                    youtubeLink: 'Not a Valid Link',
                }))
            }
        }
        return formIsValid
    }
    const handleUpdateExercise = async () => {
        let isValidForm = handleUpdateExerciseValidation()
        let video_id
        if (youtubeLink) {
            try {
                video_id = youtubeLink.split('v=')[1]
                let ampersandPosition = video_id.indexOf('&')
                if (ampersandPosition != -1) {
                    video_id = video_id.substring(0, ampersandPosition)
                }
            } catch (e) {
                isValidForm = false
                setIsValid(false)
                setError((error) => ({
                    ...error,
                    youtubeLink: 'Not a Valid Link with video Id',
                }))
            }
        } else {
            video_id = exerciseInfo?.tutorialUrl
        }
        console.log('video id ', videoId)
        let formData = new FormData()
        formData.append('name', exerciseName)
        formData.append('layout', orientation.value[0])
        formData.append('tutorialUrl', video_id)
        formData.append('gifFile', animation ? animation : exerciseInfo?.gifUrl)

        if (isValidForm) {
            setIsLoading(true)
            try {
                const response = await axios.put(
                    `/admin/exerciseInfos/update/${exerciseInfo?._id}`,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    },
                )
                setSuccessMsg('Exercise Updated successfully')
            } catch (err) {
                console.log(err)
                setErrorMsg('Exercise could not be updated. Please try again!')
            }
            setIsLoading(false)
        }
    }

    React.useEffect(() => {
        if (errorMsg) {
            setTimeout(() => {
                setErrorMsg('')
            }, 8000)
        }
        if (successMsg) {
            setTimeout(() => {
                setSuccessMsg('')
            }, 8000)
        }
    }, [successMsg, errorMsg])
    return (
        <div>
            {/* <p className="heading">Add Exercise</p> */}

            <div>
                <div style={{ padding: '10px' }}>
                    <span style={{ color: 'red' }}>
                        {errorMsg ? errorMsg : null}
                    </span>
                    <span style={{ color: '#36f5c7' }}>
                        {successMsg ? successMsg : null}
                    </span>
                </div>
                <div style={{ padding: '10px' }}>
                    <span style={{ color: 'red', fontSize: '12px' }}>
                        {!isValid && error.exerciseName
                            ? error.exerciseName
                            : null}
                    </span>
                    <InputBox
                        id={'Name of the Exercise'}
                        type={'text'}
                        placeholder={'Name of the Exercise'}
                        value={exerciseName}
                        label={'Name'}
                        required={true}
                        disabled={false}
                        inputClassNames="white-border"
                        onChange={(evt) => {
                            setExerciseName(evt.target.value)
                            setIsValid(true)
                        }}
                        divClassNames={'col-md-12'}
                        labelClass={'label'}
                        maxLength={50}
                    />
                </div>
                <div style={{ padding: '10px' }}>
                    <span style={{ color: 'red', fontSize: '12px' }}>
                        {!isValid && error.youtubeLink
                            ? error.youtubeLink
                            : null}
                    </span>
                    <InputBox
                        id={'Youtube Link of the Exercise'}
                        type={'text'}
                        placeholder={
                            exerciseInfo
                                ? 'Updated Youtube link of the Exercise'
                                : 'Youtube link of the Exercise'
                        }
                        value={youtubeLink}
                        required={exerciseInfo ? false : true}
                        label={'Youtube Link'}
                        disabled={false}
                        inputClassNames="white-border"
                        onChange={(evt) => {
                            setYoutubeLink(evt.target.value)
                            setIsValid(true)
                        }}
                        divClassNames={'col-md-12'}
                        labelClass={'label'}
                        maxLength={200}
                    />
                </div>

                <div
                    className="label-input-container"
                    style={{ padding: '10px' }}
                >
                    <span className="label">Orientation</span>
                    <Creatable
                        options={[
                            { value: 'Vertical', label: 'Vertical' },
                            { value: 'Horizontal', label: 'Horizontal' },
                        ]}
                        defaultValue={orientation}
                        className="white-border"
                        styles={customStyles}
                        placeholder={'Select Orientation'}
                        isMulti={false}
                        onChange={(values) => {
                            setOrientation(values)
                        }}
                    />
                </div>
                <div
                    style={{
                        padding: '10px',
                        display: 'flex',
                    }}
                >
                    {exerciseInfo?.gifUrl ? (
                        <video
                            className="exercise-video"
                            src={exerciseInfo?.gifUrl}
                            autoPlay
                            loop
                        />
                    ) : null}
                    <div style={{ flexGrow: 1 }}>
                        <span>{animation ? animation?.name : null}</span>
                        <span style={{ color: 'red', fontSize: '12px' }}>
                            {!isValid && error.animation
                                ? error.animation
                                : null}
                        </span>
                        <UploadFileButton
                            name={'Upload Animation'}
                            id={'Upload Animation'}
                            buttonText={
                                exerciseInfo
                                    ? 'Update Animation'
                                    : 'Upload Animation'
                            }
                            onChange={(e) => {
                                setAnimation(e.target.files[0])
                                setIsValid(true)
                            }}
                        />
                    </div>
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div
                    style={{
                        margin: '10px',
                        padding: '10px',
                        color: '#36f5c7',
                    }}
                >
                    {/* <Button
                        onClick={handleCancel}
                        text="Cancel"
                        classNames={'mybutton1 mybutton'}
                    /> */}
                    {isLoading ? <Loader /> : null}
                </div>
                <div style={{ margin: '10px' }}>
                    <Button
                        classNames="mybutton"
                        text={exerciseInfo ? 'Save' : 'Add'}
                        color="green"
                        onClick={
                            exerciseInfo
                                ? handleUpdateExercise
                                : handleAddExercise
                        }
                    />
                </div>
            </div>
            {/* {isLoading ?  */}
            {/* <div style={{position: 'absolute', top: '70%', left: '50%'}}>
                    <Loader/>
                    <div style={{textAlign: 'center'}}>Saving Data</div> 
                </div> */}
            {/* : null
            } */}
        </div>
    )
}

export default AddExerciseToDB
