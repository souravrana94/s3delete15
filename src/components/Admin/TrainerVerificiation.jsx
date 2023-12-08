import React from 'react'
import AddTableTemplate from './AddTableTemplate'

const form = [
    {
        type: 'text',
        placeholder: 'Gender',
        fieldName: 'gender',
        helper: 'Gender',
        required: true,
        classNames: 'col-md-6 mr-1',
    },
    {
        type: 'text',
        placeholder: 'Age',
        fieldName: 'age',
        helper: 'Age',
        required: true,
        classNames: 'col-md-6 mr-1',
    },
    {
        type: 'text',
        placeholder: 'Experience',
        fieldName: 'experience',
        helper: 'Experience',
        required: true,
        classNames: 'col-md-6 mr-1',
    },
    {
        type: 'text',
        placeholder: 'People Trained',
        fieldName: 'peopleTrained',
        helper: 'People Trained',
        required: true,
        classNames: 'col-md-6 mr-1',
    },
]

const updateForm = [
    {
        type: 'hidden-text',
        placeholder: 'id',
        fieldName: 'id',
        helper: '',
        required: true,
    },
    {
        type: 'text',
        placeholder: 'Gender',
        fieldName: 'gender',
        helper: 'Gender',
        required: true,
        classNames: 'col-md-6 mr-1',
    },
    {
        type: 'text',
        placeholder: 'Age',
        fieldName: 'age',
        helper: 'Age',
        required: true,
        classNames: 'col-md-6 mr-1',
    },
    {
        type: 'text',
        placeholder: 'Experience',
        fieldName: 'experience',
        helper: 'Experience',
        required: true,
        classNames: 'col-md-6 mr-1',
    },
    {
        type: 'text',
        placeholder: 'People Trained',
        fieldName: 'peopleTrained',
        helper: 'People Trained',
        required: true,
        classNames: 'col-md-6 mr-1',
    },
    // TODO COMPLETE
    // ...form,
]

const tableDetails = [
    ...updateForm,
    {
        placeholder: 'Edit',
        fieldName: 'editButton',
    },
    {
        placeholder: 'Delete',
        fieldName: 'deleteButton',
    },
]

const TrainerVerification = () => {
    return (
        <AddTableTemplate
            productForm={form}
            updateForm={updateForm}
            tableDetails={tableDetails}
            fetchURL={'workout/trainer/profile/page/unverified'}
            postURL={'workout/admin/activity-level'}
            deleteURL={'workout/admin/activity-level'}
            updateURL={'workout/admin/activity-level'}
            formName={'Trainer Verification'}
        />
    )
}

export default TrainerVerification
