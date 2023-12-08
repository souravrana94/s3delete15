import React from 'react'
import AddTableTemplate from './AddTableTemplate'

const activityLevelForm = [
    {
        type: 'text',
        placeholder: 'Activity Level',
        fieldName: 'name',
        helper: 'Enter the Activity Level Name',
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
    ...activityLevelForm,
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

const ActivityLevel = () => {
    return (
        <AddTableTemplate
            productForm={activityLevelForm}
            updateForm={updateForm}
            tableDetails={tableDetails}
            fetchURL={'workout/admin/activity-level/page'}
            postURL={'workout/admin/activity-level'}
            deleteURL={'workout/admin/activity-level'}
            updateURL={'workout/admin/activity-level'}
            formName={'Activity Levels'}
        />
    )
}

export default ActivityLevel
