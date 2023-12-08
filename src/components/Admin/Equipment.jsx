import React from 'react'
import AddTableTemplate from './AddTableTemplate'

const form = [
    {
        type: 'text',
        placeholder: 'Equipment',
        fieldName: 'name',
        helper: 'Enter the Equipment Name',
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

const Equipment = () => {
    return (
        <AddTableTemplate
            productForm={form}
            updateForm={updateForm}
            tableDetails={tableDetails}
            fetchURL={'workout/admin/equipment/page'}
            postURL={'workout/admin/equipment'}
            deleteURL={'workout/admin/equipment'}
            updateURL={'workout/admin/equipment'}
            formName={'Equipments'}
        />
    )
}

export default Equipment
