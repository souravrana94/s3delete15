import React from 'react'
import AddTableTemplate from './AddTableTemplate'

const form = [
    {
        type: 'text',
        placeholder: 'Certificate',
        fieldName: 'certificateName',
        helper: 'Enter the Certificate Name',
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

const CertificateName = () => {
    return (
        <AddTableTemplate
            productForm={form}
            updateForm={updateForm}
            tableDetails={tableDetails}
            fetchURL={'workout/admin/certificate-name/page'}
            postURL={'workout/admin/certificate-name'}
            deleteURL={'workout/admin/certificate-name'}
            updateURL={'workout/admin/certificate-name'}
            formName={'Certificate'}
        />
    )
}

export default CertificateName
