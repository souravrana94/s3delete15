import React, { useState } from 'react'
import axios from '../../store/axios-secure'
import PropTypes from 'prop-types'
import Form from '../Common/Form/Form'
import Table from '../Common/Table'
import Modal from '../Common/Modal'
import Loader from '../Common/Loader'
import Button from '../Common/Button'
import ErrorPage from '../Common/ErrorPage/InternalServerErrorPage'

const AddTableTemplate = ({
    productForm,
    updateForm,
    tableDetails = [],
    fetchURL,
    postURL,
    updateURL,
    deleteURL,
    formName,
}) => {
    const [defaultValues, setDefaultValues] = useState([])
    const [showModalUpdate, setShowModalUpdate] = useState(false)
    const [showModalAdd, setShowModalAdd] = useState(false)
    const [data, setData] = React.useState([])
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState(false)
    const [pageCount, setPageCount] = React.useState(0)
    const fetchIdRef = React.useRef(0)

    const fetchData = React.useCallback(
        async ({ pageSize, pageIndex, searchText }) => {
            try {
                const fetchId = ++fetchIdRef.current

                // Set the loading state
                // setLoading(true)

                if (fetchId === fetchIdRef.current) {
                    const response = await axios.get(
                        `${fetchURL}?pageNo=${
                            pageIndex + 1
                        }&pageSize=${pageSize}&searchText=${searchText}`,
                    )

                    const content = response?.data?.content.map((row) => {
                        return {
                            ...row,
                            editButton: (
                                <span
                                    onClick={() => {
                                        editRow(row)
                                    }}
                                >
                                    Edit Icon
                                </span>
                            ),
                            deleteButton: (
                                <span
                                    onClick={() => {
                                        deleteRow(row)
                                    }}
                                >
                                    Delete Icon
                                </span>
                            ),
                        }
                    })

                    const totalPages = response?.data?.totalPages

                    setData(content)
                    setPageCount(totalPages)
                    setLoading(false)
                }
            } catch (err) {
                setError(true)
            }
        },
        [],
    )

    // TOOD update Data, also for edit has to use new data
    const updateData = () => {
        setShowModalUpdate(false)
        // const submittedData = param?.data
        // const updatedData = data?.map((d) => {
        //     if (parseInt(d.id) === parseInt(submittedData?.id))
        //         return { ...d, ...submittedData }
        //     else return d
        // })
        // setData(updatedData)
    }

    const editRow = (row) => {
        setDefaultValues(row)
        setShowModalUpdate(true)
    }

    // TODO Error on that row instead of full screen error
    const deleteRow = async (row) => {
        try {
            await axios.delete(deleteURL + '/' + row.id)
        } catch (err) {
            setError(true)
        }
        alert('Deleted')
    }

    const columns = React.useMemo(
        () =>
            tableDetails.map((form) => {
                if (form.render) {
                    return {
                        Header: form.placeholder,
                        accessor: form.fieldName,
                        Cell: form.render,
                    }
                } else
                    return {
                        Header: form.placeholder,
                        accessor: form.fieldName,
                    }
            }),
        [],
    )

    const displayData = (
        <div className="container-lg mb-5">
            <Button
                classNames="w-mc mt-4"
                color="green"
                text={`Add ${formName}`}
                onClick={() => setShowModalAdd(true)}
            />

            <Table
                columns={columns}
                data={data}
                fetchData={fetchData}
                loading={loading}
                pageCount={pageCount}
            />

            <Modal show={showModalAdd} onHide={() => setShowModalAdd(false)}>
                <Form
                    darkTheme={true}
                    formDetails={productForm}
                    formName={formName}
                    postUrl={postURL}
                    requestType="post"
                    callback={() => setShowModalAdd(false)}
                />
            </Modal>

            <Modal
                show={showModalUpdate}
                onHide={() => setShowModalUpdate(false)}
                title={formName}
            >
                <Form
                    darkTheme={true}
                    formDetails={updateForm}
                    formName={formName}
                    postUrl={updateURL}
                    requestType="put"
                    defaultValues={defaultValues}
                    callback={updateData}
                />
            </Modal>
        </div>
    )

    return loading ? <Loader /> : error ? <ErrorPage /> : displayData
}

AddTableTemplate.propTypes = {
    productForm: PropTypes.array,
    updateForm: PropTypes.array,
    tableDetails: PropTypes.array,
    fetchURL: PropTypes.string,
    postURL: PropTypes.string,
    updateURL: PropTypes.string,
    deleteURL: PropTypes.string,
    formName: PropTypes.string,
}

export default AddTableTemplate
