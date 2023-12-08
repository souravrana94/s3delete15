import React from 'react'
import AddTableTemplate from './AddTableTemplate'

const medicalConditionForm = [
    {
        type: 'text',
        placeholder: 'Medical Condition',
        fieldName: 'name',
        helper: 'Enter the Medical Condition Name',
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
    ...medicalConditionForm,
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

const MedicalConditions = () => {
    return (
        <AddTableTemplate
            productForm={medicalConditionForm}
            updateForm={updateForm}
            tableDetails={tableDetails}
            fetchURL={'workout/admin/medical-condition/page'}
            postURL={'workout/admin/medical-condition'}
            deleteURL={'workout/admin/medical-condition'}
            updateURL={'workout/admin/medical-condition'}
            formName={'Medical Conditions'}
        />
    )
}

export default MedicalConditions
