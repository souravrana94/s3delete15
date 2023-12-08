import React, { useState } from 'react'
import PropTypes from 'prop-types'
import './index.scss'
import { Icon } from '@iconify/react'

const UploadFileButton = ({
    buttonText = 'Upload File',
    acceptableFileExtensions = ['.png', '.jpg'],
    refValue,
    name,
    isError,
    onChange = (e) => {
        return null
    },
    id,
    disabled = false,
    required = false,
    ...props
}) => {
    const [image, setImage] = useState({ preview: '', raw: '' })
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('Please Select a file')

    const handleChange = (e) => {
        setError('')
        setErrorMessage('')
        if (e.target.files.length === 0) {
            return
        }
        const error = onChange(e)
        if (error === null) {
            if (e.target.files.length) {
                setImage({
                    name: e.target.files[0]?.name,
                    raw: e.target.files[0],
                })
            }
        } else {
            setError(true)
            setErrorMessage(error)
            setImage({
                preview: '',
                raw: '',
            })
        }
    }

    return (
        <>
            <div className="upload-btn-container">
                <label htmlFor={`upload-button-${id}`}>
                    <span className="btn-evolv button-container">
                        {/* <img src="/images/upload_file.svg" alt="" /> */}
                        <Icon icon={'bi:upload'} height={20} />
                        <p>{image?.name || buttonText}</p>
                        {required ? (
                            <small className="message error">*</small>
                        ) : (
                            <></>
                        )}
                    </span>
                </label>

                <input
                    ref={refValue}
                    name={name}
                    type="file"
                    id={`upload-button-${id}`}
                    disabled={disabled}
                    style={{ display: 'none' }}
                    onChange={handleChange}
                    accept={acceptableFileExtensions.join()}
                />
            </div>
            {(isError || error) && (
                <small className="text-danger">{errorMessage}</small>
            )}
        </>
    )
}

UploadFileButton.propTypes = {
    buttonText: PropTypes.string,
    refValue: PropTypes.func,
    name: PropTypes.string,
    id: PropTypes.string,
    isError: PropTypes.object,
}

export default UploadFileButton
