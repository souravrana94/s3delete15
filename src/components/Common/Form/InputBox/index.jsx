import React from 'react'
import PropTypes from 'prop-types'
import './index.scss'

const InputBox = ({
    id = '',
    darkTheme = false,
    divClassNames = '',
    type = 'text',
    label,
    refValue,
    inputLabel,
    placeholderStyle,
    labelClass = '',
    inputClassNames,
    errorClassName,
    maxLength,
    required = false,
    ...props
}) => {
    const inputClassNamesFinal = darkTheme ? 'white-border' : inputClassNames

    const getInputBox = (
        <div className={`search-box ${divClassNames}`}>
            <input
                min={1}
                id={id}
                type={type}
                className={`search-box-input ${errorClassName} ${inputClassNamesFinal}`}
                style={placeholderStyle}
                ref={refValue}
                onInput={(e) => {
                    e.target.value = e.target.value.slice(0, maxLength)
                }}
                {...props}
            />
        </div>
    )

    return label ? (
        <div className="label-input-container">
            <div className={`label-text-container ${labelClass}`}>
                {label && (
                    <label className="label" htmlFor={id}>
                        {label}
                        {required ? (
                            <small className="message error">*</small>
                        ) : (
                            <></>
                        )}
                    </label>
                )}
            </div>
            <div className="input-container">
                {inputLabel && <div className="input-label">{inputLabel}</div>}
                {getInputBox}
            </div>
        </div>
    ) : (
        getInputBox
    )
}

InputBox.propTypes = {
    errorClassName: PropTypes.string,
    divClassNames: PropTypes.string,
    type: PropTypes.string,
    darkTheme: PropTypes.bool,
    id: PropTypes.string,
    label: PropTypes.string,
    refValue: PropTypes.func,
    agew: PropTypes.string,
    inputLabel: PropTypes.string,
    placeholderStyle: PropTypes.string,
    labelClass: PropTypes.string,
    inputClassNames: PropTypes.string,
}

export default InputBox
