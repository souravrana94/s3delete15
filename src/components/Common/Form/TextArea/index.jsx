import React from 'react'
import PropTypes from 'prop-types'
import ShadowContainer from '../../ShadowContainer'
import './index.scss'

const TextArea = ({
    id = 'text-area',
    darkTheme = false,
    classNames = '',
    divClassNames = '',
    labelClass,
    label,
    refValue,
    inputClassNames,
    initialValue,
    ...props
}) => {
    const inputClassNamesFinal = darkTheme ? 'white-border' : inputClassNames
    const getTextArea = (
        <ShadowContainer classNames={`search-box ${divClassNames}`}>
            <textarea
                id={id}
                rows="4"
                cols="50"
                className={`search-box-input ${inputClassNamesFinal}`}
                {...props}
                defaultValue={initialValue}
                ref={refValue}
            />
        </ShadowContainer>
    )

    return (
        <>
            {label ? (
                <div className="text-area-container">
                    <div className={`label-text-container ${labelClass}`}>
                        {label && (
                            <label className="label" htmlFor={id}>
                                {label}
                            </label>
                        )}
                    </div>
                    {getTextArea}
                </div>
            ) : (
                <div className="text-area-container">{getTextArea}</div>
            )}
        </>
    )
}

TextArea.propTypes = {
    classNames: PropTypes.string,
    divClassNames: PropTypes.string,
    id: PropTypes.string,
    label: PropTypes.string,
    refValue: PropTypes.func,
}

export default TextArea
