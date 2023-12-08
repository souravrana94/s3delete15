import React, { useEffect, useState } from 'react'
import axios from '../../store/axios-secure'
import Loader from '../Common/Loader'
import AddTableTemplate from './AddTableTemplate'

const Exercise = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [form, setForm] = useState([
        {
            type: 'text',
            placeholder: 'Exercise Name',
            fieldName: 'name',
            helper: 'Enter the Exercise Name',
            required: true,
            classNames: 'col-md-6 mr-1',
        },
        {
            type: 'list',
            placeholder: 'Muscle Group',
            fieldName: 'muscleGroup',
            // helper: 'Muscle  Details',
            required: true,
            classNames: 'col-md-12',
            subFields: [
                {
                    type: 'dynamic-dropdown',
                    helper: 'Please select a muscle',
                    fieldName: 'muscle',
                    canCreate: false,
                    required: true,
                    classNames: 'col-md-6',
                    placeholder: 'Muscle',
                    multi: false,
                    options: [],
                },
                {
                    type: 'number',
                    placeholder: 'Load Factor',
                    fieldName: 'loadFactor',
                    helper: 'Load Factor',
                    required: true,
                    classNames: 'col-lg-3 col-md-6',
                },
            ],
        },
        {
            type: 'text',
            placeholder: 'Progression Type',
            fieldName: 'progressionType',
            helper: 'Progression Type',
            required: true,
            classNames: 'col-md-6 mr-1',
        },
        {
            type: 'number',
            placeholder: 'Difficulty Rating',
            fieldName: 'difficultyRating',
            helper: 'Difficulty Rating',
            required: true,
            classNames: 'col-lg-3 col-md-6',
        },
        {
            type: 'dynamic-dropdown',
            helper: 'Load Type',
            fieldName: 'loadType',
            canCreate: false,
            required: true,
            classNames: 'col-md-6',
            placeholder: 'Load Type',
            multi: false,
            options: [],
        },
        {
            type: 'dynamic-dropdown',
            helper: 'Movement',
            fieldName: 'movement',
            canCreate: false,
            required: true,
            classNames: 'col-md-6',
            placeholder: 'Movement',
            multi: false,
            options: [],
        },
        {
            type: 'number',
            placeholder: 'Set Rest Time',
            fieldName: 'setRestTime',
            helper: 'Set Rest Time',
            required: true,
            classNames: 'col-md-6',
        },
        {
            type: 'number',
            placeholder: 'Switch Rest Time',
            fieldName: 'switchRestTime',
            helper: 'Switch Rest Time',
            required: true,
            classNames: 'col-md-6',
        },
        {
            type: 'dynamic-dropdown',
            helper: 'Equipments',
            idFieldName: 'equipments',
            fieldName: 'equipmentIds',
            canCreate: false,
            required: false,
            classNames: 'col-md-6',
            placeholder: 'Equipments',
            multi: true,
            options: [],
        },
        {
            type: 'dynamic-dropdown',
            helper: 'Type',
            fieldName: 'type',
            canCreate: false,
            required: true,
            classNames: 'col-md-6',
            placeholder: 'type',
            multi: false,
            options: [],
        },
        {
            type: 'dynamic-dropdown',
            helper: 'Workout Splits',
            fieldName: 'workoutSplits',
            canCreate: false,
            required: true,
            classNames: 'col-md-6',
            placeholder: 'Workout Splits',
            multi: true,
            options: [],
        },
        {
            type: 'text',
            placeholder: 'Video URL',
            fieldName: 'videoUrl',
            helper: 'Video URL',
            required: true,
            classNames: 'col-md-6 mr-1',
        },
    ])

    const updateOptionsForKey = (formCopy, options, optionKey) => {
        formCopy.forEach((f, idx) => {
            if (f.type === 'list') {
                f.subFields.forEach((sf, subIdx) => {
                    if (
                        sf.fieldName === optionKey ||
                        sf.idFieldName === optionKey
                    ) {
                        formCopy[idx].subFields[subIdx].options =
                            options[optionKey]
                    }
                })
            } else {
                if (f.fieldName === optionKey || f.idFieldName === optionKey) {
                    formCopy[idx].options = options[optionKey]
                }
            }
        })
    }
    const fetchOptions = async () => {
        setIsLoading(true)
        try {
            const response = await axios.get('workout/admin/exercise/dropdown')
            const options = response?.data
            const formCopy = [...form]
            Object.keys(options).forEach((optionKey) => {
                updateOptionsForKey(formCopy, options, optionKey)
            })
            setForm(formCopy)
            setIsLoading(false)
        } catch (error) {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchOptions()
    }, [])

    const updateForm = [
        {
            type: 'hidden-text',
            placeholder: 'id',
            fieldName: 'id',
            helper: '',
            required: true,
        },
        ...form,
    ]

    const tableDetails = [
        {
            type: 'text',
            placeholder: 'Exercise Name',
            fieldName: 'name',
            helper: 'Enter the Exercise Name',
            required: true,
            classNames: 'col-md-6 mr-1',
        },
        {
            placeholder: 'Edit',
            fieldName: 'editButton',
        },
        {
            placeholder: 'Delete',
            fieldName: 'deleteButton',
        },
    ]

    return isLoading ? (
        <Loader />
    ) : (
        <AddTableTemplate
            productForm={form}
            updateForm={updateForm}
            tableDetails={tableDetails}
            fetchURL={'workout/admin/exercise/page'}
            postURL={'workout/admin/exercise'}
            deleteURL={'workout/admin/exercise'}
            updateURL={'workout/admin/exercise'}
            formName={'Exercise'}
        />
    )
}

export default Exercise
