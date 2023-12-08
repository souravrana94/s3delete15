import React from 'react'
import AddTableTemplate from './AddTableTemplate'

const form = [
    {
        type: 'text',
        placeholder: 'Cardio Form',
        fieldName: 'name',
        helper: 'Enter the Cardio Form Name',
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

const CardioForm = () => {
    return (
        <AddTableTemplate
            productForm={form}
            updateForm={updateForm}
            tableDetails={tableDetails}
            fetchURL={'workout/admin/cardio-form/page'}
            postURL={'workout/admin/cardio-form'}
            deleteURL={'workout/admin/cardio-form'}
            updateURL={'workout/admin/cardio-form'}
            formName={'Cardio Forms'}
        />
    )
}

export default CardioForm
