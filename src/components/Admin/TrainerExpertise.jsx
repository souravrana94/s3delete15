import React from 'react'
import AddTableTemplate from './AddTableTemplate'

const form = [
    {
        type: 'text',
        placeholder: 'Trainer Expertise',
        fieldName: 'name',
        helper: 'Enter the Trainer Expertise Name',
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
    ...form,
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

const TrainerExpertise = () => {
    return (
        <AddTableTemplate
            productForm={form}
            updateForm={updateForm}
            tableDetails={tableDetails}
            fetchURL={'workout/admin/trainer-expertise/page'}
            postURL={'workout/admin/trainer-expertise'}
            deleteURL={'workout/admin/trainer-expertise'}
            updateURL={'workout/admin/trainer-expertise'}
            formName={'Trainer Expertises'}
        />
    )
}

export default TrainerExpertise
